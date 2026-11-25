// ══════════════════════════════════════════════════════════
// 🧰 UTILIDADES COMPARTIDAS DE LOS JUEGOS TEMÁTICOS
//    (Remielle / Zenless Zone Zero  y  Dandy's World)
// ══════════════════════════════════════════════════════════
const fs = require('fs')
const path = require('path')

// 📁 Base de datos JSON sencilla: un objeto { idUsuario: datos }
function crearDB(archivo, plantilla) {
  const ruta = path.join(__dirname, '..', 'Json', archivo)
  if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, '{}')
  let datos = {}
  try { datos = JSON.parse(fs.readFileSync(ruta)) || {} } catch { datos = {} }
  if (Array.isArray(datos)) datos = {}

  const guardar = () => fs.writeFileSync(ruta, JSON.stringify(datos, null, 2))

  return {
    // Devuelve el usuario (lo crea con la plantilla si no existe)
    obtener(id, nombre = '') {
      if (!datos[id]) {
        datos[id] = { ...JSON.parse(JSON.stringify(plantilla)), nombre }
        guardar()
      }
      // Si la plantilla gana campos nuevos en una actualización, se agregan solos
      for (const k of Object.keys(plantilla)) {
        if (datos[id][k] === undefined) datos[id][k] = JSON.parse(JSON.stringify(plantilla[k]))
      }
      if (nombre) datos[id].nombre = nombre
      return datos[id]
    },
    todos: () => datos,
    guardar
  }
}

// 🖼️ Imágenes opcionales (Games/Json/imagenes_temas.json). Si están vacías se manda solo texto.
const rutaImagenes = path.join(__dirname, '..', 'Json', 'imagenes_temas.json')
function imagen(clave) {
  try {
    const imgs = JSON.parse(fs.readFileSync(rutaImagenes))
    const v = imgs[clave]
    if (Array.isArray(v)) return v.length ? v[Math.floor(Math.random() * v.length)] : ''
    return v || ''
  } catch { return '' }
}

// Manda texto, o imagen + texto si hay una imagen configurada para esa clave
async function mandar(ctx, texto, claveImagen, menciones = []) {
  const { Naufra, from, info } = ctx
  const url = claveImagen ? imagen(claveImagen) : ''
  if (url) {
    try {
      return await Naufra.sendMessage(from, { image: { url }, caption: texto.trim(), mentions: menciones }, { quoted: info })
    } catch (e) {
      console.log('⚠️ No se pudo mandar la imagen de', claveImagen, '-', e.message)
    }
  }
  return Naufra.sendMessage(from, { text: texto.trim(), mentions: menciones }, { quoted: info })
}

const azar = (lista) => lista[Math.floor(Math.random() * lista.length)]
const entre = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const num = (n) => Number(n || 0).toLocaleString('es-PE')

// Elige un elemento según su "peso"
function azarPesado(lista) {
  const total = lista.reduce((s, x) => s + x.peso, 0)
  let r = Math.random() * total
  for (const x of lista) { if ((r -= x.peso) <= 0) return x }
  return lista[lista.length - 1]
}

// ⏳ "1 h 5 min 3 s"
function tiempo(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), seg = s % 60
  return [h && `${h} h`, m && `${m} min`, (seg || (!h && !m)) && `${seg} s`].filter(Boolean).join(' ')
}

// Revisa una espera: devuelve los ms que faltan (0 si ya puede)
function falta(usuario, clave, esperaMs) {
  const ultimo = (usuario.esperas || {})[clave] || 0
  return Math.max(0, ultimo + esperaMs - Date.now())
}
function marcar(usuario, clave) {
  usuario.esperas = usuario.esperas || {}
  usuario.esperas[clave] = Date.now()
}

// Barra de progreso ▰▰▰▱▱
function barra(valor, max, largo = 10) {
  const llenos = Math.max(0, Math.min(largo, Math.round((valor / max) * largo)))
  return '▰'.repeat(llenos) + '▱'.repeat(largo - llenos)
}

// Quita tildes y pasa a minúsculas para comparar nombres
const normal = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// ❓ Trivias activas por chat (en memoria). Compartido por los dos temas.
const triviasActivas = new Map()

module.exports = { crearDB, imagen, mandar, azar, entre, num, azarPesado, tiempo, falta, marcar, barra, normal, triviasActivas }
