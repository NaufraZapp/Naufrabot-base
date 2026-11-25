// ══════════════════════════════════════════════════════════
// 🌸 JUEGOS TEMA REMIELLE DAN / ZENLESS ZONE ZERO
//    Comandos: menuzzz, remielle, remifrase, proxy, comision, senal,
//              agentes, hollow, cazar, bangboo, adoptar, rankzzz
// ══════════════════════════════════════════════════════════
const D = require('../Data/zzz_datos.js')
const { crearDB, mandar, azar, entre, num, azarPesado, tiempo, falta, marcar, barra, normal } = require('./temas_utils.js')

const db = crearDB('zzz_usuarios.json', {
  poly: 1600,          // empiezas con 10 tiradas
  dennies: 5000,
  agentes: {},         // { nombre: { rango, m } }  m = Mindscape
  pityS: 0, pityA: 0, garantizado: false,
  tiradas: 0, hollows: 0, cazas: 0, victorias: 0,
  bangboo: null,
  esperas: {}
})

const ESPERA = {
  comision: 24 * 60 * 60 * 1000,
  hollow: 15 * 60 * 1000,
  cazar: 8 * 60 * 1000
}

const L = '┄'.repeat(22)
const cab = (t) => `╭━━〔 🌸 ${t} 〕━━⬣`
const pie = `╰━━━━━━━━━━━━━━━━⬣`

const emo = (n) => D.emojiAgente[n] || '⭐'
const tieneRemielle = (u) => !!u.agentes[D.gacha.destacado]
const bonoBangboo = (u) => (u.bangboo ? (D.bangboos.find(b => b.nombre === u.bangboo)?.bono || 0) : 0)

function poder(u) {
  const lista = Object.entries(u.agentes)
    .map(([n, a]) => (a.rango === 'S' ? 35 : 15) + a.m * 5 + (n === D.gacha.destacado ? 15 : 0))
    .sort((a, b) => b - a).slice(0, 3)
  return 20 + lista.reduce((s, x) => s + x, 0) + (u.bangboo ? 5 : 0)
}

// 🎰 Una tirada con pity, soft pity y 50/50
function tirarUna(u) {
  const g = D.gacha
  u.pityS++; u.pityA++; u.tiradas++
  let pS = g.probS
  if (u.pityS > g.softPity) pS += (u.pityS - g.softPity) * 0.06
  if (u.pityS >= g.pityS) pS = 1
  if (Math.random() < pS) {
    const pity = u.pityS
    u.pityS = 0; u.pityA = 0
    if (u.garantizado || Math.random() < 0.5) {
      u.garantizado = false
      return { rango: 'S', nombre: g.destacado, pity }
    }
    u.garantizado = true
    return { rango: 'S', nombre: azar(D.sEstandar), pity, perdio: true }
  }
  if (u.pityA >= g.pityA || Math.random() < g.probA) {
    u.pityA = 0
    return { rango: 'A', nombre: azar(D.agentesA) }
  }
  return { rango: 'B', nombre: 'Motor-W rango B' }
}

// Guarda el resultado en la colección y devuelve el texto de la línea
function guardarResultado(u, r) {
  if (r.rango === 'B') { u.dennies += 300; return `🟦 ${r.nombre} → +300 Dennies` }
  const a = u.agentes[r.nombre]
  let extra = ''
  if (!a) { u.agentes[r.nombre] = { rango: r.rango, m: 0 }; extra = ' 🆕' }
  else if (a.m < 6) { a.m++; extra = ` (M${a.m})` }
  else { const d = r.rango === 'S' ? 5000 : 1000; u.dennies += d; extra = ` (M6 máx → +${num(d)} Dennies)` }
  if (r.rango === 'S') return `🟨 *${emo(r.nombre)} ${r.nombre}* ✦ RANGO S${extra}${r.perdio ? ' — perdiste el 50/50 😿' : ' 🎉'}`
  return `🟪 ${emo(r.nombre)} ${r.nombre} ✦ A${extra}`
}

function saludo() {
  const h = Number(new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour: 'numeric', hour12: false }))
  return h >= 5 && h < 12 ? D.saludos.manana : h >= 12 && h < 19 ? D.saludos.tarde : D.saludos.noche
}

function menuZZZ(p) {
  return `
╭━━━━━━━━━━━━━━━━━━━⬣
┃ 🌸 *R E M I E L L E   D A N* 🌸
┃ _Cazadora del Vacío · Lumiflux_
╰━━━━━━━━━━━━━━━━━━━⬣
_${saludo()}_

╭─〔 🪽 *PERSONAJE* 〕
┃ ➢ *${p}remielle* — Su ficha completa
┃ ➢ *${p}remifrase* — Una frase suya
╰──────────⬣
╭─〔 💎 *PROXY* 〕
┃ ➢ *${p}proxy* — Tu perfil de ZZZ
┃ ➢ *${p}comision* — Recompensa diaria
┃ ➢ *${p}agentes* — Tu colección
┃ ➢ *${p}rankzzz* — Ranking del grupo
╰──────────⬣
╭─〔 🎰 *SEÑAL (GACHA)* 〕
┃ ➢ *${p}senal* — 1 tirada (${D.gacha.costo} 💎)
┃ ➢ *${p}senal 10* — 10 tiradas
┃ ➢ Destacada: *${D.gacha.destacado}* 🌸
┃ ➢ S asegurado a las ${D.gacha.pityS} · A cada ${D.gacha.pityA}
╰──────────⬣
╭─〔 🕳️ *HOLLOW* 〕
┃ ➢ *${p}hollow* — Explora y consigue botín
┃ ➢ *${p}cazar* — Pelea contra un Etéreo
╰──────────⬣
╭─〔 🐰 *BANGBOO* 〕
┃ ➢ *${p}bangboo* — Ver Bangboos
┃ ➢ *${p}adoptar <nombre>* — Adopta uno
╰──────────⬣
╭─〔 ❓ *EXTRA* 〕
┃ ➢ *${p}trivia zzz* — Preguntas de ZZZ
┃ ➢ *${p}canjear dennies <cantidad>* — A Rupias
╰──────────⬣
> 🌸 _"Acércate, pero no tanto."_`
}

async function manejar(ctx) {
  const { comando, args, q, prefixo: p, sender, pushname, enviar, addXp, respuesta, isReg } = ctx
  const comandos = ['menuzzz', 'menuremielle', 'zzz', 'remielle', 'remi', 'remifrase', 'frase', 'proxy', 'perfilzzz',
    'comision', 'dailyzzz', 'senal', 'tirar', 'agentes', 'coleccion', 'hollow', 'explorar',
    'cazar', 'bangboo', 'bangboos', 'adoptar', 'rankzzz', 'topzzz']
  if (!comandos.includes(comando)) return false

  // La ficha y las frases las puede ver cualquiera; lo demás pide registro (por la XP)
  const libres = ['menuzzz', 'menuremielle', 'zzz', 'remielle', 'remi', 'remifrase', 'frase']
  if (!libres.includes(comando) && !isReg) { enviar(respuesta.registro); return true }

  const u = db.obtener(sender, pushname)

  switch (comando) {
    case 'menuzzz': case 'menuremielle': case 'zzz':
      await mandar(ctx, menuZZZ(p), 'menu_remielle', [sender])
      break

    case 'remielle': case 'remi': {
      const f = D.ficha
      await mandar(ctx, `
${cab('FICHA DE AGENTE')}
┃ 👤 *Nombre:* ${f.nombre}
┃ 🎭 *Alias:* ${f.alias}
┃ 🏅 *Rango:* ${f.rango}
┃ ✨ *Atributo:* ${f.atributo}
┃ ⚔️ *Especialidad:* ${f.especialidad}
┃ 🏛️ *Facción:* ${f.faccion}
┃ 🪽 *Título:* ${f.titulo}
┃ 🐰 *Bangboo:* ${f.bangboo}
┃ 📅 *Llegada:* ${f.llegada}
┃ 🎙️ *Voz EN:* ${f.vozEN}
┃ 🎙️ *Voz JP:* ${f.vozJP}
${pie}

💬 _"${azar(D.frases)}"_`, 'remielle')
      break
    }

    case 'remifrase': case 'frase':
      await mandar(ctx, `🌸 *Remielle:*\n\n_"${azar(D.frases)}"_`, 'remielle_frase')
      break

    case 'proxy': case 'perfilzzz': {
      const lista = Object.values(u.agentes)
      const s = lista.filter(a => a.rango === 'S').length
      const a = lista.filter(a => a.rango === 'A').length
      enviar(`
${cab('PERFIL DE PROXY')}
┃ 👤 @${sender.split('@')[0]}
┃ 💎 *Polychrome:* ${num(u.poly)}
┃ 💵 *Dennies:* ${num(u.dennies)}
┃ ${L}
┃ 🟨 Agentes S: *${s}*   🟪 Agentes A: *${a}*
┃ 🌸 Remielle: ${tieneRemielle(u) ? `✅ M${u.agentes[D.gacha.destacado].m}` : '❌ Aún no'}
┃ 🐰 Bangboo: ${u.bangboo || 'ninguno'}
┃ ⚔️ Poder de escuadrón: *${poder(u)}*
┃ ${L}
┃ 🎰 Pity S: ${u.pityS}/${D.gacha.pityS} ${barra(u.pityS, D.gacha.pityS, 8)}
┃ 🎯 50/50: ${u.garantizado ? '*Asegurado* ✅' : 'Pendiente'}
┃ 🕳️ Hollows: ${u.hollows}   ⚔️ Cazas: ${u.victorias}/${u.cazas}
${pie}`, { mentions: [sender] })
      break
    }

    case 'comision': case 'dailyzzz': {
      const f = falta(u, 'comision', ESPERA.comision)
      if (f) { enviar(`⏳ Ya cobraste tu comisión de hoy, Proxy.\nVuelve en *${tiempo(f)}* 🌸`); break }
      const poly = entre(160, 480), den = Math.round(entre(2000, 6000) * (1 + bonoBangboo(u)))
      u.poly += poly; u.dennies += den
      marcar(u, 'comision'); db.guardar(); addXp(sender, 50)
      enviar(`
${cab('COMISIÓN DIARIA')}
┃ 💎 +${num(poly)} Polychrome
┃ 💵 +${num(den)} Dennies${u.bangboo ? ` _(bono de ${u.bangboo})_` : ''}
┃ 📚 +50 XP
${pie}
_"¿Ves? Trabajar conmigo tiene sus ventajas"_ 🌸`)
      break
    }

    case 'senal': case 'tirar': {
      const n = args[0] === '10' ? 10 : 1
      const costo = D.gacha.costo * n
      if (u.poly < costo) {
        enviar(`💎 Te faltan Polychrome. Tienes *${num(u.poly)}* y necesitas *${num(costo)}*.\nConsigue más con *${p}comision*, *${p}hollow* o *${p}trivia zzz*.`)
        break
      }
      u.poly -= costo
      const resultados = Array.from({ length: n }, () => tirarUna(u))
      const lineas = resultados.map(r => guardarResultado(u, r))
      const hayS = resultados.some(r => r.rango === 'S')
      const gotRemi = resultados.some(r => r.nombre === D.gacha.destacado)
      db.guardar(); addXp(sender, 10 * n)
      const titulo = gotRemi ? '🌸✨ ¡REMIELLE RESPONDIÓ A TU SEÑAL! ✨🌸' : hayS ? '🌟 ¡SEÑAL DORADA! 🌟' : '📡 Señal recibida'
      await mandar(ctx, `
${cab(`SEÑAL x${n}`)}
┃ ${titulo}
┃ ${L}
${lineas.map(l => `┃ ${l}`).join('\n')}
┃ ${L}
┃ 🎰 Pity S: ${u.pityS}/${D.gacha.pityS}   💎 Quedan: ${num(u.poly)}
${pie}${gotRemi ? `\n\n💬 _"${azar(['Qué insistente… me gusta 🌸', 'Bueno, ya que me llamaste tan bonito, me quedo ✨', 'Tardaste, Proxy. Pero llegaste 🪽'])}"_` : ''}`,
      gotRemi ? 'tirada_remielle' : '', [sender])
      break
    }

    case 'agentes': case 'coleccion': {
      const lista = Object.entries(u.agentes).sort((a, b) => a[1].rango === b[1].rango ? b[1].m - a[1].m : (a[1].rango === 'S' ? -1 : 1))
      if (!lista.length) { enviar(`📭 Aún no tienes agentes. Usa *${p}senal* para tirar 🎰`); break }
      enviar(`
${cab('TUS AGENTES')}
${lista.map(([n, a]) => `┃ ${a.rango === 'S' ? '🟨' : '🟪'} ${emo(n)} *${n}* · ${a.rango} · M${a.m}`).join('\n')}
┃ ${L}
┃ Total: ${lista.length} ${lista.length === 1 ? 'agente' : 'agentes'} · Poder: ${poder(u)}
${pie}`)
      break
    }

    case 'hollow': case 'explorar': {
      const f = falta(u, 'hollow', ESPERA.hollow)
      if (f) { enviar(`🕳️ El Hollow todavía se está estabilizando.\nPuedes volver a entrar en *${tiempo(f)}*.`); break }
      marcar(u, 'hollow'); u.hollows++
      let ev = azarPesado(D.eventosHollow)
      // Sin Remielle, su evento se cambia por una caja normal
      if (ev.tipo === 'remielle' && !tieneRemielle(u)) ev = D.eventosHollow[0]
      const b = 1 + bonoBangboo(u)
      let res = ''
      let xp = 30
      switch (ev.tipo) {
        case 'dennies': { const d = Math.round(entre(ev.min, ev.max) * b); u.dennies += d; res = `💵 +${num(d)} Dennies`; break }
        case 'poly': { const d = entre(ev.min, ev.max); u.poly += d; res = `💎 +${num(d)} Polychrome`; break }
        case 'pelea': {
          const gana = Math.random() < Math.min(0.9, 0.35 + poder(u) / 300)
          if (gana) { const d = Math.round(entre(ev.min, ev.max) * b); u.dennies += d; xp = 60; res = `🏆 ¡Los derrotaste! +${num(d)} Dennies` }
          else res = '😵 Tuviste que huir sin botín…'
          break
        }
        case 'trampa': { const d = Math.min(u.dennies, entre(ev.min, ev.max)); u.dennies -= d; xp = 10; res = `💸 Perdiste ${num(d)} Dennies curándote` ; break }
        case 'tienda': { const d = entre(20, 80); u.poly += d; res = `🛒 Te regaló ${d} 💎 Polychrome por ser buen cliente`; break }
        case 'remielle': { const d = Math.round(entre(ev.min, ev.max) * b); const po = entre(40, 100); u.dennies += d; u.poly += po; xp = 80; res = `🪽 +${num(d)} Dennies y +${po} 💎 Polychrome\n┃ 💬 _"No me lo agradezcas… todavía"_`; break }
        case 'jackpot': { const d = entre(ev.min, ev.max); u.poly += d; xp = 100; res = `🎁 ¡+${d} 💎 Polychrome!`; break }
      }
      db.guardar(); addXp(sender, xp)
      await mandar(ctx, `
${cab('EXPLORACIÓN DEL HOLLOW')}
┃ 🧭 ${ev.texto}
┃ ${L}
┃ ${res}
┃ 📚 +${xp} XP
${pie}
⏳ Próxima exploración en 15 min`, 'hollow')
      break
    }

    case 'cazar': {
      const f = falta(u, 'cazar', ESPERA.cazar)
      if (f) { enviar(`⚔️ Tu escuadrón está descansando.\nPodrás cazar otra vez en *${tiempo(f)}*.`); break }
      marcar(u, 'cazar'); u.cazas++
      const pw = poder(u)
      const posibles = D.etereos.filter(e => e.poder <= pw + 40)
      const e = azar(posibles.length ? posibles : [D.etereos[0]])
      const lumiflux = tieneRemielle(u) && Math.random() < 0.35
      let prob = pw / (pw + e.poder * 1.1) + (lumiflux ? 0.2 : 0)
      prob = Math.max(0.1, Math.min(0.92, prob))
      const gana = Math.random() < prob
      let txt
      if (gana) {
        u.victorias++
        const d = Math.round(entre(...e.dennies) * (1 + bonoBangboo(u)) * (lumiflux ? 1.5 : 1))
        const po = Math.random() < 0.3 ? entre(20, 60) : 0
        u.dennies += d; u.poly += po
        addXp(sender, 70)
        txt = `┃ 🏆 *¡VICTORIA!*\n┃ 💵 +${num(d)} Dennies${po ? `\n┃ 💎 +${po} Polychrome` : ''}\n┃ 📚 +70 XP`
      } else {
        addXp(sender, 15)
        txt = `┃ 💥 *Derrota…* El Etéreo escapó al Hollow.\n┃ 📚 +15 XP\n┃ 💡 Consigue más agentes con *${p}senal* para subir tu poder.`
      }
      db.guardar()
      await mandar(ctx, `
${cab('CAZA DE ETÉREOS')}
┃ ${e.emoji} Enemigo: *${e.nombre}* (poder ${e.poder})
┃ ⚔️ Tu escuadrón: poder *${pw}*
┃ 🎲 Probabilidad: ${Math.round(prob * 100)}%
${lumiflux ? `┃ ✨ *¡ANOMALÍA LUMIFLUX!* Remielle desplegó sus alas 🪽\n` : ''}┃ ${L}
${txt}
${pie}`, 'cazar')
      break
    }

    case 'bangboo': case 'bangboos':
      enviar(`
${cab('BANGBOOS')}
${D.bangboos.map(b => `┃ 🐰 *${b.nombre}* · +${Math.round(b.bono * 100)}% Dennies\n┃    _${b.desc}_`).join('\n')}
┃ ${L}
┃ 💵 Precio: ${num(D.costoBangboo)} Dennies
┃ 🐰 El tuyo: ${u.bangboo || 'ninguno'}
┃ ➢ *${p}adoptar <nombre>*
${pie}`)
      break

    case 'adoptar': {
      if (!q) { enviar(`🐰 Escribe el nombre. Ejemplo: *${p}adoptar Ariel*\nMira la lista con *${p}bangboo*`); break }
      const b = D.bangboos.find(x => normal(x.nombre) === normal(q))
      if (!b) { enviar(`❓ No conozco a ese Bangboo. Mira la lista con *${p}bangboo*`); break }
      if (u.bangboo === b.nombre) { enviar(`🐰 ${b.nombre} ya es tu compañero.`); break }
      if (u.dennies < D.costoBangboo) { enviar(`💵 Necesitas ${num(D.costoBangboo)} Dennies y tienes ${num(u.dennies)}.`); break }
      u.dennies -= D.costoBangboo; u.bangboo = b.nombre; db.guardar()
      enviar(`🐰✨ *¡Adoptaste a ${b.nombre}!*\n_${b.desc}_\n\nBono: +${Math.round(b.bono * 100)}% Dennies en comisiones, Hollow y cazas.${b.nombre === 'Ariel' ? '\n\n💬 _"¿Te llevaste a Ariel? Entonces me debes una visita"_ 🌸' : ''}`)
      break
    }

    case 'rankzzz': case 'topzzz': {
      const todos = Object.entries(db.todos())
        .map(([id, x]) => {
          const ag = Object.values(x.agentes || {})
          const s = ag.filter(a => a.rango === 'S').length
          return { id, s, total: ag.length, pts: s * 1000 + ag.length * 100 + (x.victorias || 0) }
        })
        .filter(x => x.total > 0)
        .sort((a, b) => b.pts - a.pts).slice(0, 10)
      if (!todos.length) { enviar('📭 Nadie tiene agentes todavía.'); break }
      const medalla = ['🥇', '🥈', '🥉']
      enviar(`
${cab('TOP PROXIES')}
${todos.map((x, i) => `┃ ${medalla[i] || `${i + 1}.`} @${x.id.split('@')[0]} · 🟨 ${x.s} S · ${x.total} ${x.total === 1 ? 'agente' : 'agentes'}`).join('\n')}
${pie}`, { mentions: todos.map(x => x.id) })
      break
    }
  }
  return true
}

module.exports = { manejar, db, menuZZZ }
