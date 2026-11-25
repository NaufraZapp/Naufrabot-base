// 👁️ VISTA ÚNICA
// WhatsApp ahora entrega las vistas únicas de dos formas a los bots:
//  1) Con contenido (si el bot está conectado como "Android", ver /modoconexion):
//     llega la foto/video/audio con su clave → se descarga AL MOMENTO y se guarda
//     unas horas, porque cuando alguien la abre en su teléfono el enlace caduca.
//  2) Sin contenido (bot conectado como "WhatsApp Web"): llega solo la "cáscara"
//     (key.isViewOnce = true, sin message). Ahí no hay nada que revelar, y /revelar
//     lo explica en vez de dar un error genérico.

const fs = require('fs')
const path = require('path')

// Copias temporales (se borran solas a las 24 h)
const DIR = path.join(__dirname, '..', 'vistaunica_temp')
const HORAS_GUARDADO = 24
const MAX_BYTES = 25 * 1024 * 1024 // 25 MB

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })

// Diagnóstico para /modoconexion: ¿le llegan al bot las vistas únicas con contenido o vacías?
const recepcion = { conContenido: 0, vacias: 0, desde: Date.now(), ultima: null }

const _baileys = {}
async function baileys() {
  if (!_baileys.ok) {
    Object.assign(_baileys, await import('@whiskeysockets/baileys'))
    _baileys.ok = true
  }
  return _baileys
}

const silentLogger = { info() {}, error() {}, warn() {}, debug() {}, trace() {}, child() { return silentLogger } }

const seguro = id => String(id || '').replace(/[^a-zA-Z0-9_-]/g, '_')
const rutaMeta = id => path.join(DIR, seguro(id) + '.json')
const rutaBin = id => path.join(DIR, seguro(id) + '.bin')

/**
 * Desenvuelve un mensaje y dice si es vista única.
 * Cubre viewOnceMessage, viewOnceMessageV2, viewOnceMessageV2Extension,
 * el flag viewOnce:true dentro de la media y mensajes temporales (ephemeral).
 * Devuelve { tipo: 'image'|'video'|'audio', media } o null.
 */
function detectar(message) {
  let m = message
  let envuelto = false
  for (let i = 0; i < 8 && m && typeof m === 'object'; i++) {
    const sig =
      (m.ephemeralMessage && m.ephemeralMessage.message) ||
      (m.viewOnceMessage && (envuelto = true) && m.viewOnceMessage.message) ||
      (m.viewOnceMessageV2 && (envuelto = true) && m.viewOnceMessageV2.message) ||
      (m.viewOnceMessageV2Extension && (envuelto = true) && m.viewOnceMessageV2Extension.message) ||
      (m.documentWithCaptionMessage && m.documentWithCaptionMessage.message)
    if (!sig) break
    m = sig
  }
  if (!m) return null
  for (const tipo of ['image', 'video', 'audio']) {
    const media = m[tipo + 'Message']
    if (media && (envuelto || media.viewOnce)) return { tipo, media }
  }
  return null
}

/**
 * Desenvuelve CUALQUIER mensaje (temporal, vista única, documento con texto…) y
 * devuelve la media que trae: { tipo: 'image'|'video'|'sticker'|'audio', media, vistaUnica } o null.
 */
function extraer(message) {
  const vu = detectar(message)
  if (vu) return { ...vu, vistaUnica: true }
  let m = message
  for (let i = 0; i < 8 && m && typeof m === 'object'; i++) {
    const sig = (m.ephemeralMessage && m.ephemeralMessage.message) ||
      (m.documentWithCaptionMessage && m.documentWithCaptionMessage.message) ||
      (m.editedMessage && m.editedMessage.message)
    if (!sig) break
    m = sig
  }
  if (!m) return null
  for (const tipo of ['image', 'video', 'sticker', 'audio']) {
    if (m[tipo + 'Message']) return { tipo, media: m[tipo + 'Message'], vistaUnica: false }
  }
  if (m.ptvMessage) return { tipo: 'video', media: m.ptvMessage, vistaUnica: false }
  return null
}

function limpiarViejos() {
  try {
    const limite = Date.now() - HORAS_GUARDADO * 3600 * 1000
    for (const f of fs.readdirSync(DIR)) {
      const p = path.join(DIR, f)
      try { if (fs.statSync(p).mtimeMs < limite) fs.unlinkSync(p) } catch (e) {}
    }
  } catch (e) {}
}
let _ultimaLimpieza = 0

/** Descarga y guarda una vista única que acaba de llegar (para /revelar y para hacer stickers con ella). Se borra a las 24 h. */
async function guardar(sock, info) {
  try {
    const d = detectar(info.message)
    if (!d || !info.key || !info.key.id) return false
    if (d.media && d.media.mediaKey) { recepcion.conContenido++; recepcion.ultima = 'con contenido' }
    if (fs.existsSync(rutaBin(info.key.id))) return true
    if (Number(d.media.fileLength || 0) > MAX_BYTES) return false
    if (!d.media.mediaKey) { recepcion.vacias++; recepcion.ultima = 'vacía'; return false }

    const b = await baileys()
    const buffer = await b.downloadMediaMessage(info, 'buffer', {}, { logger: silentLogger, reuploadRequest: sock.updateMediaMessage })
    if (!buffer || !buffer.length) return false

    fs.writeFileSync(rutaBin(info.key.id), buffer)
    fs.writeFileSync(rutaMeta(info.key.id), JSON.stringify({
      tipo: d.tipo,
      mimetype: d.media.mimetype || '',
      caption: d.media.caption || '',
      ptt: !!d.media.ptt,
      autor: info.key.participant || info.key.remoteJid,
      chat: info.key.remoteJid,
      ts: Date.now()
    }))

    if (Date.now() - _ultimaLimpieza > 3600 * 1000) { _ultimaLimpieza = Date.now(); limpiarViejos() }
    return true
  } catch (e) {
    return false
  }
}

/** WhatsApp avisó que hubo una vista única pero no mandó el contenido. */
function marcarNoEntregada(info) {
  try {
    if (!info.key || !info.key.id || fs.existsSync(rutaMeta(info.key.id))) return
    recepcion.vacias++; recepcion.ultima = 'vacía'
    fs.writeFileSync(rutaMeta(info.key.id), JSON.stringify({
      noEntregada: true,
      autor: info.key.participant || info.key.remoteJid,
      chat: info.key.remoteJid,
      ts: Date.now()
    }))
  } catch (e) {}
}

// Descarga la media de un mensaje (como m.quoted.download()): no necesita la "key" del mensaje,
// solo la clave de la media que viene dentro del mensaje citado.
async function descargarMedia(media, tipo) {
  const b = await baileys()
  const fn = b.downloadContentFromMessage || (b.default && b.default.downloadContentFromMessage)
  const stream = await fn(media, tipo === 'sticker' ? 'sticker' : tipo)
  const partes = []
  for await (const ch of stream) partes.push(ch)
  return Buffer.concat(partes)
}

/**
 * Busca la vista única (o cualquier foto/video/audio) a la que se respondió.
 * Igual que el comando "rvo": primero descarga DIRECTO lo que trae el mensaje citado
 * (cuando respondes a una vista única, WhatsApp manda en la cita la foto con su clave,
 * a veces SIN la marca de vista única). Si eso falla, usa la copia que el bot guardó al llegar.
 * Devuelve { buffer, tipo, mimetype, caption, ptt } | { noEntregada } | { sinMedia } | { caducada }
 */
async function obtener(sock, stanzaId, quotedMessage, chat, participant) {
  const d = quotedMessage ? extraer(quotedMessage) : null
  const listo = (buffer, m) => ({ buffer, tipo: m.tipo, mimetype: m.mimetype || '', caption: m.caption || '', ptt: !!m.ptt })

  // 1) La copia que el bot guardó cuando llegó (o la última vez que la descargó).
  //    Va primero: WhatsApp borra la vista única de su servidor después de abrirla,
  //    así que /s y luego /revelar sobre la misma tienen que salir de aquí.
  let meta = null
  try { if (stanzaId && fs.existsSync(rutaMeta(stanzaId))) meta = JSON.parse(fs.readFileSync(rutaMeta(stanzaId), 'utf8')) } catch (e) {}
  if (meta && !meta.noEntregada && fs.existsSync(rutaBin(stanzaId))) {
    return listo(fs.readFileSync(rutaBin(stanzaId)), meta)
  }

  // 2) Descargar directo desde el mensaje citado (como el comando "rvo")
  if (d && ['image', 'video', 'audio'].includes(d.tipo) && d.media && d.media.mediaKey) {
    const datos = { tipo: d.tipo, mimetype: d.media.mimetype || '', caption: d.media.caption || '', ptt: !!d.media.ptt }
    let buffer = null
    try { buffer = await descargarMedia(d.media, d.tipo) } catch (e) {}
    if (!buffer || !buffer.length) {
      try {
        const b = await baileys()
        const fake = { key: { remoteJid: chat, id: stanzaId, fromMe: false, participant }, message: { [d.tipo + 'Message']: d.media } }
        buffer = await b.downloadMediaMessage(fake, 'buffer', {}, { logger: silentLogger, reuploadRequest: sock.updateMediaMessage })
      } catch (e) {}
    }
    if (buffer && buffer.length) {
      // se guarda para la próxima vez (por si después la piden de nuevo)
      try {
        if (stanzaId) {
          fs.writeFileSync(rutaBin(stanzaId), buffer)
          fs.writeFileSync(rutaMeta(stanzaId), JSON.stringify({ ...datos, autor: participant, chat, ts: Date.now() }))
        }
      } catch (e) {}
      return listo(buffer, datos)
    }
    return { caducada: true }
  }

  if (!d) return meta && meta.noEntregada ? { noEntregada: true, motivo: 'vacia', ts: meta.ts } : { sinMedia: true }
  // Sin clave: no hay cómo descargarla. ¿Por qué?
  if (meta && meta.noEntregada) return { noEntregada: true, motivo: 'vacia', ts: meta.ts }   // llegó como aviso vacío
  return { noEntregada: true, motivo: 'desconocida' }                                       // el bot no la vio llegar
}

// Explica por qué no se pudo, según el modo de conexión y lo que se sabe del mensaje
function explicarFallo(r, prefix, esDueno) {
  let cx = null
  try { cx = require('./conexion.js') } catch (e) {}
  const enWeb = !cx || cx.info.efectivo === 'web' || !cx.info.soportaAndroid
  if (enWeb) {
    return `📵 *No puedo revelar esa vista única.*\n\nEl bot está conectado como *WhatsApp Web*, y WhatsApp no le manda las vistas únicas (solo un aviso vacío).` +
      (esDueno ? `\n\n👑 Actívalo con *${prefix}modoconexion android*` : '\n\nAvísale al dueño del bot.')
  }
  const cuando = r.ts ? new Date(r.ts).toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : null
  return `📵 *No puedo revelar esa vista única.*\n\n` + (r.motivo === 'vacia'
    ? `Me llegó *vacía*${cuando ? ` (${cuando})` : ''}: seguramente se envió *antes* de activar el modo Android.\n\n✅ Las que manden a partir de ahora sí funcionan: pide que te envíen una nueva.`
    : `No la vi llegar (pudo enviarse mientras el bot estaba apagado o reiniciándose, o antes del modo Android).\n\n✅ Pide que te envíen una nueva y prueba otra vez.`) +
    (esDueno ? `\n\n👑 Diagnóstico: *${prefix}modoconexion*` : '')
}

module.exports = { explicarFallo, detectar, extraer, guardar, marcarNoEntregada, obtener, descargarMedia, recepcion }
