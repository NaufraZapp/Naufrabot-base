// 🔊 STICKERS CON SONIDO (WhatsApp los lanzó el 24/11/2026)
//
// Cómo se usa:
//   1) Responde a una foto, video, GIF o sticker con /stickersonido
//      · Si es un VIDEO con sonido, el bot usa el sonido del mismo video y listo.
//   2) Si es foto, GIF, sticker o video sin sonido: envía un audio o nota de voz (máx. 10 s) en 2 minutos
//   → el bot manda UN sticker que suena al tocarlo.
//
// Cómo funciona por dentro (igual que WhatsApp):
//   Message.audioStickerMessage (campo 134, FutureProofMessage)
//     └ message.stickerMessage (campo 26)
//         └ stickerMessage.audioMessage (campo 26 dentro del sticker) ← el sonido (OGG Opus)
// Baileys 7.0.0-rc14 todavía no conoce esos campos y los borraría al enviar, así que el mensaje
// se arma aquí en bytes ("en crudo"). Si algo falla, se manda el sticker y el audio por separado.

const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { execFile } = require('child_process')

const ESPERA_MS = 2 * 60 * 1000
const MAX_SEG = 10
const pendientes = new Map() // `${chat}|${persona}` → { webp, animado, ts }

const _b = {}
async function baileys() {
  if (!_b.ok) { Object.assign(_b, await import('@whiskeysockets/baileys')); _b.ok = true }
  return _b
}
const pick = (b, k) => b[k] || (b.default && b.default[k])

// ---------------------------------------------------------------- protobuf a mano
function varint(n) {
  const out = []
  n = Number(n)
  while (n > 127) { out.push((n & 0x7f) | 0x80); n = Math.floor(n / 128) }
  out.push(n)
  return Buffer.from(out)
}
// campo "length-delimited" (tipo 2): tag + largo + bytes
const campo = (num, bytes) => Buffer.concat([varint(num * 8 + 2), varint(bytes.length), Buffer.from(bytes)])

// Message con audioStickerMessage, en bytes
function armarBytes(proto, stickerMessage, audioMessage) {
  const stickerBytes = proto.Message.StickerMessage.encode(stickerMessage).finish()
  const audioBytes = proto.Message.AudioMessage.encode(audioMessage).finish()
  const stickerConSonido = Buffer.concat([Buffer.from(stickerBytes), campo(26, audioBytes)]) // StickerMessage.audioMessage = 26
  const mensajeInterno = campo(26, stickerConSonido)                                          // Message.stickerMessage = 26
  const futureProof = campo(1, mensajeInterno)                                                // FutureProofMessage.message = 1
  return campo(134, futureProof)                                                              // Message.audioStickerMessage = 134
}

// Baileys codifica con proto.Message.encode(...). Para nuestros mensajes (marcados con __crudo)
// se devuelven los bytes ya armados, también cuando Baileys los envuelve para tus otros dispositivos.
let parcheado = false
function parchearEncode(proto) {
  if (parcheado) return
  parcheado = true
  const orig = proto.Message.encode.bind(proto.Message)
  const comoWriter = bytes => ({ finish: () => new Uint8Array(bytes) })
  proto.Message.encode = function (m, w) {
    if (m && m.__crudo && !w) return comoWriter(m.__crudo)
    const dsm = m && m.deviceSentMessage
    if (!w && dsm && dsm.message && dsm.message.__crudo) {
      const resto = { ...m }; delete resto.deviceSentMessage
      const base = Buffer.from(orig(resto).finish())
      const partes = []
      if (dsm.destinationJid) partes.push(campo(1, Buffer.from(String(dsm.destinationJid))))
      partes.push(campo(2, dsm.message.__crudo))
      if (dsm.phash) partes.push(campo(3, Buffer.from(String(dsm.phash))))
      return comoWriter(Buffer.concat([base, campo(31, Buffer.concat(partes))])) // Message.deviceSentMessage = 31
    }
    return orig(m, w)
  }
}

// ---------------------------------------------------------------- audio
function ffmpeg(args) {
  return new Promise((ok, mal) => execFile('ffmpeg', args, { timeout: 60000 }, e => e ? mal(e) : ok()))
}
function duracion(archivo) {
  return new Promise(ok => execFile('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo], (e, out) => ok(e ? 0 : Math.ceil(Number(out) || 0))))
}
// ¿El video trae sonido de verdad? (pista de audio y que no sea puro silencio)
async function tieneSonido(buffer) {
  const archivo = path.join(os.tmpdir(), crypto.randomBytes(6).toString('hex') + '.mp4')
  fs.writeFileSync(archivo, buffer)
  try {
    const pistas = await new Promise(ok => execFile('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', archivo], (e, out) => ok(e ? '' : String(out).trim())))
    if (!pistas) return false
    const max = await new Promise(ok => execFile('ffmpeg', ['-i', archivo, '-t', String(MAX_SEG), '-vn', '-af', 'volumedetect', '-f', 'null', '-'], { timeout: 60000 }, (e, so, se) => {
      const m = /max_volume:\s*(-?[\d.]+|-inf) dB/.exec(String(se || ''))
      ok(m ? (m[1] === '-inf' ? -999 : Number(m[1])) : -999)
    }))
    return max > -50
  } catch (e) { return false } finally {
    try { fs.unlinkSync(archivo) } catch (e) {}
  }
}

async function aOpus(buffer) {
  const id = crypto.randomBytes(6).toString('hex')
  const entrada = path.join(os.tmpdir(), id + '.in'), salida = path.join(os.tmpdir(), id + '.ogg')
  fs.writeFileSync(entrada, buffer)
  try {
    // máx. 10 s, mono, Opus 48 kbps → muy por debajo del límite de 1 MB
    await ffmpeg(['-y', '-i', entrada, '-vn', '-t', String(MAX_SEG), '-c:a', 'libopus', '-b:a', '48k', '-ac', '1', '-ar', '48000', '-application', 'voip', salida])
    const seg = Math.max(1, Math.min(MAX_SEG, await duracion(salida)))
    return { ogg: fs.readFileSync(salida), seg }
  } finally {
    try { fs.unlinkSync(entrada) } catch (e) {}
    try { fs.unlinkSync(salida) } catch (e) {}
  }
}

// ---------------------------------------------------------------- envío
async function enviar(sock, jid, webp, animado, audioBuffer, quoted) {
  const b = await baileys()
  const proto = pick(b, 'proto')
  const prepare = pick(b, 'prepareWAMessageMedia')
  const { ogg, seg } = await aOpus(audioBuffer)

  try {
    parchearEncode(proto)
    const opts = { upload: sock.waUploadToServer }
    const s = await prepare({ sticker: webp }, opts)
    const a = await prepare({ audio: ogg, mimetype: 'audio/ogg; codecs=opus', ptt: false, seconds: seg }, opts)
    const stickerMessage = s.stickerMessage
    const audioMessage = a.audioMessage
    stickerMessage.isAnimated = !!animado
    stickerMessage.width = stickerMessage.width || 512
    stickerMessage.height = stickerMessage.height || 512
    audioMessage.seconds = seg
    if (quoted && quoted.key) {
      stickerMessage.contextInfo = { stanzaId: quoted.key.id, participant: quoted.key.participant || quoted.key.remoteJid, quotedMessage: quoted.message }
    }
    const bytes = armarBytes(proto, stickerMessage, audioMessage)
    const genId = pick(b, 'generateMessageIDV2') || pick(b, 'generateMessageID')
    const messageId = genId.length ? genId(sock.user && sock.user.id) : genId()
    await sock.relayMessage(jid, { __crudo: bytes, audioStickerMessage: {} }, { messageId })
    return { ok: true }
  } catch (e) {
    console.log('[stickersonido] envío como sticker con sonido falló, mando por separado:', e.message)
    // Respaldo: sticker + nota de voz
    await sock.sendMessage(jid, { sticker: webp }, { quoted })
    await sock.sendMessage(jid, { audio: ogg, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted })
    return { ok: false, error: e.message }
  }
}

// ---------------------------------------------------------------- comando
const clave = (chat, persona) => `${chat}|${String(persona || '').split('@')[0].split(':')[0]}`

async function bufferDe(sock, media, tipo, citado, chat) {
  const vu = require('./vistaunica.js')
  if (citado) {
    const r = await vu.obtener(sock, citado.id, citado.msg, chat, citado.autor)
    if (r && r.buffer) return r.buffer
  }
  return vu.descargarMedia(media, tipo)
}

async function iniciar(ctx) {
  const { naufra, info, from, reply, prefix, pushname, botName } = ctx
  const vu = require('./vistaunica.js')
  const c = info.message?.extendedTextMessage?.contextInfo
  const propio = vu.extraer(info.message)
  const citado = c?.quotedMessage ? vu.extraer(c.quotedMessage) : null
  const sel = (propio && ['image', 'video', 'sticker'].includes(propio.tipo)) ? { ...propio, cit: null }
    : (citado && ['image', 'video', 'sticker'].includes(citado.tipo)) ? { ...citado, cit: { id: c.stanzaId, msg: c.quotedMessage, autor: c.participant } }
    : null
  if (!sel) return void reply(
`🔊 *STICKER CON SONIDO*

1️⃣ Responde a una *foto, video, GIF o sticker* con *${prefix}stickersonido*
2️⃣ Si es un *video con sonido*, el bot usa ese mismo sonido 🎬
3️⃣ Si es foto, GIF o sticker, luego envía un *audio o nota de voz* (máx. ${MAX_SEG} s)

Y listo: un sticker que suena al tocarlo 🎶`)
  if (sel.tipo === 'video' && Number(sel.media.seconds || 0) > 10) return void reply('🎞️ El video debe durar máximo 10 segundos.')

  let webp, animado = false, buf
  try {
    buf = await bufferDe(naufra, sel.media, sel.tipo, sel.cit, from)
    if (sel.tipo === 'sticker') {
      webp = buf
      animado = !!sel.media.isAnimated
    } else {
      const { writeExifImg, writeExifVid } = require('../../fuction/sticker/exif.js')
      const meta = { packname: botName || 'Bot', author: pushname || '' }
      const ruta = sel.tipo === 'image' ? await writeExifImg(buf, meta) : await writeExifVid(buf, meta)
      webp = fs.readFileSync(ruta)
      try { fs.unlinkSync(ruta) } catch (e) {}
      animado = sel.tipo === 'video'
    }
  } catch (e) {
    console.log('[stickersonido] imagen:', e.message)
    return void reply('❌ No pude preparar la imagen. Si es antigua, reenvíala e inténtalo de nuevo.')
  }
  // 🎬 Video con sonido (no GIF): se usa el sonido del mismo video, sin pedir audio
  const esGif = sel.tipo === 'video' && !!sel.media.gifPlayback
  if (sel.tipo === 'video' && !esGif && await tieneSonido(buf)) {
    try {
      const r = await enviar(naufra, from, webp, animado, buf, info)
      if (!r.ok) reply('⚠️ No pude unir el sonido al sticker, así que te los mandé por separado.')
    } catch (e) {
      console.log('[stickersonido] video:', e.message)
      reply('❌ No pude crear el sticker con sonido. Intenta con otro video.')
      return false
    }
    return true
  }
  pendientes.set(clave(from, info.key.participant || from), { webp, animado, ts: Date.now() })
  if (sel.tipo === 'video' && !esGif) { reply(`🔇 Ese video no tiene sonido. Envía un *audio o nota de voz* (máx. ${MAX_SEG} s).\n⏳ Tienes 2 minutos.`); return true }
  reply(`🎙️ ¡Imagen lista! Ahora envía un *audio o nota de voz* (máx. ${MAX_SEG} s).\n⏳ Tienes 2 minutos.`)
  return true
}

function hayPendiente(chat, persona) {
  const p = pendientes.get(clave(chat, persona))
  if (!p) return false
  if (Date.now() - p.ts > ESPERA_MS) { pendientes.delete(clave(chat, persona)); return false }
  return true
}

// Se llama con cada mensaje: si es el audio que esperábamos, arma el sticker
async function alRecibir(sock, info, chat) {
  const persona = info.key.participant || chat
  if (!hayPendiente(chat, persona)) return false
  const vu = require('./vistaunica.js')
  const c = info.message?.extendedTextMessage?.contextInfo
  const propio = vu.extraer(info.message)
  const citado = c?.quotedMessage ? vu.extraer(c.quotedMessage) : null
  const aud = propio && propio.tipo === 'audio' ? { m: propio, cit: null }
    : citado && citado.tipo === 'audio' ? { m: citado, cit: { id: c.stanzaId, msg: c.quotedMessage, autor: c.participant } } : null
  if (!aud) return false
  const p = pendientes.get(clave(chat, persona))
  pendientes.delete(clave(chat, persona))
  try {
    const buf = await bufferDe(sock, aud.m.media, 'audio', aud.cit, chat)
    const r = await enviar(sock, chat, p.webp, p.animado, buf, info)
    if (!r.ok) await sock.sendMessage(chat, { text: '⚠️ No pude unir el sonido al sticker, así que te los mandé por separado.' }, { quoted: info })
  } catch (e) {
    console.log('[stickersonido]', e.message)
    await sock.sendMessage(chat, { text: '❌ No pude crear el sticker con sonido. Intenta con otro audio.' }, { quoted: info }).catch(() => {})
  }
  return true
}

module.exports = { iniciar, alRecibir, hayPendiente, armarBytes, parchearEncode, campo, varint, _pendientes: pendientes, _tieneSonido: tieneSonido }
