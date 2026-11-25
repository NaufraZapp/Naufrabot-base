// ══════════════════════════════════════════════════════════
// 🎮 PUENTE DE LOS JUEGOS TEMÁTICOS
//    index.js llama a manejar(ctx) antes del switch de comandos.
//    Si el comando es de un juego temático, lo atiende aquí y
//    devuelve true; si no, devuelve false y sigue el switch normal.
//
//    Comandos de aquí: menujuegos, trivia, resp, canjear
//    escuchar(ctx) recibe los mensajes SIN prefijo (BANG, acepto, números…)
// ══════════════════════════════════════════════════════════
const Fiesta = require('./fiesta.js')
const Gacha = require('./gacha.js')
const ZZZ = require('./zzz.js')
const Dandy = require('./dandy.js')
const DZ = require('../Data/zzz_datos.js')
const DD = require('../Data/dandy_datos.js')
const { mandar, azar, num, triviasActivas, normal } = require('./temas_utils.js')

const TIEMPO_TRIVIA = 45 * 1000
const LETRAS = ['A', 'B', 'C', 'D']

// 💱 Cambio a la moneda de la base (Rupias)
const CAMBIO = { dennies: 10000, ichor: 500 } // cuánto vale 1 Rupia
const LIMITE_DIARIO = 15                        // Rupias máximas por persona al día
const hoy = () => new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima' })

function menuJuegos(p) {
  return Fiesta.menuFiesta(p).trim() + `

╭─〔 🎴 *PACKS TEMÁTICOS* 〕
┃ 🎴 *${p}menugacha* — Gacha de personajes de anime
┃ 🌸 *${p}menuzzz* — Zenless Zone Zero (Remielle)
┃ 🌼 *${p}menudandy* — Dandy's World
┃ ❓ *${p}trivia zzz* · *${p}trivia dandy*
┃ 💱 *${p}canjear* — Dennies o Ichor a Rupias
╰──────────────⬣`
}

async function manejar(ctxOriginal) {
  // Quitamos espacios sobrantes al inicio/fin de cada mensaje
  const ctx = { ...ctxOriginal, enviar: (t, extra) => ctxOriginal.enviar(String(t).trim(), extra) }
  const { comando, args, from, sender, pushname, prefixo: p, enviar, isReg, respuesta, addXp, addkoin, Naufra } = ctx

  // 1) Zona de juegos (para todo el mundo) y juegos de cada tema
  if (await Gacha.manejar(ctx)) return true
  if (await Fiesta.manejar(ctx)) return true
  if (await ZZZ.manejar(ctx)) return true
  if (await Dandy.manejar(ctx)) return true

  switch (comando) {
    case 'menujuegos': case 'juegos':
      await mandar(ctx, menuJuegos(p), 'menu_juegos', [sender])
      return true

    case 'trivia': {
      if (triviasActivas.has(from)) { enviar(`❓ Ya hay una trivia en curso. Responde con *${p}resp <letra>*`); return true }
      const tema = normal(args[0]) === 'dandy' ? 'dandy' : normal(args[0]) === 'zzz' ? 'zzz' : azar(['zzz', 'dandy'])
      const t = azar(tema === 'zzz' ? DZ.trivia : DD.trivia)
      // Mezclamos las opciones para que la correcta no esté siempre en el mismo lugar
      const orden = t.o.map((txt, i) => ({ txt, ok: i === t.r })).sort(() => Math.random() - 0.5)
      const correcta = orden.findIndex(x => x.ok)
      const premio = tema === 'zzz' ? '60 💎 Polychrome' : '25 💧 Ichor'
      const timer = setTimeout(() => {
        if (!triviasActivas.has(from)) return
        triviasActivas.delete(from)
        Naufra.sendMessage(from, { text: `⏰ ¡Se acabó el tiempo!\nLa respuesta era *${LETRAS[correcta]}) ${orden[correcta].txt}*` }).catch(() => {})
      }, TIEMPO_TRIVIA)
      triviasActivas.set(from, { tema, correcta, orden, intentos: new Set(), timer })
      enviar(`
╭━━〔 ${tema === 'zzz' ? '🌸 TRIVIA ZZZ' : "🌼 TRIVIA DANDY'S WORLD"} 〕━━⬣
┃ ❓ *${t.p}*
┃
${orden.map((x, i) => `┃ *${LETRAS[i]})* ${x.txt}`).join('\n')}
╰━━━━━━━━━━━━━━━━⬣
⏳ Tienen 45 segundos · 🎁 Premio: ${premio}
➢ Responde con *${p}resp A* (una sola oportunidad por persona)`)
      return true
    }

    case 'resp': case 'respuesta': case 'r': {
      const tr = triviasActivas.get(from)
      if (!tr) return comando === 'r' ? false : (enviar(`❓ No hay trivia activa. Empieza una con *${p}trivia*`), true)
      if (!isReg) { enviar(respuesta.registro); return true }
      const letra = (args[0] || '').toUpperCase().replace(/[^A-D1-4]/g, '')
      const idx = /[1-4]/.test(letra) ? Number(letra) - 1 : LETRAS.indexOf(letra)
      if (idx < 0) { enviar(`✏️ Responde con una letra: *${p}resp A*, *B*, *C* o *D*`); return true }
      if (tr.intentos.has(sender)) { enviar('🙊 Ya usaste tu oportunidad en esta trivia.'); return true }
      tr.intentos.add(sender)
      if (idx !== tr.correcta) { enviar(`❌ Incorrecto, @${sender.split('@')[0]}…`, { mentions: [sender] }); return true }
      clearTimeout(tr.timer); triviasActivas.delete(from)
      if (tr.tema === 'zzz') { const u = ZZZ.db.obtener(sender, pushname); u.poly += 60; ZZZ.db.guardar() }
      else { const u = Dandy.db.obtener(sender, pushname); u.ichor += 25; Dandy.db.guardar() }
      addXp(sender, 30)
      enviar(`✅ *¡Correcto, @${sender.split('@')[0]}!*\n🎁 ${tr.tema === 'zzz' ? '+60 💎 Polychrome' : '+25 💧 Ichor'} · 📚 +30 XP${tr.tema === 'zzz' ? '\n\n🌸 _"Lista e inteligente… peligrosa combinación"_' : ''}`, { mentions: [sender] })
      return true
    }

    case 'canjear': {
      if (!isReg) { enviar(respuesta.registro); return true }
      const moneda = normal(args[0])
      const cant = Math.floor(Number(args[1]))
      if (!CAMBIO[moneda] || !cant || cant <= 0) {
        enviar(`💱 *Canje a Rupias*\n➢ *${p}canjear dennies 20000* → ₹2\n➢ *${p}canjear ichor 1500* → ₹3\n\n${num(CAMBIO.dennies)} Dennies = ₹1 · ${CAMBIO.ichor} Ichor = ₹1\nMáximo ₹${LIMITE_DIARIO} por día.`)
        return true
      }
      const registroCanje = ZZZ.db.obtener(sender, pushname)
      if (!registroCanje.canje || registroCanje.canje.dia !== hoy()) registroCanje.canje = { dia: hoy(), rupias: 0 }
      const disponible = LIMITE_DIARIO - registroCanje.canje.rupias
      if (disponible <= 0) { enviar(`💱 Ya llegaste al límite de hoy (₹${LIMITE_DIARIO}). Vuelve mañana 🌸`); return true }
      const rupias = Math.min(disponible, Math.floor(cant / CAMBIO[moneda]))
      if (rupias < 1) { enviar(`💱 Necesitas al menos ${num(CAMBIO[moneda])} ${moneda} para ₹1.`); return true }
      const gasto = rupias * CAMBIO[moneda]
      const db = moneda === 'dennies' ? ZZZ.db : Dandy.db
      const u = db.obtener(sender, pushname)
      if (u[moneda] < gasto) { enviar(`💸 No te alcanza: tienes ${num(u[moneda])} ${moneda}.`); return true }
      u[moneda] -= gasto
      registroCanje.canje.rupias += rupias
      ZZZ.db.guardar(); Dandy.db.guardar()
      await addkoin(sender, rupias)
      enviar(`💱 Cambiaste *${num(gasto)} ${moneda}* por *₹${rupias} Rupias* 🪙\nHoy puedes canjear ₹${LIMITE_DIARIO - registroCanje.canje.rupias} más.\nRevisa tu cartera con *${p}perfil*`)
      return true
    }
  }
  return false
}

// Mensajes sin prefijo: solo los usa la Zona de juegos
async function escuchar(ctx) {
  try { return await Fiesta.escuchar(ctx) } catch (e) { console.log('⚠️ Error en juego:', e.message); return false }
}

module.exports = { manejar, escuchar }
