// ══════════════════════════════════════════════════════════
// 🎴 GACHA DE PERSONAJES (traído del bot VIP y adaptado a las Rupias)
//
//    rw · claim · harem · delchar · sell · wshop · buyc · givechar
//    giveall (+ confirmargiveall) · trade (+ aceptartrade) · votar
//    wtop · rankc · menugacha
//
//    Personajes: Games/Json/gacha/characters.json (mismo formato del VIP).
//    Si existe ./database/waifu/characters.json (copiado de tu bot VIP),
//    se usa ese automáticamente.
// ══════════════════════════════════════════════════════════
const fs = require('fs')
const path = require('path')
const { normal, tiempo, num } = require('./temas_utils.js')

// ⚙️ AJUSTES (cámbialos a tu gusto)
const CONFIG = {
  divisorPrecio: 1,                   // precio para reclamar = valor (valor 100 → ₹100), igual que en el VIP
  esperaRoll: 8 * 60 * 1000,          // 8 min entre /rw por persona
  esperaClaim: 30 * 60 * 1000,        // 30 min entre /claim por persona
  rollDura: 5 * 60 * 1000,            // un personaje sacado se puede reclamar durante 5 min
  esperaVoto: 60 * 60 * 1000,         // 1 h entre votos por persona y por personaje
  maxSubidaDiaria: 900,               // lo máximo que puede subir un personaje por día con votos
  ventaMin: 1, ventaMax: 100000,      // precio de venta en Rupias
  ventaDura: 3 * 24 * 60 * 60 * 1000, // la venta dura 3 días
  porPagina: 20,
  // Gelbooru pide clave. Déjala vacía para no regalar la tuya junto con el bot.
  gelbooru: { api_key: '', user_id: '' }
}

const DIR = path.join(__dirname, '..', 'Json', 'gacha')
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })
const ARCHIVO = (n) => path.join(DIR, n + '.json')
const leer = (n) => { try { return JSON.parse(fs.readFileSync(ARCHIVO(n), 'utf8')) || {} } catch { return {} } }
const escribir = (n, d) => fs.writeFileSync(ARCHIVO(n), JSON.stringify(d, null, 2))

const claims = leer('claims')   // { charId: { owner, claimedAt } }
const users = leer('users')     // { jid: [charId] }
const sales = leer('sales')     // { charId: { user, price, expires } }
const votes = leer('votes')     // { charId: { name, value, votes, lastVotedAt, daily } }
const guardar = () => { escribir('claims', claims); escribir('users', users); escribir('sales', sales); escribir('votes', votes) }

// 📚 Personajes (se recargan si cambias el archivo)
let _cache = { t: 0, lista: [], series: {} }
function personajes() {
  const vip = path.resolve('./database/waifu/characters.json')
  const ruta = fs.existsSync(vip) ? vip : ARCHIVO('characters')
  try {
    const t = fs.statSync(ruta).mtimeMs
    if (t !== _cache.t) {
      const raw = JSON.parse(fs.readFileSync(ruta, 'utf8'))
      const lista = []
      for (const s of Object.values(raw)) for (const c of (s.characters || [])) lista.push({ ...c, id: String(c.id), serie: s.name || 'Desconocido' })
      _cache = { t, lista }
    }
  } catch (e) { console.log('⚠️ Gacha: no pude leer characters.json -', e.message) }
  return _cache.lista
}
const valor = (c) => Number(votes[c.id]?.value ?? c.value ?? 100)
const precio = (c) => Math.max(1, Math.ceil(valor(c) / CONFIG.divisorPrecio))
const buscar = (nombre) => {
  const n = normal(nombre)
  if (!n) return null
  const l = personajes()
  return l.find(c => normal(c.name) === n) || l.find(c => normal(c.name).startsWith(n)) || l.find(c => normal(c.name).includes(n))
}
const base = (j) => String(j || '').split(':')[0].split('@')[0]
const tag = (j) => `@${base(j)}`
const misPj = (j) => (users[j] = (users[j] || []).map(String))
const dueno = (id) => claims[id]?.owner || null
function quitar(j, id) {
  users[j] = misPj(j).filter(x => x !== String(id))
  if (sales[id]?.user === j) delete sales[id]
}
function dar(j, id) { misPj(j); if (!users[j].includes(String(id))) users[j].push(String(id)); claims[id] = { owner: j, claimedAt: Date.now() } }

const estrellas = (v) => v >= 2000 ? '🌟🌟🌟🌟🌟' : v >= 1000 ? '⭐⭐⭐⭐' : v >= 500 ? '⭐⭐⭐' : v >= 250 ? '⭐⭐' : '⭐'
const genero = (g) => /fem|mujer|chica/i.test(g || '') ? '♀️' : /mas|hombre|chico/i.test(g || '') ? '♂️' : '✦'

// 🔎 IMÁGENES — igual que en el VIP (safebooru → danbooru → gelbooru), pero:
//   • se filtra por rating en el bot (sin meter "-rating:" en la búsqueda, que a veces la dejaba vacía)
//   • solo jpg/png (WhatsApp no acepta gif/webm/webp como foto)
//   • el bot descarga la imagen y la manda junto con la descripción en el MISMO mensaje
const UA = { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) NaufraBot/6.0' }
const esFoto = (u) => /\.(jpe?g|png)(\?|$)/i.test(String(u || ''))
const apto = (r) => !/^(q|e)/i.test(String(r || 's'))          // fuera questionable / explicit
const cacheImg = new Map()

async function pedir(url, ms = 10000) {
  const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { signal: ctrl.signal, headers: UA, redirect: 'follow' }) } finally { clearTimeout(to) }
}

async function buscarLinks(c) {
  if (Array.isArray(c.img) && c.img.length) return [...c.img].sort(() => Math.random() - 0.5)
  const t = String((c.tags || [])[0] || '').trim().toLowerCase().replace(/\s+/g, '_')
  if (!t) return []
  const enCache = cacheImg.get(t)
  if (enCache && Date.now() - enCache.t < 60 * 60 * 1000) return [...enCache.urls].sort(() => Math.random() - 0.5)
  const q = encodeURIComponent(t)
  const fuentes = [
    { n: 'safebooru', url: `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${q}&limit=50`,
      sacar: (j) => (Array.isArray(j) ? j : []).filter(p => p.image && apto(p.rating)).map(p => `https://safebooru.org/images/${p.directory}/${p.image}`) },
    { n: 'danbooru', url: `https://danbooru.donmai.us/posts.json?tags=${q}&limit=50`,
      sacar: (j) => (Array.isArray(j) ? j : []).filter(p => apto(p.rating)).map(p => [p.large_file_url, p.file_url].find(esFoto)).filter(Boolean) }
  ]
  if (CONFIG.gelbooru.api_key) fuentes.push({ n: 'gelbooru',
    url: `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${q}&limit=50&api_key=${CONFIG.gelbooru.api_key}&user_id=${CONFIG.gelbooru.user_id}`,
    sacar: (j) => (j?.post || []).filter(p => apto(p.rating)).map(p => p.file_url) })
  for (const f of fuentes) {
    try {
      const r = await pedir(f.url)
      if (!r.ok) { console.log(`🎴 ${f.n}: respuesta ${r.status} para ${t}`); continue }
      const txt = await r.text()
      if (!txt.trim()) continue                                   // safebooru responde vacío si no hay resultados
      const urls = f.sacar(JSON.parse(txt)).filter(esFoto)
      if (urls.length) { cacheImg.set(t, { t: Date.now(), urls }); return [...urls].sort(() => Math.random() - 0.5) }
    } catch (e) { console.log(`🎴 ${f.n}: no respondió para ${t} (${e.name || e.message})`) }
  }
  return []
}

// Descarga la imagen (prueba hasta 3 links). Devuelve un Buffer o null.
async function imagen(c) {
  const links = (await buscarLinks(c)).slice(0, 3)
  for (const u of links) {
    try {
      const r = await pedir(u, 15000)
      if (!r.ok) continue
      const buf = Buffer.from(await r.arrayBuffer())
      const jpg = buf[0] === 0xff && buf[1] === 0xd8, png = buf[0] === 0x89 && buf[1] === 0x50
      if ((jpg || png) && buf.length > 1000) return buf
    } catch (e) { console.log('🎴 No pude descargar', u, '-', e.name || e.message) }
  }
  return null
}

// Menciones con @lid → número real
function resolver(ctx, jid) {
  if (!jid) return null
  if (String(jid).endsWith('@lid')) {
    const p = (ctx.groupMembers || []).find(m => [m.id, m.lid].includes(jid))
    if (p?.phoneNumber) return String(p.phoneNumber).includes('@') ? p.phoneNumber : `${p.phoneNumber}@s.whatsapp.net`
    if (p?.id && !String(p.id).endsWith('@lid')) return p.id
  }
  return jid
}
function mencionado(ctx) {
  const c = ctx.info?.message?.extendedTextMessage?.contextInfo
  return resolver(ctx, c?.mentionedJid?.[0] || c?.participant || null)
}
const textoSinMenciones = (q) => String(q || '').replace(/@\S+/g, '').replace(/\s+/g, ' ').trim()

// Estado en memoria
const ultimoRoll = {}      // chat → { id, t }
const esperas = {}         // `${tipo}:${jid}` → timestamp
const pendientesGiveall = {} // jid → { para, t }
const pendientesTrade = {}   // jid destino → { de, mio, suyo, t }
const espera = (tipo, j, ms) => Math.max(0, (esperas[`${tipo}:${j}`] || 0) + ms - Date.now())
const marcar = (tipo, j) => { esperas[`${tipo}:${j}`] = Date.now() }

function menuGacha(p) {
  return `
╔═══════════════════════╗
   🎴  *G A C H A   D E   P E R S O N A J E S*
╚═══════════════════════╝
_Saca personajes, reclámalos y arma tu colección_ ✨

╭─〔 🎲 *CONSEGUIR* 〕
┃ ➢ *${p}rw* — Saca un personaje al azar
┃ ➢ *${p}claim* — Reclama el último que salió
┃ ➢ *${p}harem [@alguien]* — Ver colección
╰──────────────⬣
╭─〔 💰 *MERCADO* 〕
┃ ➢ *${p}sell <precio> <nombre>* — Poner en venta
┃ ➢ *${p}wshop* — Personajes en venta
┃ ➢ *${p}buyc <nombre>* — Comprar uno en venta
╰──────────────⬣
╭─〔 🤝 *ENTRE AMIGOS* 〕
┃ ➢ *${p}givechar <nombre> @alguien* — Regalar
┃ ➢ *${p}giveall @alguien* — Regalar todos
┃ ➢ *${p}trade Mío / Suyo @alguien* — Intercambiar
┃ ➢ *${p}delchar <nombre>* — Liberar un personaje
╰──────────────⬣
╭─〔 🏆 *RANKING* 〕
┃ ➢ *${p}votar <nombre>* — Sube el valor de un personaje
┃ ➢ *${p}wtop* — Personajes con más valor
┃ ➢ *${p}rankc* — Mejores coleccionistas
╰──────────────⬣
> 💡 Reclamar cuesta *valor ÷ ${CONFIG.divisorPrecio}* en Rupias`
}

const COMANDOS = {
  menugacha: 'menu', gacha: 'menu', menuanime: 'menu',
  rw: 'rw', rollwaifu: 'rw', ver: 'rw',
  claim: 'claim', c: 'claim', reclamar: 'claim',
  harem: 'harem', waifus: 'harem', claims: 'harem',
  delchar: 'delchar', delwaifu: 'delchar', deletewaifu: 'delchar',
  sell: 'sell', vender: 'sell',
  wshop: 'wshop', haremshop: 'wshop', tiendawaifus: 'wshop',
  buyc: 'buyc', buychar: 'buyc', buycharacter: 'buyc',
  givechar: 'givechar', givewaifu: 'givechar', regalarchar: 'givechar',
  giveall: 'giveall', giveallchar: 'giveall', confirmargiveall: 'confirmargiveall',
  trade: 'trade', intercambiar: 'trade', aceptartrade: 'aceptartrade',
  votar: 'votar', vote: 'votar',
  wtop: 'wtop', topwaifus: 'wtop', waifustop: 'wtop', waifusboard: 'wtop',
  rankc: 'rankc'
}

async function manejar(ctx) {
  const accion = COMANDOS[ctx.comando]
  if (!accion) return false
  const { Naufra, from, info, sender, args, q, prefixo: p, isGroup, isReg, respuesta, MoneyOfSender, addkoin, delkoin } = ctx
  const responder = (text, mentions = []) => Naufra.sendMessage(from, { text: String(text).trim(), mentions }, { quoted: info })

  if (accion === 'menu') { await responder(menuGacha(p), [sender]); return true }
  if (!isGroup) { await responder('👥 El gacha se juega en grupos.'); return true }
  if (!isReg) { await responder(respuesta.registro); return true }
  if (!personajes().length) { await responder('❌ No hay personajes cargados. Revisa *Games/Json/gacha/characters.json*'); return true }

  const dinero = (j) => Number(MoneyOfSender(j) || 0)

  switch (accion) {
    case 'rw': {
      const f = espera('rw', sender, CONFIG.esperaRoll)
      if (f) return responder(`⏳ Puedes volver a tirar en *${tiempo(f)}*`), true
      marcar('rw', sender)
      const lista = personajes()
      const c = lista[Math.floor(Math.random() * lista.length)]
      ultimoRoll[from] = { id: c.id, t: Date.now(), por: sender }
      const d = dueno(c.id)
      const caption = `
╭━━━〔 🎴 *¡PERSONAJE!* 〕━━━⬣
┃ ❀ Nombre » *${c.name}*
┃ ⚥ Género » *${c.gender || 'Desconocido'}* ${genero(c.gender)}
┃ ✰ Valor » *${num(valor(c))}* ${estrellas(valor(c))}
┃ ❖ Fuente » *${c.serie}*
┃ ${d ? `💔 Ya tiene dueño: ${tag(d)}` : `💖 Libre · Reclamar cuesta *₹${num(precio(c))}*`}
╰━━━━━━━━━━━━━━━━━━⬣
${d ? '' : `✍️ Responde con *${p}claim* para reclamarlo (5 min)`}`.trim()
      const foto = await imagen(c)
      if (foto) {
        try {
          await Naufra.sendMessage(from, { image: foto, caption, mentions: d ? [d] : [] }, { quoted: info })
          return true
        } catch (e) { console.log('🎴 WhatsApp no aceptó la imagen de', c.name, '-', e.message) }
      }
      await responder(caption + '\n\n🖼️ _No pude cargar la imagen de este personaje._', d ? [d] : [])
      return true
    }

    case 'claim': {
      const r = ultimoRoll[from]
      if (!r || Date.now() - r.t > CONFIG.rollDura) return responder(`❌ No hay personaje para reclamar. Usa *${p}rw* primero.`), true
      const c = personajes().find(x => x.id === r.id)
      if (!c) return responder('❌ Ese personaje ya no existe.'), true
      if (dueno(c.id)) return responder(`💔 *${c.name}* ya fue reclamado por ${tag(dueno(c.id))}`, [dueno(c.id)]), true
      const f = espera('claim', sender, CONFIG.esperaClaim)
      if (f) return responder(`⏳ Puedes reclamar otra vez en *${tiempo(f)}*`), true
      const pr = precio(c)
      if (dinero(sender) < pr) return responder(`💸 Reclamar a *${c.name}* cuesta *₹${pr}* y tienes *₹${dinero(sender)}*.\nGana Rupias con *${p}minar*, *${p}dayli* o la *${p}menujuegos*`), true
      delkoin(sender, pr)
      dar(sender, c.id); marcar('claim', sender); delete ultimoRoll[from]; guardar()
      try { ctx.addXp(sender, 15) } catch (e) {}
      return responder(`
💞✨💞✨💞✨💞✨
🎉 *¡${c.name} es tuyo!*
💞✨💞✨💞✨💞✨

👤 Dueño: ${tag(sender)}
💰 Pagaste: ₹${pr}
📚 Total en tu harem: *${misPj(sender).length}*`, [sender]), true
    }

    case 'harem': {
      const quien = mencionado(ctx) || sender
      const lista = misPj(quien).map(id => personajes().find(c => c.id === id)).filter(Boolean).sort((a, b) => valor(b) - valor(a))
      if (!lista.length) return responder(quien === sender ? `🌸 Aún no tienes personajes. Usa *${p}rw*` : `🌸 ${tag(quien)} no tiene personajes.`, [quien]), true
      const pag = Math.max(1, parseInt(args.find(a => /^\d+$/.test(a))) || 1)
      const total = Math.ceil(lista.length / CONFIG.porPagina)
      if (pag > total) return responder(`❌ Página inválida. Hay ${total}.`), true
      const trozo = lista.slice((pag - 1) * CONFIG.porPagina, pag * CONFIG.porPagina)
      const suma = lista.reduce((s, c) => s + valor(c), 0)
      return responder(`
╭━━〔 💞 *HAREM* 〕━━⬣
┃ 👤 ${tag(quien)}
┃ 🎴 Personajes: *${lista.length}*  ·  ✰ Valor total: *${num(suma)}*
┃┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
${trozo.map((c, i) => `┃ ${String((pag - 1) * CONFIG.porPagina + i + 1).padStart(2, ' ')}. ${genero(c.gender)} *${c.name}* — ${num(valor(c))}${sales[c.id] ? ' 🏷️' : ''}`).join('\n')}
╰━━━━━━━━━━━━━━━━⬣
📄 Página ${pag}/${total}${pag < total ? ` · *${p}harem ${pag + 1}*` : ''}`, [quien]), true
    }

    case 'delchar': {
      const c = buscar(q)
      if (!q) return responder(`❀ Ejemplo: *${p}delchar Rem*`), true
      if (!c) return responder(`ꕥ No encontré a *${q}*.`), true
      if (dueno(c.id) !== sender) return responder(`ꕥ *${c.name}* no es tuyo.`), true
      quitar(sender, c.id); delete claims[c.id]; guardar()
      return responder(`🕊️ Liberaste a *${c.name}*. Ahora cualquiera lo puede reclamar.`), true
    }

    case 'sell': {
      const pr = Math.floor(Number(args[0]))
      const nombre = args.slice(1).join(' ')
      if (!pr || !nombre) return responder(`🏷️ Uso: *${p}sell <precio> <nombre>*\nEj: *${p}sell 20 Rem*`), true
      if (pr < CONFIG.ventaMin || pr > CONFIG.ventaMax) return responder(`❌ El precio va de ₹${CONFIG.ventaMin} a ₹${num(CONFIG.ventaMax)}.`), true
      const c = buscar(nombre)
      if (!c) return responder(`❌ No encontré a *${nombre}*.`), true
      if (dueno(c.id) !== sender) return responder(`❌ *${c.name}* no es tuyo.`), true
      if (sales[c.id]) return responder('❌ Ya está en venta.'), true
      sales[c.id] = { user: sender, price: pr, expires: Date.now() + CONFIG.ventaDura }; guardar()
      return responder(`🏷️ *${c.name}* está a la venta por *₹${pr}* durante 3 días.\nOtros lo compran con *${p}buyc ${c.name}*`), true
    }

    case 'wshop': {
      for (const [id, v] of Object.entries(sales)) if (v.expires < Date.now() || dueno(id) !== v.user) delete sales[id]
      guardar()
      const ventas = Object.entries(sales).map(([id, v]) => ({ c: personajes().find(x => x.id === id), ...v })).filter(x => x.c)
      if (!ventas.length) return responder('🛒 No hay personajes en venta ahora mismo.'), true
      const pag = Math.max(1, parseInt(args[0]) || 1), por = 10
      const total = Math.ceil(ventas.length / por)
      const trozo = ventas.slice((pag - 1) * por, pag * por)
      return responder(`
╭━━〔 🛒 *TIENDA DE PERSONAJES* 〕━━⬣
${trozo.map(v => `┃ 🏷️ *${v.c.name}* _(${v.c.serie})_\n┃    💰 ₹${num(v.price)} · ✰ ${num(valor(v.c))} · 👤 ${tag(v.user)}`).join('\n')}
╰━━━━━━━━━━━━━━━━⬣
📄 Página ${pag}/${total} · Compra con *${p}buyc <nombre>*`, trozo.map(v => v.user)), true
    }

    case 'buyc': {
      const c = buscar(q)
      if (!q || !c) return responder(`🛒 Uso: *${p}buyc <nombre>*`), true
      const v = sales[c.id]
      if (!v || v.expires < Date.now() || dueno(c.id) !== v.user) return responder(`❌ *${c.name}* no está en venta.`), true
      if (v.user === sender) return responder('🙃 Ya es tuyo.'), true
      if (dinero(sender) < v.price) return responder(`💸 Cuesta ₹${v.price} y tienes ₹${dinero(sender)}.`), true
      delkoin(sender, v.price); addkoin(v.user, v.price)
      const vendedor = v.user
      quitar(vendedor, c.id); dar(sender, c.id); guardar()
      return responder(`🤝 *¡Compra hecha!*\n🎴 *${c.name}* ahora es de ${tag(sender)}\n💰 ${tag(vendedor)} recibió ₹${v.price}`, [sender, vendedor]), true
    }

    case 'givechar': {
      const para = mencionado(ctx)
      const nombre = textoSinMenciones(q)
      if (!para || !nombre) return responder(`🎁 Uso: *${p}givechar <nombre> @alguien*`), true
      if (base(para) === base(sender)) return responder('❌ No puedes regalarte a ti mismo.'), true
      const c = buscar(nombre)
      if (!c || dueno(c.id) !== sender) return responder('❌ No encontré ese personaje en tu harem.'), true
      quitar(sender, c.id); dar(para, c.id); guardar()
      return responder(`🎁 ${tag(sender)} le regaló *${c.name}* a ${tag(para)} 💝`, [sender, para]), true
    }

    case 'giveall': {
      const para = mencionado(ctx)
      if (!para) return responder(`🎁 Uso: *${p}giveall @alguien*`), true
      if (base(para) === base(sender)) return responder('❌ No puedes regalarte a ti mismo.'), true
      const lista = misPj(sender)
      if (!lista.length) return responder('ꕥ No tienes personajes para regalar.'), true
      pendientesGiveall[sender] = { para, t: Date.now() }
      return responder(`⚠️ Vas a regalar *${lista.length} personajes* a ${tag(para)}.\n\n✅ Confirma con *${p}confirmargiveall* (60 segundos)`, [para]), true
    }

    case 'confirmargiveall': {
      const pe = pendientesGiveall[sender]
      if (!pe || Date.now() - pe.t > 60000) return responder('❌ No hay un regalo pendiente o expiró.'), true
      delete pendientesGiveall[sender]
      const lista = [...misPj(sender)]
      for (const id of lista) { quitar(sender, id); dar(pe.para, id) }
      guardar()
      return responder(`🎁 ${tag(sender)} le regaló *${lista.length} personajes* a ${tag(pe.para)} 💝`, [sender, pe.para]), true
    }

    case 'trade': {
      const para = mencionado(ctx)
      const partes = textoSinMenciones(q).split('/').map(s => s.trim())
      if (!para || partes.length < 2 || !partes[0] || !partes[1]) return responder(`🔄 Uso: *${p}trade TuPersonaje / SuPersonaje @alguien*`), true
      const mio = buscar(partes[0]), suyo = buscar(partes[1])
      if (!mio || dueno(mio.id) !== sender) return responder(`❌ *${partes[0]}* no está en tu harem.`), true
      if (!suyo || base(dueno(suyo.id)) !== base(para)) return responder(`❌ *${partes[1]}* no es de ${tag(para)}.`, [para]), true
      pendientesTrade[base(para)] = { de: sender, para: dueno(suyo.id), mio: mio.id, suyo: suyo.id, t: Date.now() }
      return responder(`
╭━━〔 🔄 *INTERCAMBIO* 〕━━⬣
┃ ${tag(sender)} ofrece: *${mio.name}* (✰ ${num(valor(mio))})
┃ ${tag(para)} da: *${suyo.name}* (✰ ${num(valor(suyo))})
╰━━━━━━━━━━━━━━━━⬣
✍️ ${tag(para)}, acepta con *${p}aceptartrade* (2 min)`, [sender, para]), true
    }

    case 'aceptartrade': {
      const t = pendientesTrade[base(sender)]
      if (!t || Date.now() - t.t > 2 * 60 * 1000) return responder('❌ No tienes intercambios pendientes o expiró.'), true
      delete pendientesTrade[base(sender)]
      if (dueno(t.mio) !== t.de) return responder('❌ El otro usuario ya no tiene ese personaje.'), true
      if (base(dueno(t.suyo)) !== base(sender)) return responder('❌ Ya no tienes ese personaje.'), true
      const yo = dueno(t.suyo)
      quitar(t.de, t.mio); quitar(yo, t.suyo); dar(yo, t.mio); dar(t.de, t.suyo); guardar()
      const a = personajes().find(c => c.id === t.mio), b = personajes().find(c => c.id === t.suyo)
      return responder(`✅ *¡Intercambio hecho!*\n🔄 ${tag(t.de)} recibió *${b?.name}*\n🔄 ${tag(yo)} recibió *${a?.name}*`, [t.de, yo]), true
    }

    case 'votar': {
      const c = buscar(q)
      if (!q) return responder(`🗳️ Uso: *${p}votar <nombre>*`), true
      if (!c) return responder('ꕥ Personaje no encontrado.'), true
      const f = espera('voto', sender, CONFIG.esperaVoto)
      if (f) return responder(`⏳ Puedes votar otra vez en *${tiempo(f)}*`), true
      const r = votes[c.id] = votes[c.id] || { name: c.name, value: Number(c.value || 100), votes: 0, lastVotedAt: 0, daily: {} }
      if (r.lastVotedAt && Date.now() < r.lastVotedAt + CONFIG.esperaVoto) return responder(`ꕥ *${c.name}* fue votado hace poco. Espera *${tiempo(r.lastVotedAt + CONFIG.esperaVoto - Date.now())}*`), true
      const hoy = new Date().toISOString().slice(0, 10)
      r.daily = { [hoy]: r.daily?.[hoy] || 0 }
      if (r.daily[hoy] >= CONFIG.maxSubidaDiaria) return responder(`ꕥ *${c.name}* ya subió lo máximo de hoy.`), true
      const sube = Math.min(CONFIG.maxSubidaDiaria - r.daily[hoy], Math.floor(Math.random() * 201) + 50)
      r.value += sube; r.votes++; r.lastVotedAt = Date.now(); r.daily[hoy] += sube
      marcar('voto', sender); guardar()
      return responder(`🗳️ Votaste por *${c.name}*\n❖ ${c.serie}\n⬆️ +${sube}  →  ✰ *${num(r.value)}*\n🗳️ Votos: ${r.votes}`), true
    }

    case 'wtop': {
      const lista = [...personajes()].sort((a, b) => valor(b) - valor(a))
      const pag = Math.max(1, parseInt(args[0]) || 1), por = 10
      const total = Math.ceil(lista.length / por)
      if (pag > total) return responder(`❌ Hay ${total} páginas.`), true
      const med = ['🥇', '🥈', '🥉']
      const trozo = lista.slice((pag - 1) * por, pag * por)
      return responder(`
╭━━〔 🏆 *PERSONAJES CON MÁS VALOR* 〕━━⬣
${trozo.map((c, i) => { const n = (pag - 1) * por + i; return `┃ ${med[n] || `${n + 1}.`} *${c.name}* — ✰ ${num(valor(c))}${dueno(c.id) ? ' 💞' : ''}` }).join('\n')}
╰━━━━━━━━━━━━━━━━⬣
📄 Página ${pag}/${total}${pag < total ? ` · *${p}wtop ${pag + 1}*` : ''}
💞 = ya tiene dueño`), true
    }

    case 'rankc': {
      const top = Object.entries(users).map(([j, l]) => {
        const ids = (l || []).map(String).filter(id => dueno(id) === j)
        return { j, n: ids.length, v: ids.reduce((s, id) => { const c = personajes().find(x => x.id === id); return s + (c ? valor(c) : 0) }, 0) }
      }).filter(x => x.n).sort((a, b) => b.v - a.v).slice(0, 10)
      if (!top.length) return responder('📭 Nadie tiene personajes todavía.'), true
      const med = ['🥇', '🥈', '🥉']
      return responder(`
╭━━〔 👑 *MEJORES COLECCIONISTAS* 〕━━⬣
${top.map((x, i) => `┃ ${med[i] || `${i + 1}.`} ${tag(x.j)} · 🎴 ${x.n} · ✰ ${num(x.v)}`).join('\n')}
╰━━━━━━━━━━━━━━━━⬣`, top.map(x => x.j)), true
    }
  }
  return true
}

module.exports = { manejar, menuGacha, CONFIG }
