// ══════════════════════════════════════════════════════════
// ☁️ SUBIR IMAGEN A INTERNET (lo usan /hd, /removebg, /setfotobienvenida...)
// ══════════════════════════════════════════════════════════
// La API de Naufrabot trabaja con links de imagen, así que primero subimos
// la foto que manda el usuario y le pasamos el link a la API.
//
// - Si pones "IMGBB_KEY" en settings/settings.json se usa ImgBB (gratis en imgbb.com).
// - Si lo dejas vacío se usa catbox.moe, que no necesita clave.
// ══════════════════════════════════════════════════════════

const fetch = require('node-fetch')
const FormData = require('form-data')

async function subirImgBB(buffer, key) {
  const form = new FormData()
  form.append('image', buffer.toString('base64'))
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: 'POST', body: form })
  const json = await res.json()
  if (!json?.data?.url) throw new Error('ImgBB no devolvió link')
  return json.data.url
}

async function subirCatbox(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename: `naufra_${Date.now()}.jpg`, contentType: 'image/jpeg' })
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  const url = (await res.text()).trim()
  if (!url.startsWith('http')) throw new Error('Catbox no devolvió link: ' + url.slice(0, 80))
  return url
}

async function subirImagen(buffer) {
  let key = ''
  try { key = (require('../../settings/settings.json').IMGBB_KEY || '').trim() } catch (e) {}
  if (key) {
    try { return await subirImgBB(buffer, key) } catch (e) { console.log('⚠️ ImgBB falló, probando catbox:', e.message) }
  }
  return subirCatbox(buffer)
}

module.exports = { subirImagen }
