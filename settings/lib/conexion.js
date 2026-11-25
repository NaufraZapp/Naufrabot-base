// 📡 MODO DE CONEXIÓN (/modoconexion)
// WhatsApp NO entrega el contenido de las vistas únicas a los dispositivos "WhatsApp Web".
// Baileys 7.0.0-rc14 puede presentarse como un teléfono ANDROID vinculado, y a esos sí
// les llega la vista única completa (ya no hace falta nada raro para revelarla).
//
//   web       → como siempre (WhatsApp Web)
//   android   → teléfono Android, para números de WhatsApp normal
//   business  → teléfono Android de WhatsApp Business (SMB_ANDROID). Baileys rc14 solo trae
//               "ANDROID"; con Business eso puede no conectar, así que aquí se ajusta
//               Baileys antes de cargarlo (se deshace solo si vuelves a "web" o "android").
//
// Este archivo debe cargarse ANTES que Baileys (está arriba de todo en index.js).
// (Traído del bot VIP. En la base la sesión se guarda en la carpeta "session".)

const fs = require('fs')
const path = require('path')

const RAIZ = path.resolve(__dirname, '..', '..')
const SETTINGS = path.join(RAIZ, 'settings', 'settings.json')
const BAILEYS = path.join(RAIZ, 'node_modules', '@whiskeysockets', 'baileys')
const VALIDATE = path.join(BAILEYS, 'lib', 'Utils', 'validate-connection.js')
const MARCA = '/*naufra-business*/'

function modo() {
  try {
    const m = String(JSON.parse(fs.readFileSync(SETTINGS, 'utf8')).modo_conexion || 'web').toLowerCase()
    return ['web', 'android', 'business'].includes(m) ? m : 'web'
  } catch (e) { return 'web' }
}

function versionBaileys() {
  try { return JSON.parse(fs.readFileSync(path.join(BAILEYS, 'package.json'), 'utf8')).version } catch (e) { return null }
}

// ¿Esta versión de Baileys sabe presentarse como Android? (rc14+)
function soportaAndroid() {
  try { return /android/i.test(fs.readFileSync(VALIDATE, 'utf8')) } catch (e) { return false }
}

// ¿El teléfono principal es WhatsApp Business? Baileys lo guarda al vincular (creds.platform = 'smba', 'smbi'…)
function plataformaTelefono() {
  try { return String(JSON.parse(fs.readFileSync(path.join(RAIZ, 'session', 'creds.json'), 'utf8')).platform || '') } catch (e) { return '' }
}
const esBusiness = () => /^smb/i.test(plataformaTelefono())

const info = { modo: modo(), version: versionBaileys(), soportaAndroid: soportaAndroid(), business: 'no aplica', telefono: plataformaTelefono() }
// "android" en un número Business → se usa la variante Business automáticamente
info.efectivo = info.modo === 'android' && esBusiness() ? 'business' : info.modo

// Ajuste para WhatsApp Business: ANDROID → SMB_ANDROID en el user agent
;(function parcheBusiness() {
  try {
    if (!fs.existsSync(VALIDATE)) { info.business = 'sin baileys'; return }
    let src = fs.readFileSync(VALIDATE, 'utf8')
    const parchado = src.includes(MARCA)
    if (info.efectivo === 'business') {
      if (parchado) { info.business = 'aplicado'; return }
      const nuevo = src.replace(/(UserAgent\.Platform\.)ANDROID\b/g, `$1SMB_ANDROID${MARCA}`)
      if (nuevo === src) { info.business = 'no encontrado'; return }
      fs.writeFileSync(VALIDATE, nuevo)
      info.business = 'aplicado'
    } else if (parchado) {
      fs.writeFileSync(VALIDATE, src.split(`SMB_ANDROID${MARCA}`).join('ANDROID'))
    }
  } catch (e) {
    info.business = 'error: ' + e.message
  }
})()

// Lo que va en makeWASocket({ browser })
function navegador(baileys) {
  if (info.efectivo === 'web' || !info.soportaAndroid) return ['Ubuntu', 'Chrome', '120.0.0']
  if (baileys && baileys.Browsers && typeof baileys.Browsers.android === 'function') return baileys.Browsers.android('14')
  return ['14', 'Android', '']
}

function texto() {
  const nombres = { web: 'WhatsApp Web', android: 'Android (WhatsApp normal)', business: 'Android Business' }
  return `${nombres[info.efectivo]}${info.efectivo !== 'web' && !info.soportaAndroid ? ' ⚠️ (tu Baileys no lo soporta: se está usando Web)' : ''}`
}

module.exports = { info, navegador, texto, modo, versionBaileys, soportaAndroid, esBusiness, plataformaTelefono }
