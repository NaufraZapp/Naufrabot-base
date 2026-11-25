// ══════════════════════════════════════════════════════════
// 🎉 ZONA DE JUEGOS — juegos de grupo para todo el mundo
//    Animaciones en vivo editando mensajes (Baileys 7).
//
//    Comandos:  duelo, bomba, ttt, conecta4, carrera, apostar,
//               pelear, robar, cofre, aceptar, unirse, pasar,
//               cancelar, rendirse
//    Jugadas sin prefijo (las escucha escuchar()):
//               "acepto", "bang", "yo", "pasar", números del tablero
// ══════════════════════════════════════════════════════════
const { azar, entre, num, normal, crearDB, falta, marcar, tiempo } = require('./temas_utils.js')

const partidas = new Map()            // una partida activa por chat
const dormir = (ms) => new Promise(r => setTimeout(r, ms))
const base = (j) => String(j || '').split(':')[0].split('@')[0]
const tag = (j) => j === BOT ? '🤖 *NaufraBot*' : `@${base(j)}`
const BOT = 'bot@naufra'
const menc = (...l) => l.flat().filter(j => j && j !== BOT)

// Esperas personales (cofre, robar) y protección contra robos
const db = crearDB('fiesta_usuarios.json', { esperas: {}, protegidoHasta: 0, victorias: 0, robos: 0, cofres: 0 })

// ─────────────────────────── utilidades ───────────────────────────

// Convierte una mención @lid en el número real del participante (Baileys 7)
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
  const c = ctx.info?.message?.extendedTextMessage?.contextInfo || ctx.info?.message?.contextInfo
  return resolver(ctx, c?.mentionedJid?.[0] || c?.participant || null)
}
const soyYo = (ctx, jid) => jid && (base(ctx.sender) === base(jid) || (ctx.misIds || []).includes(base(jid)))

const dinero = (ctx, id) => { const d = ctx.MoneyOfSender(id); return d === undefined || d === null ? null : Number(d) }

// IDs de los mensajes que manda el propio juego (para no leerlos como jugadas)
const enviados = new Set()
const anotar = (m) => { const id = m?.key?.id; if (id) { enviados.add(id); if (enviados.size > 500) enviados.delete(enviados.values().next().value) } return m }

async function decir(p, texto, menciones = []) {
  return anotar(await p.Naufra.sendMessage(p.from, { text: texto.replace(/^\s*\n|\n\s*$/g, ''), mentions: menc(menciones) }))
}
async function editar(p, key, texto, menciones = []) {
  if (!key) return
  try { await p.Naufra.sendMessage(p.from, { text: texto.replace(/^\s*\n|\n\s*$/g, ''), mentions: menc(menciones), edit: key }) } catch (e) {}
}

function terminar(from) {
  const p = partidas.get(from)
  if (!p) return
  clearTimeout(p.timer); clearTimeout(p.timer2)
  p.terminada = true
  partidas.delete(from)
}

// Cobra la apuesta a todos (si alguien no tiene, devuelve el nombre)
function cobrar(ctx, p, jugadores, monto) {
  if (!monto) return null
  for (const j of jugadores) {
    if (j === BOT) continue
    const d = dinero(ctx, j)
    if (d === null) return `${tag(j)} no está registrado (*${ctx.prefixo}reg*)`
    if (d < monto) return `${tag(j)} no tiene ₹${monto} (tiene ₹${d})`
  }
  for (const j of jugadores) if (j !== BOT) { ctx.delkoin(j, monto); p.bolsa = (p.bolsa || 0) + monto }
  p.pagaron = jugadores.filter(j => j !== BOT)
  p.apuestaCobrada = monto
  return null
}
function devolver(p) {
  if (!p.apuestaCobrada) return
  for (const j of p.pagaron || []) p.addkoin(j, p.apuestaCobrada)
  p.apuestaCobrada = 0; p.bolsa = 0
}
function premiar(p, ganador, xp = 40) {
  if (p.vsBot) xp = Math.min(xp, 10)                 // contra el bot da poca XP (evita farmeo)
  if (ganador && ganador !== BOT) {
    if (p.bolsa) p.addkoin(ganador, p.bolsa)
    try { p.addXp(ganador, xp) } catch (e) {}
    const u = db.obtener(ganador); u.victorias++; db.guardar()
  }
  const b = p.bolsa || 0
  p.bolsa = 0; p.apuestaCobrada = 0
  return b
}

function nuevaPartida(ctx, datos) {
  const p = {
    ...datos, from: ctx.from, Naufra: ctx.Naufra, prefixo: ctx.prefixo,
    addkoin: ctx.addkoin, addXp: ctx.addXp, creada: Date.now(), bolsa: 0
  }
  partidas.set(ctx.from, p)
  return p
}

// Plazo para aceptar un reto
function plazoInvitacion(p, segundos = 60) {
  p.timer = setTimeout(() => {
    if (partidas.get(p.from) !== p || p.fase !== 'invitacion') return
    terminar(p.from)
    decir(p, `⌛ ${tag(p.retado)} no respondió al reto de ${tag(p.retador)}. Reto cancelado.`, [p.retado, p.retador])
  }, segundos * 1000)
}

function invitacion(p, titulo, emoji, extra = '') {
  return `
╔═══════════════════════╗
  ${emoji}  *${titulo}*  ${emoji}
╚═══════════════════════╝

⚔️ ${tag(p.retador)} reta a ${tag(p.retado)}
${p.apuesta ? `💰 Apuesta: *₹${p.apuesta}* cada uno (bolsa ₹${p.apuesta * 2})` : '🤝 Partida amistosa (sin apuesta)'}
${extra}
✍️ ${tag(p.retado)}, escribe *acepto* para jugar
⏳ Tienes 60 segundos`
}

// ═══════════════════════════ 🤠 DUELO ═══════════════════════════

async function empezarDuelo(p) {
  p.fase = 'animacion'
  const enc = `🌅 *D U E L O   A L   A M A N E C E R* 🌅`
  const cara = `${tag(p.retador)}  🆚  ${tag(p.retado)}`
  const frames = [
    `${enc}\n\n🌵🏜️                          🏜️🌵\n\n            🤠  🤠\n\n${cara}\n_Se ponen espalda con espalda…_`,
    `${enc}\n\n🌵🏜️                          🏜️🌵\n\n      🤠👣          👣🤠\n\n${cara}\n_Caminan diez pasos…_`,
    `${enc}\n\n🌵🏜️                          🏜️🌵\n\n🤠👣                    👣🤠\n\n${cara}\n_El viento sopla… 🍃_`,
    `${enc}\n\n🌵                                    🌵\n\n🤠✋                    ✋🤠\n\n          *3️⃣*\n\n⚠️ _Si escriben antes de la señal, pierden_`,
    `${enc}\n\n🌵                                    🌵\n\n🤠✋                    ✋🤠\n\n          *2️⃣*\n\n⚠️ _Si escriben antes de la señal, pierden_`,
    `${enc}\n\n🌵                                    🌵\n\n🤠✋                    ✋🤠\n\n          *1️⃣*\n\n⚠️ _Si escriben antes de la señal, pierden_`,
    `${enc}\n\n🌵                                    🌵\n\n🤠✋                    ✋🤠\n\n        *. . . . .*\n\n😰 _Esperen…_`
  ]
  const m = await decir(p, frames[0], [p.retador, p.retado])
  for (let i = 1; i < frames.length; i++) {
    await dormir(i < 3 ? 1600 : 1100)
    if (p.terminada) return
    if (i === 3) p.fase = 'espera'          // desde el "3" ya no se puede escribir
    await editar(p, m?.key, frames[i], [p.retador, p.retado])
  }
  await dormir(entre(1500, 5000))
  if (p.terminada) return
  p.fase = 'disparo'
  p.senal = Date.now()
  await decir(p, `💥💥💥💥💥💥💥💥💥💥\n\n      🔫 *¡ ¡ ¡ D I S P A R A ! ! !* 🔫\n\n   ✍️ Escribe *BANG* ahora mismo\n\n💥💥💥💥💥💥💥💥💥💥`, [p.retador, p.retado])
  p.timer2 = setTimeout(() => {
    if (partidas.get(p.from) !== p || p.fase !== 'disparo') return
    devolver(p); terminar(p.from)
    decir(p, '🌵 Nadie disparó… los dos pistoleros se fueron a tomar un café ☕\n_Apuestas devueltas._')
  }, 20000)
}

async function finDuelo(p, ganador, perdedor, motivo) {
  terminar(p.from)
  const bolsa = premiar(p, ganador, 50)
  await decir(p, `
╔═══════════════════════╗
     🏆  *¡GANADOR DEL DUELO!*  🏆
╚═══════════════════════╝

        🤠🔫💨      💀
${motivo}

👑 ${tag(ganador)} es el más rápido del oeste
⚰️ ${tag(perdedor)} muerde el polvo
${bolsa ? `💰 Se lleva *₹${bolsa}*` : ''}
📚 +50 XP`, [ganador, perdedor])
}

// ═══════════════════════════ 💣 BOMBA ═══════════════════════════

const textoLobbyBomba = (p) => `
╔═══════════════════════╗
     💣  *P A P A   C A L I E N T E*  💣
╚═══════════════════════╝

🧨 La bomba pasa de mano en mano…
💥 ¡El que la tenga cuando explote, queda fuera!
${p.apuesta ? `💰 Entrada: *₹${p.apuesta}* · El último en pie se lleva todo` : '🤝 Partida amistosa'}

👥 *Jugadores (${p.jugadores.length}):*
${p.jugadores.map((j, i) => `   ${['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪'][i % 9]} ${tag(j)}`).join('\n') || '   _nadie todavía_'}

✍️ Escribe *yo* para entrar · ⏳ 30 s
${p.jugadores.length >= 2 ? `▶️ ${tag(p.retador)} puede escribir *${p.prefixo}empezar*` : ''}`

async function rondaBomba(p, ctx) {
  if (p.terminada) return
  p.fase = 'jugando'
  p.vivos = p.vivos || [...p.jugadores]
  p.portador = azar(p.vivos)
  p.pases = 0
  const mecha = entre(12000, 28000)
  await decir(p, `
💣 *¡RONDA ${p.ronda = (p.ronda || 0) + 1}!*  —  ${p.vivos.length} jugadores en pie

🧨 La bomba la tiene ${tag(p.portador)}
✍️ Escribe *pasar* para lanzársela a otro
_(o *pasar @alguien* para elegir a quién)_`, [p.portador])
  clearTimeout(p.timer)
  p.timer = setTimeout(() => explotar(p), mecha)
}

async function explotar(p) {
  if (partidas.get(p.from) !== p || p.fase !== 'jugando') return
  p.fase = 'boom'
  const muerto = p.portador
  p.vivos = p.vivos.filter(j => j !== muerto)
  await decir(p, `
     💥💥💥💥💥💥💥💥
   💥💥  *B O O O O M*  💥💥
     💥💥💥💥💥💥💥💥
              🔥🔥🔥

💀 ${tag(muerto)} explotó con ${p.pases} pases en la ronda
${p.vivos.length > 1 ? `👥 Quedan: ${p.vivos.map(tag).join(', ')}` : ''}`, [muerto, ...p.vivos])
  if (p.vivos.length <= 1) {
    const ganador = p.vivos[0]
    terminar(p.from)
    const bolsa = premiar(p, ganador, 60)
    await decir(p, `
╔═══════════════════════╗
   🏆  *¡ÚLTIMO EN PIE!*  🏆
╚═══════════════════════╝

        😎💣🔥
👑 ${tag(ganador)} sobrevivió a todas las explosiones
${bolsa ? `💰 Se lleva la bolsa: *₹${bolsa}*` : ''}
📚 +60 XP`, [ganador])
    return
  }
  await dormir(3500)
  rondaBomba(p)
}

// ═══════════════════════ ❌⭕ TRES EN RAYA ═══════════════════════

const TECLAS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const ganaTTT = (t) => { for (const l of LINEAS) if (t[l[0]] && t[l[0]] === t[l[1]] && t[l[1]] === t[l[2]]) return l; return null }

function tableroTTT(t, linea) {
  const c = (i) => t[i] ? (linea && linea.includes(i) ? (t[i] === 'X' ? '❎' : '🟢') : (t[i] === 'X' ? '❌' : '⭕')) : TECLAS[i]
  return `┏━━━━━━━━━━━━━━━┓
┃    ${c(0)}  ${c(1)}  ${c(2)}    ┃
┃    ${c(3)}  ${c(4)}  ${c(5)}    ┃
┃    ${c(6)}  ${c(7)}  ${c(8)}    ┃
┗━━━━━━━━━━━━━━━┛`
}

function minimax(t, turno) {
  const g = ganaTTT(t)
  if (g) return { s: t[g[0]] === 'O' ? 10 : -10 }
  if (t.every(Boolean)) return { s: 0 }
  let mejor = { s: turno === 'O' ? -99 : 99, i: -1 }
  for (let i = 0; i < 9; i++) if (!t[i]) {
    t[i] = turno
    const r = minimax(t, turno === 'O' ? 'X' : 'O')
    t[i] = null
    if (turno === 'O' ? r.s > mejor.s : r.s < mejor.s) mejor = { s: r.s, i }
  }
  return mejor
}
function jugadaBotTTT(t) {
  const libres = t.map((v, i) => v ? -1 : i).filter(i => i >= 0)
  if (Math.random() < 0.25) return azar(libres)      // a veces se equivoca, para que se le pueda ganar
  return minimax([...t], 'O').i
}

// ═══════════════════════ 🔴🟡 CONECTA 4 ═══════════════════════

const FILAS = 6, COLS = 7
function caer(t, col, ficha) {
  for (let f = FILAS - 1; f >= 0; f--) if (!t[f][col]) { t[f][col] = ficha; return f }
  return -1
}
function gana4(t, ficha) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (let f = 0; f < FILAS; f++) for (let c = 0; c < COLS; c++) for (const [df, dc] of dirs) {
    const celdas = [0, 1, 2, 3].map(k => [f + df * k, c + dc * k])
    if (celdas.every(([a, b]) => a >= 0 && a < FILAS && b >= 0 && b < COLS && t[a][b] === ficha)) return celdas
  }
  return null
}
function tableroC4(t, ganadoras) {
  const esG = (f, c) => ganadoras && ganadoras.some(([a, b]) => a === f && b === c)
  const fila = (f) => t[f].map((v, c) => v === 'R' ? (esG(f, c) ? '❤️' : '🔴') : v === 'A' ? (esG(f, c) ? '💛' : '🟡') : '⚫').join('')
  return `${TECLAS.slice(0, 7).join('')}\n${Array.from({ length: FILAS }, (_, f) => fila(f)).join('\n')}\n🟦🟦🟦🟦🟦🟦🟦`
}
function jugadaBotC4(t) {
  const libres = [...Array(COLS).keys()].filter(c => !t[0][c])
  const prueba = (c, ficha) => { const tt = t.map(r => [...r]); caer(tt, c, ficha); return gana4(tt, ficha) }
  for (const c of libres) if (prueba(c, 'A')) return c            // gana si puede
  for (const c of libres) if (prueba(c, 'R')) return c            // bloquea
  const seguras = libres.filter(c => {                            // no le regala la victoria
    const tt = t.map(r => [...r]); caer(tt, c, 'A')
    return ![...Array(COLS).keys()].some(c2 => { if (tt[0][c2]) return false; const t3 = tt.map(r => [...r]); caer(t3, c2, 'R'); return gana4(t3, 'R') })
  })
  const op = seguras.length ? seguras : libres
  const pesos = op.map(c => ({ c, peso: 8 - Math.abs(3 - c) * 2 }))
  let r = Math.random() * pesos.reduce((s, x) => s + x.peso, 0)
  for (const x of pesos) if ((r -= x.peso) <= 0) return x.c
  return op[0]
}

// Turnos comunes de tres en raya y conecta 4
async function mostrarTablero(p, extra = '') {
  const turnoDe = p.jugadores[p.turno]
  const fichas = p.tipo === 'ttt' ? ['❌', '⭕'] : ['🔴', '🟡']
  const titulo = p.tipo === 'ttt' ? '❌⭕ *T R E S   E N   R A Y A*' : '🔴🟡 *C O N E C T A   4*'
  await decir(p, `${titulo}\n${fichas[0]} ${tag(p.jugadores[0])}  vs  ${fichas[1]} ${tag(p.jugadores[1])}\n\n${p.tipo === 'ttt' ? tableroTTT(p.tablero) : tableroC4(p.tablero)}\n${extra}\n👉 Turno de ${fichas[p.turno]} ${tag(turnoDe)}${turnoDe === BOT ? '' : `\n✍️ Escribe un número (1-${p.tipo === 'ttt' ? 9 : 7})`}`, p.jugadores)
  reiniciarInactividad(p)
}

function reiniciarInactividad(p) {
  clearTimeout(p.timer)
  p.timer = setTimeout(() => {
    if (partidas.get(p.from) !== p) return
    const ausente = p.jugadores[p.turno], otro = p.jugadores[1 - p.turno]
    terminar(p.from)
    if (otro !== BOT) { premiar(p, otro, 20) }
    decir(p, `⌛ ${tag(ausente)} tardó demasiado. ${otro === BOT ? 'Partida cancelada.' : `¡${tag(otro)} gana por abandono!`}`, [ausente, otro])
  }, 120000)
}

async function jugarTablero(p, jugador, n) {
  const yo = p.turno
  let fin = null, linea = null
  if (p.tipo === 'ttt') {
    const i = n - 1
    if (i < 0 || i > 8 || p.tablero[i]) return 'ocupada'
    p.tablero[i] = yo === 0 ? 'X' : 'O'
    linea = ganaTTT(p.tablero)
    if (linea) fin = 'gana'; else if (p.tablero.every(Boolean)) fin = 'empate'
  } else {
    const c = n - 1
    if (c < 0 || c >= COLS || p.tablero[0][c]) return 'ocupada'
    const ficha = yo === 0 ? 'R' : 'A'
    caer(p.tablero, c, ficha)
    linea = gana4(p.tablero, ficha)
    if (linea) fin = 'gana'; else if (p.tablero[0].every(Boolean)) fin = 'empate'
  }
  if (fin) {
    terminar(p.from)
    const dibujo = p.tipo === 'ttt' ? tableroTTT(p.tablero, linea) : tableroC4(p.tablero, linea)
    if (fin === 'empate') {
      devolver(p)
      await decir(p, `${dibujo}\n\n🤝 *¡EMPATE!* Nadie gana esta vez.${p.pagaron?.length ? '\n💰 Apuestas devueltas.' : ''}`, p.jugadores)
    } else {
      const g = p.jugadores[yo], per = p.jugadores[1 - yo]
      const bolsa = premiar(p, g, 40)
      await decir(p, `${dibujo}\n\n🎆🎆🎆🎆🎆🎆🎆🎆\n🏆 *¡${g === BOT ? 'GANÓ EL BOT' : 'VICTORIA'}!* 🏆\n🎆🎆🎆🎆🎆🎆🎆🎆\n\n👑 ${tag(g)} le ganó a ${tag(per)}${bolsa ? `\n💰 Se lleva *₹${bolsa}*` : ''}${g !== BOT ? '\n📚 +40 XP' : '\n😏 _¿Revancha?_'}`, p.jugadores)
    }
    return 'fin'
  }
  p.turno = 1 - p.turno
  if (p.jugadores[p.turno] === BOT) {
    await dormir(1200)
    if (p.terminada) return 'fin'
    const jb = p.tipo === 'ttt' ? jugadaBotTTT(p.tablero) + 1 : jugadaBotC4(p.tablero) + 1
    return jugarTablero(p, BOT, jb)
  }
  await mostrarTablero(p)
  return 'ok'
}

// ═══════════════════════════ 🏇 CARRERA ═══════════════════════════

const CORREDORES = [
  { e: '🐎', n: 'Relámpago', estilo: 'rapido' },
  { e: '🐆', n: 'Turbo', estilo: 'explosivo' },
  { e: '🐢', n: 'Don Lento', estilo: 'constante' },
  { e: '🐇', n: 'Saltarín', estilo: 'loco' },
  { e: '🦖', n: 'Rex', estilo: 'rapido' }
]
const META = 14
const PAGO_CARRERA = 4

const textoLobbyCarrera = (p) => `
╔═══════════════════════╗
   🏁  *G R A N   C A R R E R A*  🏁
╚═══════════════════════╝

${CORREDORES.map((c, i) => `   *${i + 1}.* ${c.e} ${c.n}`).join('\n')}

🎟️ *Apuestas (${p.apuestas.length}):*
${p.apuestas.map(a => `   ${CORREDORES[a.c].e} ${tag(a.j)} → ₹${a.m}`).join('\n') || '   _nadie apostó todavía_'}

✍️ *${p.prefixo}apostar <número> <monto>*
   Ej: *${p.prefixo}apostar 3 10*  (o monto 0 para jugar gratis)
💰 El ganador paga *x${PAGO_CARRERA}*
⏳ La carrera empieza en 40 segundos`

function pista(pos) {
  return CORREDORES.map((c, i) => {
    const x = Math.min(META, pos[i])
    return `${i + 1}|${'.'.repeat(x)}${c.e}${'.'.repeat(META - x)}|🏁`
  }).join('\n')
}

async function correr(p) {
  p.fase = 'corriendo'
  const pos = CORREDORES.map(() => 0)
  const llegada = []
  let lider = -1
  const m = await decir(p, `🏁 *¡ARRANCAN!* 🏁\n\n\`\`\`\n${pista(pos)}\n\`\`\`\n📣 _¡Y se abren las puertas!_`, p.apuestas.map(a => a.j))
  for (let vuelta = 1; vuelta < 40 && llegada.length < 3; vuelta++) {
    await dormir(1500)
    if (p.terminada) return
    const comentarios = []
    const orden = CORREDORES.map((_, i) => i).sort(() => Math.random() - 0.5)   // sin ventaja por el orden
    orden.forEach((i) => {
      const c = CORREDORES[i]
      if (pos[i] >= META) return
      let paso
      switch (c.estilo) {
        case 'constante': paso = entre(1, 2); break
        case 'explosivo': paso = Math.random() < 0.25 ? 4 : entre(0, 2); break
        case 'loco': paso = Math.random() < 0.15 ? 0 : entre(0, 3); break
        default: paso = entre(0, 3)
      }
      if (c.estilo === 'explosivo' && paso === 4) comentarios.push(`🔥 ¡${c.n} mete el turbo!`)
      if (c.estilo === 'loco' && paso === 0) comentarios.push(`😵 ¡${c.n} se distrajo con una zanahoria!`)
      pos[i] += paso
      if (pos[i] >= META) { pos[i] = META; llegada.push(i) }
    })
    const nuevo = pos.indexOf(Math.max(...pos))
    if (nuevo !== lider && vuelta > 1) comentarios.push(`📣 ¡${CORREDORES[nuevo].e} ${CORREDORES[nuevo].n} toma la delantera!`)
    lider = nuevo
    await editar(p, m?.key, `🏁 *GRAN CARRERA — Vuelta ${vuelta}* 🏁\n\n\`\`\`\n${pista(pos)}\n\`\`\`\n${(comentarios.length ? comentarios.slice(0, 2) : [azar(['📣 _¡Qué carrera tan pareja!_', '📣 _¡El público está de pie!_', '📣 _¡Van codo a codo!_', '📣 _¡Polvo por todas partes!_'])]).join('\n')}`, p.apuestas.map(a => a.j))
  }
  while (llegada.length < 3) { const resto = pos.map((v, i) => [v, i]).filter(([, i]) => !llegada.includes(i)).sort((a, b) => b[0] - a[0]); llegada.push(resto[0][1]) }
  terminar(p.from)
  const g = llegada[0]
  const ganadores = p.apuestas.filter(a => a.c === g)
  for (const a of ganadores) { if (a.m) p.addkoin(a.j, a.m * PAGO_CARRERA); try { p.addXp(a.j, 30) } catch (e) {} }
  await decir(p, `
╔═══════════════════════╗
     🏆  *¡FOTO FINISH!*  🏆
╚═══════════════════════╝

                  ${CORREDORES[llegada[0]].e}
               🥇┏━━━┓
         ${CORREDORES[llegada[1]].e}  ┃      ┃  ${CORREDORES[llegada[2]].e}
      🥈┏━┛      ┗━┓🥉
         ┃                    ┃

🥇 ${CORREDORES[llegada[0]].n}  ·  🥈 ${CORREDORES[llegada[1]].n}  ·  🥉 ${CORREDORES[llegada[2]].n}

${ganadores.length ? `💰 *Ganadores:*\n${ganadores.map(a => `   🎉 ${tag(a.j)} ${a.m ? `+₹${a.m * PAGO_CARRERA}` : '(gratis)'}`).join('\n')}` : '😭 Nadie apostó por el ganador'}`, p.apuestas.map(a => a.j))
}

// ═══════════════════════════ ⚔️ BATALLA ═══════════════════════════

const ATAQUES = [
  { t: '👊 lanza un puñetazo', min: 8, max: 14 },
  { t: '🦶 da una patada voladora', min: 10, max: 18 },
  { t: '⚡ invoca un rayo', min: 14, max: 24, falla: 0.35 },
  { t: '🔥 lanza una bola de fuego', min: 12, max: 20, falla: 0.2 },
  { t: '🗡️ ataca con su espada', min: 11, max: 17 },
  { t: '🍌 tira una cáscara de plátano', min: 4, max: 9 },
  { t: '🌀 hace un combo giratorio', min: 15, max: 26, falla: 0.4 }
]
function vida(hp) {
  const n = Math.max(0, Math.ceil(hp / 10))
  const color = hp > 60 ? '🟩' : hp > 30 ? '🟨' : '🟥'
  return color.repeat(n) + '⬛'.repeat(10 - n)
}

async function batalla(p) {
  p.fase = 'peleando'
  const [A, B] = p.jugadores
  const hp = { [A]: 100, [B]: 100 }
  const cab = () => `⚔️ *B A T A L L A   É P I C A* ⚔️\n\n🟥 ${tag(A)}\n${vida(hp[A])} ${Math.max(0, hp[A])}\n\n🟦 ${tag(B)}\n${vida(hp[B])} ${Math.max(0, hp[B])}`
  const m = await decir(p, `${cab()}\n\n🔔 *¡DING DING! ¡Que empiece la pelea!*`, p.jugadores)
  let turno = Math.random() < 0.5 ? 0 : 1
  const log = []
  for (let r = 0; r < 30 && hp[A] > 0 && hp[B] > 0; r++) {
    await dormir(1700)
    if (p.terminada) return
    const at = p.jugadores[turno], de = p.jugadores[1 - turno]
    const a = azar(ATAQUES)
    let linea
    if (Math.random() < 0.1) linea = `💨 ${tag(de)} *esquivó* el ataque de ${tag(at)}`
    else if (a.falla && Math.random() < a.falla) linea = `😅 ${tag(at)} ${a.t}… ¡y falla!`
    else {
      let d = entre(a.min, a.max)
      const crit = Math.random() < 0.12
      if (crit) d *= 2
      hp[de] -= d
      linea = `${tag(at)} ${a.t} ➜ *-${d}*${crit ? ' 💥 *¡CRÍTICO!*' : ''}`
    }
    if (Math.random() < 0.06 && hp[at] < 60) { hp[at] = Math.min(100, hp[at] + 15); linea += `\n🍗 ${tag(at)} se come un pollo y recupera *+15*` }
    log.push(linea)
    await editar(p, m?.key, `${cab()}\n\n📜 *Ronda ${r + 1}*\n${log.slice(-3).join('\n')}`, p.jugadores)
    turno = 1 - turno
  }
  terminar(p.from)
  const g = hp[A] > hp[B] ? A : B, per = g === A ? B : A
  const bolsa = premiar(p, g, 45)
  await decir(p, `
╔═══════════════════════╗
      💥  *K . O .*  💥
╚═══════════════════════╝

          🏆
        \\😎/
          |       😵
         / \\    _/‾‾\\_

👑 ${tag(g)} gana con ${Math.max(0, hp[g])} de vida
😵 ${tag(per)} quedó fuera de combate
${bolsa ? `💰 Se lleva *₹${bolsa}*` : ''}${g !== BOT ? '\n📚 +45 XP' : ''}`, p.jugadores)
}

// ═══════════════════════════ 🎁 COFRE ═══════════════════════════

const RAREZAS = [
  { n: 'COMÚN', e: '🟫', peso: 55, min: 1, max: 4, arte: '📦' },
  { n: 'RARO', e: '🟦', peso: 28, min: 5, max: 10, arte: '💎' },
  { n: 'ÉPICO', e: '🟪', peso: 12, min: 12, max: 25, arte: '🔮' },
  { n: 'LEGENDARIO', e: '🟨', peso: 4.5, min: 30, max: 60, arte: '👑' },
  { n: 'MÍTICO', e: '🌈', peso: 0.5, min: 100, max: 150, arte: '🐉' }
]

// ═══════════════════════════ MENÚ ═══════════════════════════

function menuFiesta(p) {
  return `
╔═══════════════════════╗
   🎮  *Z O N A   D E   J U E G O S*  🎮
╚═══════════════════════╝
_Juegos para todos. Reta a tus amigos y apuesta tus Rupias_ 💰

╭─〔 ⚔️ *1 VS 1* 〕
┃ 🤠 *${p}duelo @alguien [apuesta]*
┃    _Duelo del oeste: el más rápido en escribir BANG gana_
┃ ❌ *${p}ttt [@alguien] [apuesta]*
┃    _Tres en raya. Sin mencionar a nadie, juegas contra el bot_
┃ 🔴 *${p}conecta4 [@alguien] [apuesta]*
┃    _Mete 4 fichas en línea antes que tu rival_
┃ 🥊 *${p}pelear [@alguien] [apuesta]*
┃    _Batalla animada con barras de vida_
╰──────────────⬣
╭─〔 👥 *TODO EL GRUPO* 〕
┃ 💣 *${p}bomba [entrada]*
┃    _Papa caliente: pásala antes de que explote_
┃ 🏇 *${p}carrera*
┃    _Apuesta por un corredor y mira la carrera en vivo_
╰──────────────⬣
╭─〔 💰 *SUERTE* 〕
┃ 🎁 *${p}cofre*
┃    _Cofre misterioso cada 3 horas (puede salir MÍTICO)_
┃ 🥷 *${p}robar @alguien*
┃    _Intenta robarle Rupias… si te atrapan, pagas multa_
╰──────────────⬣
╭─〔 🛠️ *DURANTE EL JUEGO* 〕
┃ ✍️ *acepto* — aceptar un reto
┃ 🏳️ *${p}rendirse* — rendirse en un tablero
┃ ❌ *${p}cancelar* — cancelar (jugadores o admins)
╰──────────────⬣`
}

// ═══════════════════════════ COMANDOS ═══════════════════════════

const COMANDOS = ['menufiesta', 'zonajuegos', 'duelo', 'bomba', 'papacaliente', 'empezar', 'ttt', 'tresenraya', 'gato',
  'conecta4', 'c4', 'carrera', 'apostar', 'pelear', 'batalla', 'robar', 'cofre', 'aceptar', 'unirse', 'pasar',
  'cancelar', 'rendirse']

async function manejar(ctx) {
  const { comando, args, from, sender, prefixo: pre, enviar, isReg, respuesta, isGroup, isGroupAdmins, isOwner } = ctx
  if (!COMANDOS.includes(comando)) return false

  if (['menufiesta', 'zonajuegos'].includes(comando)) {
    await ctx.Naufra.sendMessage(from, { text: menuFiesta(pre).trim(), mentions: [sender] }, { quoted: ctx.info })
    return true
  }

  // Acciones que también se pueden escribir sin prefijo
  if (['aceptar', 'unirse', 'pasar'].includes(comando)) {
    const texto = { aceptar: 'acepto', unirse: 'yo', pasar: 'pasar' }[comando]
    await escuchar({ ...ctx, budy: texto }, true)
    return true
  }

  const actual = partidas.get(from)

  if (comando === 'cancelar') {
    if (!actual) { enviar('🤷 No hay ningún juego activo en este chat.'); return true }
    const participa = [actual.retador, actual.retado, ...(actual.jugadores || []), ...((actual.apuestas || []).map(a => a.j))].some(j => soyYo(ctx, j))
    if (!participa && !isGroupAdmins && !isOwner) { enviar('⛔ Solo los jugadores o un admin pueden cancelar el juego.'); return true }
    devolver(actual)
    if (actual.tipo === 'carrera') for (const a of actual.apuestas) if (a.m) actual.addkoin(a.j, a.m)
    terminar(from)
    enviar('🛑 Juego cancelado. Se devolvieron las apuestas.')
    return true
  }

  if (comando === 'rendirse') {
    if (!actual || !['ttt', 'c4'].includes(actual.tipo) || actual.fase !== 'jugando') { enviar('🤷 No estás en un tablero.'); return true }
    const idx = actual.jugadores.findIndex(j => soyYo(ctx, j))
    if (idx < 0) { enviar('🙃 No estás jugando esta partida.'); return true }
    const ganador = actual.jugadores[1 - idx]
    terminar(from)
    const bolsa = premiar(actual, ganador, 20)
    await decir(actual, `🏳️ ${tag(actual.jugadores[idx])} se rindió.\n👑 Gana ${tag(ganador)}${bolsa ? ` y se lleva *₹${bolsa}*` : ''}`, actual.jugadores)
    return true
  }

  if (comando === 'empezar') {
    if (!actual || actual.tipo !== 'bomba' || actual.fase !== 'lobby') { enviar('🤷 No hay una bomba esperando jugadores.'); return true }
    if (!soyYo(ctx, actual.retador) && !isGroupAdmins) { enviar('⛔ Solo quien creó la partida puede empezarla.'); return true }
    if (actual.jugadores.length < 2) { enviar('👥 Se necesitan al menos 2 jugadores.'); return true }
    clearTimeout(actual.timer)
    await iniciarBomba(actual, ctx)
    return true
  }

  if (comando === 'apostar') {
    if (!actual || actual.tipo !== 'carrera' || actual.fase !== 'apuestas') { enviar(`🏇 No hay carrera abierta. Empieza una con *${pre}carrera*`); return true }
    const c = Number(args[0]) - 1, m = Math.floor(Number(args[1] || 0))
    if (!(c >= 0 && c < CORREDORES.length) || !(m >= 0)) { enviar(`✍️ Uso: *${pre}apostar <1-${CORREDORES.length}> <monto>*\nEj: *${pre}apostar 2 10*`); return true }
    if (actual.apuestas.some(a => soyYo(ctx, a.j))) { enviar('🎟️ Ya apostaste en esta carrera.'); return true }
    if (m > 0) {
      const d = dinero(ctx, sender)
      if (d === null) { enviar(respuesta.registro); return true }
      if (d < m) { enviar(`💸 No te alcanza. Tienes ₹${d}.`); return true }
      ctx.delkoin(sender, m)
    }
    actual.apuestas.push({ j: sender, c, m })
    await editar(actual, actual.msg?.key, textoLobbyCarrera(actual), actual.apuestas.map(a => a.j))
    await ctx.Naufra.sendMessage(from, { react: { text: CORREDORES[c].e, key: ctx.info.key } }).catch(() => {})
    return true
  }

  // A partir de aquí: comandos que crean un juego
  if (actual && !['robar', 'cofre'].includes(comando)) {
    enviar(`⏳ Ya hay un juego en curso en este chat. Termínenlo o usen *${pre}cancelar*.`)
    return true
  }

  switch (comando) {
    case 'cofre': {
      if (!isReg) { enviar(respuesta.registro); return true }
      const u = db.obtener(sender)
      const f = falta(u, 'cofre', 3 * 60 * 60 * 1000)
      if (f) { enviar(`🎁 Tu próximo cofre estará listo en *${tiempo(f)}*`); return true }
      marcar(u, 'cofre'); u.cofres++; db.guardar()
      const r = (() => { let x = Math.random() * 100; for (const k of RAREZAS) { if ((x -= k.peso) <= 0) return k } return RAREZAS[0] })()
      const premio = entre(r.min, r.max)
      const p = { from, Naufra: ctx.Naufra }
      const m = await decir(p, `🎁 *COFRE MISTERIOSO*\n\n              📦\n\n_Lo agarras con las dos manos…_`, [sender])
      const frames = [
        `🎁 *COFRE MISTERIOSO*\n\n            〰️📦〰️\n\n_Se está moviendo…_`,
        `🎁 *COFRE MISTERIOSO*\n\n          💫〰️📦〰️💫\n\n_¡Brilla! ✨_`,
        `🎁 *COFRE MISTERIOSO*\n\n        ✨💫〰️📦〰️💫✨\n\n_¡SE ESTÁ ABRIENDO!_`
      ]
      for (const fr of frames) { await dormir(1100); await editar(p, m?.key, fr, [sender]) }
      await dormir(1200)
      ctx.addkoin(sender, premio)
      try { ctx.addXp(sender, r.n === 'MÍTICO' ? 200 : r.n === 'LEGENDARIO' ? 100 : 20) } catch (e) {}
      await editar(p, m?.key, `
${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}
      ✨ *¡COFRE ${r.n}!* ✨
${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}${r.e}

                 ${r.arte}

🎉 ${tag(sender)} ganó *₹${premio} Rupias*
${['LEGENDARIO', 'MÍTICO'].includes(r.n) ? '🔥🔥 ¡¡QUÉ SUERTE!! 🔥🔥\n' : ''}⏳ Próximo cofre en 3 horas`, [sender])
      if (['LEGENDARIO', 'MÍTICO'].includes(r.n)) await decir(p, `📢 *¡ATENCIÓN GRUPO!* ${tag(sender)} acaba de abrir un cofre *${r.n}* ${r.arte} y ganó ₹${premio} 🎉`, [sender])
      return true
    }

    case 'robar': {
      if (!isGroup) { enviar('👥 Solo funciona en grupos.'); return true }
      if (!isReg) { enviar(respuesta.registro); return true }
      const victima = mencionado(ctx)
      if (!victima || soyYo(ctx, victima)) { enviar(`🥷 Menciona a quién quieres robar: *${pre}robar @alguien*`); return true }
      const dv = dinero(ctx, victima)
      if (dv === null) { enviar('🙅 Esa persona no está registrada.'); return true }
      const u = db.obtener(sender), uv = db.obtener(victima)
      const f = falta(u, 'robar', 30 * 60 * 1000)
      if (f) { enviar(`🚔 La policía te está vigilando. Espera *${tiempo(f)}*`); return true }
      if (uv.protegidoHasta > Date.now()) { enviar(`🛡️ ${tag(victima)} ya fue robado hace poco y tiene seguridad reforzada. Espera *${tiempo(uv.protegidoHasta - Date.now())}*`, { mentions: [victima] }); return true }
      if (dv < 10) { enviar(`🪹 ${tag(victima)} está pobre (₹${dv}). Ni vale la pena…`, { mentions: [victima] }); return true }
      marcar(u, 'robar'); db.guardar()
      const p = { from, Naufra: ctx.Naufra }
      const m = await decir(p, `🌙 *OPERACIÓN NOCTURNA*\n\n🥷 ${tag(sender)} se acerca a la casa de ${tag(victima)}…\n\n🏠      🥷`, [sender, victima])
      const pasos = [
        `🌙 *OPERACIÓN NOCTURNA*\n\n🔦 Desactivando las cámaras…\n\n🏠  🥷📹`,
        `🌙 *OPERACIÓN NOCTURNA*\n\n🔐 Forzando la caja fuerte…\n\n🏠🥷🔐`,
        `🌙 *OPERACIÓN NOCTURNA*\n\n😰 ¿Se escucharon pasos…?\n\n🏠🥷💦`
      ]
      for (const s of pasos) { await dormir(1300); await editar(p, m?.key, s, [sender, victima]) }
      await dormir(1300)
      if (Math.random() < 0.45) {
        const robo = Math.max(1, Math.min(50, Math.floor(dv * entre(10, 25) / 100)))
        ctx.delkoin(victima, robo); ctx.addkoin(sender, robo)
        uv.protegidoHasta = Date.now() + 60 * 60 * 1000; u.robos++; db.guardar()
        await editar(p, m?.key, `💰💰💰💰💰💰💰💰\n   🥷 *¡ROBO EXITOSO!* 🥷\n💰💰💰💰💰💰💰💰\n\n${tag(sender)} escapó por la ventana con *₹${robo}* de ${tag(victima)} 🏃💨\n\n🛡️ ${tag(victima)} queda protegido 1 hora`, [sender, victima])
      } else {
        const dl = dinero(ctx, sender) || 0
        const multa = Math.min(dl, entre(5, 15))
        if (multa) { ctx.delkoin(sender, multa); ctx.addkoin(victima, multa) }
        await editar(p, m?.key, `🚨🚓🚨🚓🚨🚓🚨🚓\n   👮 *¡TE ATRAPARON!* 👮\n🚨🚓🚨🚓🚨🚓🚨🚓\n\n🔒 ${tag(sender)} quedó atrapado en la caja fuerte\n${multa ? `💸 Paga una multa de *₹${multa}* a ${tag(victima)}` : '💸 No tenía ni para la multa 😂'}`, [sender, victima])
      }
      return true
    }

    case 'duelo': case 'pelear': case 'batalla': case 'ttt': case 'tresenraya': case 'gato': case 'conecta4': case 'c4': {
      const tipo = comando === 'duelo' ? 'duelo' : ['pelear', 'batalla'].includes(comando) ? 'pelea' : ['ttt', 'tresenraya', 'gato'].includes(comando) ? 'ttt' : 'c4'
      const rival = mencionado(ctx)
      const apuesta = Math.max(0, Math.floor(Number(args.find(a => /^\d+$/.test(a)) || 0)))
      if (tipo === 'duelo' && !rival) { enviar(`🤠 Menciona a tu rival: *${pre}duelo @alguien 10*`); return true }
      if (rival && soyYo(ctx, rival)) { enviar('🪞 No puedes jugar contra ti mismo.'); return true }
      if (rival && !isGroup) { enviar('👥 Los retos entre personas son en grupos.'); return true }

      // Contra el bot (sin apuesta)
      if (!rival) {
        const p = nuevaPartida(ctx, { tipo, jugadores: [sender, BOT], turno: 0, fase: 'jugando', vsBot: true })
        if (tipo === 'pelea') { await batalla(p); return true }
        p.tablero = tipo === 'ttt' ? Array(9).fill(null) : Array.from({ length: FILAS }, () => Array(COLS).fill(null))
        await mostrarTablero(p, '🤖 _Juegas contra el bot. ¡Suerte!_')
        return true
      }

      if (apuesta) {
        const d = dinero(ctx, sender)
        if (d === null) { enviar(respuesta.registro); return true }
        if (d < apuesta) { enviar(`💸 No tienes ₹${apuesta}. Tienes ₹${d}.`); return true }
      }
      const p = nuevaPartida(ctx, { tipo, retador: sender, retado: rival, apuesta, fase: 'invitacion' })
      const nombres = { duelo: ['DUELO DEL OESTE', '🤠'], pelea: ['BATALLA ÉPICA', '🥊'], ttt: ['TRES EN RAYA', '❌'], c4: ['CONECTA 4', '🔴'] }
      await decir(p, invitacion(p, ...nombres[tipo]), [sender, rival])
      plazoInvitacion(p)
      return true
    }

    case 'bomba': case 'papacaliente': {
      if (!isGroup) { enviar('👥 La bomba se juega en grupos.'); return true }
      const apuesta = Math.max(0, Math.floor(Number(args[0] || 0)))
      if (apuesta) {
        const d = dinero(ctx, sender)
        if (d === null) { enviar(respuesta.registro); return true }
        if (d < apuesta) { enviar(`💸 No tienes ₹${apuesta}.`); return true }
      }
      const p = nuevaPartida(ctx, { tipo: 'bomba', retador: sender, apuesta, jugadores: [sender], fase: 'lobby' })
      p.msg = await decir(p, textoLobbyBomba(p), p.jugadores)
      p.timer = setTimeout(() => {
        if (partidas.get(from) !== p || p.fase !== 'lobby') return
        if (p.jugadores.length < 2) { terminar(from); decir(p, '💣 Nadie más se unió… la bomba se desactivó. 😴'); return }
        iniciarBomba(p, ctx)
      }, 30000)
      return true
    }

    case 'carrera': {
      if (!isGroup) { enviar('👥 La carrera se juega en grupos.'); return true }
      const p = nuevaPartida(ctx, { tipo: 'carrera', apuestas: [], fase: 'apuestas' })
      p.msg = await decir(p, textoLobbyCarrera(p), [])
      p.timer = setTimeout(async () => {
        if (partidas.get(from) !== p) return
        if (!p.apuestas.length) { terminar(from); decir(p, '🏇 Nadie apostó… los corredores se fueron a dormir 😴'); return }
        await decir(p, '🔔 *¡Apuestas cerradas!* Los corredores se colocan en la línea de salida…', [])
        await dormir(2000)
        correr(p)
      }, 40000)
      return true
    }
  }
  return true
}

async function iniciarBomba(p, ctx) {
  const err = cobrar(ctx, p, p.jugadores, p.apuesta)
  if (err) { terminar(p.from); await decir(p, `💣 No se pudo empezar: ${err}`, p.jugadores); return }
  await decir(p, `🔥 *¡La mecha está encendida!* ${p.bolsa ? `\n💰 Bolsa total: *₹${p.bolsa}*` : ''}`, p.jugadores)
  await dormir(1500)
  rondaBomba(p, ctx)
}

// ═════════════════ MENSAJES SIN PREFIJO (jugadas) ═════════════════

async function escuchar(ctx, desdeComando = false) {
  const { from, sender } = ctx
  const p = partidas.get(from)
  if (!p || p.terminada) return false
  // Antes se ignoraban TODOS los mensajes del número del bot, y si el dueño jugaba
  // desde ese teléfono, sus números del tablero nunca contaban. Ahora solo se
  // ignoran los mensajes que mandó el propio juego.
  if (!desdeComando && enviados.has(ctx.info?.key?.id)) return false
  const m = ctx.info?.message || {}
  const crudo = ctx.budy || m.conversation || m.extendedTextMessage?.text ||
    m.ephemeralMessage?.message?.conversation || m.ephemeralMessage?.message?.extendedTextMessage?.text || ''
  // Quita espacios, puntos y el "emoji teclado" (5️⃣ → 5)
  const texto = normal(crudo).replace(/\ufe0f|\u20e3/g, '').replace(/[.!¡]+$/g, '').trim()
  if (!texto) return false
  const primera = texto.split(/\s+/)[0]

  // ── Aceptar un reto ──
  if (p.fase === 'invitacion') {
    if (!['acepto', 'aceptar', 'acepta', 'si', 'dale', 'va'].includes(primera)) return false
    if (!soyYo(ctx, p.retado)) return false
    p.retado = sender                                     // nos quedamos con el id con el que escribe
    const err = cobrar(ctx, p, [p.retador, p.retado], p.apuesta)
    if (err) { terminar(from); await decir(p, `❌ No se puede jugar: ${err}`, [p.retador, p.retado]); return true }
    clearTimeout(p.timer)
    if (p.tipo === 'duelo') { empezarDuelo(p); return true }
    p.jugadores = Math.random() < 0.5 ? [p.retador, p.retado] : [p.retado, p.retador]
    if (p.tipo === 'pelea') { batalla(p); return true }
    p.tablero = p.tipo === 'ttt' ? Array(9).fill(null) : Array.from({ length: FILAS }, () => Array(COLS).fill(null))
    p.turno = 0; p.fase = 'jugando'
    await mostrarTablero(p, `🎲 _Se sorteó quién empieza…_${p.bolsa ? `\n💰 Bolsa: ₹${p.bolsa}` : ''}`)
    return true
  }

  // ── Duelo ──
  if (p.tipo === 'duelo' && ['espera', 'disparo'].includes(p.fase)) {
    if (!['bang', 'pum', 'pium', 'bam'].some(w => primera.startsWith(w))) return false
    const yo = soyYo(ctx, p.retador) ? p.retador : soyYo(ctx, p.retado) ? p.retado : null
    if (!yo) return false
    const otro = yo === p.retador ? p.retado : p.retador
    if (p.fase === 'espera') {
      p.fase = 'fin'
      await finDuelo(p, otro, yo, `\n🦶💥 ${tag(yo)} disparó antes de tiempo… ¡y se dio en el pie!`)
    } else {
      p.fase = 'fin'
      const t = ((Date.now() - p.senal) / 1000).toFixed(3)
      await finDuelo(p, yo, otro, `\n⚡ Tiempo de reacción: *${t} s*`)
    }
    return true
  }

  // ── Bomba ──
  if (p.tipo === 'bomba') {
    if (p.fase === 'lobby' && ['yo', 'entro', 'me uno', 'yo!'].includes(texto)) {
      if (p.jugadores.some(j => soyYo(ctx, j))) return true
      if (p.jugadores.length >= 12) return true
      if (p.apuesta) { const d = dinero(ctx, sender); if (d === null || d < p.apuesta) { await decir(p, `💸 ${tag(sender)}, necesitas ₹${p.apuesta} y estar registrado para entrar.`, [sender]); return true } }
      p.jugadores.push(sender)
      await editar(p, p.msg?.key, textoLobbyBomba(p), p.jugadores)
      await p.Naufra.sendMessage(from, { react: { text: '💣', key: ctx.info.key } }).catch(() => {})
      return true
    }
    if (p.fase === 'jugando' && primera === 'pasar' && soyYo(ctx, p.portador)) {
      const otros = p.vivos.filter(j => j !== p.portador)
      let dest = mencionado(ctx)
      dest = otros.find(j => base(j) === base(dest)) || azar(otros)
      p.portador = dest; p.pases++
      await decir(p, `${azar(['💣💨', '🧨➡️', '💣🤾', '🔥💣'])} ¡Pasó a ${tag(dest)}! ${azar(['¡Rápido!', '¡Quema!', 'Tic… tac…', '¡Suéltala!', '¡Corre!'])}`, [dest])
      return true
    }
    return false
  }

  // ── Tableros ──
  if (['ttt', 'c4'].includes(p.tipo) && p.fase === 'jugando') {
    if (!/^\d$/.test(texto)) return false
    const turnoDe = p.jugadores[p.turno]
    if (turnoDe === BOT || !soyYo(ctx, turnoDe)) return false
    if (p.ocupado) return true
    p.ocupado = true
    try {
      const r = await jugarTablero(p, turnoDe, Number(texto))
      if (r === 'ocupada') await decir(p, `🚫 ${p.tipo === 'ttt' ? 'Esa casilla' : 'Esa columna'} no está disponible, ${tag(turnoDe)}.`, [turnoDe])
    } finally { p.ocupado = false }
    return true
  }
  return false
}

module.exports = { manejar, escuchar, menuFiesta, partidas, BOT }
