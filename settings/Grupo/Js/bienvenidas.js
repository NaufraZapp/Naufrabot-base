// ══════════════════════════════════════════════════════════
// 👋 SISTEMA DE BIENVENIDAS Y DESPEDIDAS (NaufraBot Base V6)
// ══════════════════════════════════════════════════════════
// Desde la V6 la bienvenida y la despedida se activan POR SEPARADO
// y cada grupo puede tener su propio texto e imagen.
//
// Todo se guarda en: settings/Grupo/Json/bienvenidas.json
//
// Variables que puedes usar dentro de los textos:
//   {usuario}     -> menciona al que entra/sale (@numero)
//   {grupo}       -> nombre del grupo
//   {miembros}    -> cantidad de miembros actuales
//   {descripcion} -> descripción del grupo
//   {hora}        -> hora actual (Lima)
//   {fecha}       -> fecha actual
// ══════════════════════════════════════════════════════════

const fs = require('fs')
const moment = require('moment-timezone')

const RUTA = './settings/Grupo/Json/bienvenidas.json'
const RUTA_VIEJA = './settings/Grupo/Json/welkom.json' // usada hasta la V5

// Imagen que se usa si el usuario no tiene foto de perfil y el grupo no puso una propia
const IMAGEN_POR_DEFECTO = 'https://i.postimg.cc/rzXqHmYQ/20260823-215152.jpg'

// ✏️ Textos por defecto (los puedes cambiar aquí o por grupo con /setbienvenida y /setdespedida)
const TEXTO_BIENVENIDA = `
✦━─⌬༓༒༓⌬─━✦
*✧༺ 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒐/𝒂 ✦༻✧*

💌 「 Hola {usuario} 🌟 y bienvenido/a al reino de *{grupo}* 」
🥂 Que tu estancia esté llena de risas, buena charla 🗨 y alguna que otra copa de hidromiel 🍯🍺

📜 Recuerda echarle un ojo a nuestras reglas para no invocar a los dragones 🐉🔥

『 👥 Miembros actuales: {miembros} 』
✦━─⌬༓༒༓⌬─━✦`

const TEXTO_DESPEDIDA = `
✦━─⌬༓༒༓⌬─━✦
*✧༺ 𝑫𝒆𝒔𝒑𝒆𝒅𝒊𝒅𝒂 ༻✧*

😢 「 {usuario} ha abandonado *{grupo}* 」

🌸 Esperamos que hayas disfrutado tu estancia.
✨ ¡Las puertas siempre estarán abiertas para ti!

『 👥 Miembros actuales: {miembros} 』
✦━─⌬༓༒༓⌬─━✦`

const TEXTO_PROMOVER = `
✦━─┈༓༒༓┈─━✦

     *✧༺ 𝓝𝓾𝓮𝓿𝓸 𝓐𝓭𝓶𝓲𝓷 ༻✧*

🪪 𝗡𝗼𝗺𝗯𝗿𝗲: {usuario}
🌐 𝗚𝗿𝘂𝗽𝗼: {grupo}
💌 「 ¡Enhorabuena! 🎉 Has ascendido a la mesa de los administradores 🪄 」

✦━─┈༓༒༓┈─━✦`

const TEXTO_DEGRADAR = `
✦━─┈༓༒༓┈─━✦

     *✧༺ 𝓐𝓭𝓶𝓲𝓷 𝓻𝓮𝓽𝓲𝓻𝓪𝓭𝓸 ༻✧*

🪪 𝗡𝗼𝗺𝗯𝗿𝗲: {usuario}
🌐 𝗚𝗿𝘂𝗽𝗼: {grupo}
📉 「 Ya no forma parte de los administradores 」

✦━─┈༓༒༓┈─━✦`

// ─────────────────────────── base de datos ───────────────────────────

function cargar() {
  let db = {}
  try {
    if (fs.existsSync(RUTA)) db = JSON.parse(fs.readFileSync(RUTA)) || {}
  } catch (e) {
    console.log('⚠️ bienvenidas.json dañado, se crea uno nuevo:', e.message)
    db = {}
  }

  // 🔁 Migración automática desde la V5: los grupos que tenían /welcome 1
  // quedan con bienvenida Y despedida activadas, para que nada cambie.
  try {
    if (fs.existsSync(RUTA_VIEJA)) {
      const viejos = JSON.parse(fs.readFileSync(RUTA_VIEJA)) || []
      let migrados = 0
      for (const gid of viejos) {
        if (typeof gid === 'string' && !db[gid]) {
          db[gid] = { bienvenida: true, despedida: true }
          migrados++
        }
      }
      if (migrados) {
        fs.writeFileSync(RUTA, JSON.stringify(db, null, 2))
        fs.writeFileSync(RUTA_VIEJA, '[]')
        console.log(`✅ ${migrados} grupo(s) migrados del welcome viejo al nuevo sistema de bienvenidas.`)
      }
    }
  } catch (e) {}

  return db
}

let db = cargar()

function guardar() {
  fs.writeFileSync(RUTA, JSON.stringify(db, null, 2))
}

function obtener(gid) {
  return {
    bienvenida: false,
    despedida: false,
    avisosAdmin: false,
    textoBienvenida: '',
    textoDespedida: '',
    imagenBienvenida: '',
    imagenDespedida: '',
    ...(db[gid] || {})
  }
}

function cambiar(gid, cambios) {
  db[gid] = { ...obtener(gid), ...cambios }
  guardar()
  return db[gid]
}

// ─────────────────────────── utilidades ───────────────────────────

// En Baileys 7 los participantes llegan como objeto { id, phoneNumber, lid }
// y en versiones viejas como texto. Esto soporta las dos formas.
function normalizarParticipante(p) {
  if (!p) return null
  if (typeof p === 'string') return { id: p, ids: [p] }
  const ids = [p.phoneNumber, p.id, p.lid].filter(x => typeof x === 'string')
  // Para mencionar preferimos el número real; si no lo hay, el LID
  return { id: ids[0] || null, ids }
}

function esElBot(Naufra, ids) {
  const bot = (Naufra.user?.id || '').split(':')[0].split('@')[0]
  const botLid = (Naufra.user?.lid || '').split(':')[0].split('@')[0]
  return ids.some(j => {
    const base = String(j).split(':')[0].split('@')[0]
    return (bot && base === bot) || (botLid && base === botLid)
  })
}

function rellenar(plantilla, datos) {
  return String(plantilla)
    .replace(/{usuario}/gi, datos.usuario)
    .replace(/{grupo}/gi, datos.grupo)
    .replace(/{miembros}/gi, String(datos.miembros))
    .replace(/{descripcion}/gi, datos.descripcion || 'Sin descripción')
    .replace(/{hora}/gi, moment.tz('America/Lima').format('HH:mm'))
    .replace(/{fecha}/gi, moment.tz('America/Lima').format('DD/MM/YYYY'))
}

async function fotoDe(Naufra, jids, respaldo) {
  for (const j of jids) {
    try {
      const url = await Naufra.profilePictureUrl(j, 'image')
      if (url) return url
    } catch (e) {}
  }
  return respaldo || IMAGEN_POR_DEFECTO
}

// Manda con imagen; si la imagen falla (link caído, etc.) manda solo el texto.
// Antes, si la imagen fallaba, NO se mandaba nada y parecía que la bienvenida no funcionaba.
async function enviarConImagen(Naufra, gid, imagen, texto, menciones) {
  try {
    return await Naufra.sendMessage(gid, { image: { url: imagen }, caption: texto, mentions: menciones })
  } catch (e) {
    console.log('⚠️ No se pudo enviar la imagen de bienvenida/despedida, se envía solo texto:', e.message)
    return Naufra.sendMessage(gid, { text: texto, mentions: menciones })
  }
}

// ─────────────────────────── evento del grupo ───────────────────────────

async function manejarEvento(Naufra, anu, metadataEnCache) {
  const gid = anu.id
  const cfg = obtener(gid)
  const accion = anu.action

  const activo =
    (accion === 'add' && cfg.bienvenida) ||
    ((accion === 'remove' || accion === 'leave') && cfg.despedida) ||
    ((accion === 'promote' || accion === 'demote') && cfg.avisosAdmin)
  if (!activo) return

  let metadata = null
  try { metadata = await Naufra.groupMetadata(gid) } catch (e) { metadata = metadataEnCache || null }
  const grupo = metadata?.subject || 'el grupo'
  const miembros = metadata?.participants?.length || 0
  const descripcion = metadata?.desc || ''

  for (const crudo of (anu.participants || [])) {
    const p = normalizarParticipante(crudo)
    if (!p || !p.id) continue
    if (esElBot(Naufra, p.ids)) continue // no darse la bienvenida a sí mismo

    const datos = { usuario: '@' + p.id.split('@')[0].split(':')[0], grupo, miembros, descripcion }
    const menciones = [p.id]

    try {
      if (accion === 'add') {
        const texto = rellenar(cfg.textoBienvenida || TEXTO_BIENVENIDA, datos)
        const img = await fotoDe(Naufra, p.ids, cfg.imagenBienvenida)
        await enviarConImagen(Naufra, gid, img, texto, menciones)
      } else if (accion === 'remove' || accion === 'leave') {
        const texto = rellenar(cfg.textoDespedida || TEXTO_DESPEDIDA, datos)
        const img = await fotoDe(Naufra, p.ids, cfg.imagenDespedida)
        await enviarConImagen(Naufra, gid, img, texto, menciones)
      } else if (accion === 'promote') {
        await Naufra.sendMessage(gid, { text: rellenar(TEXTO_PROMOVER, datos), mentions: menciones })
      } else if (accion === 'demote') {
        await Naufra.sendMessage(gid, { text: rellenar(TEXTO_DEGRADAR, datos), mentions: menciones })
      }
    } catch (e) {
      console.log('❌ Error en bienvenida/despedida:', e.message)
    }
  }
}

module.exports = {
  obtener,
  cambiar,
  manejarEvento,
  rellenar,
  enviarConImagen,
  fotoDe,
  TEXTO_BIENVENIDA,
  TEXTO_DESPEDIDA,
  IMAGEN_POR_DEFECTO
}
