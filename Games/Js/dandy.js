// ══════════════════════════════════════════════════════════
// 🌼 JUEGOS TEMA DANDY'S WORLD
//    Comandos: menudandy, dandy, ichor, ichordiario, elevador, maquina,
//              esconderse, correr, partida, abandonar, toons, comprartoon,
//              usartoon, investigacion, rankdandy
// ══════════════════════════════════════════════════════════
const D = require('../Data/dandy_datos.js')
const { crearDB, mandar, azar, entre, num, tiempo, falta, marcar, barra, normal } = require('./temas_utils.js')

const db = crearDB('dandy_usuarios.json', {
  ichor: 150,
  toons: ['Boxten', 'Poppy'],
  toon: 'Boxten',
  partida: null,        // { piso, corazones, maquinas, ichor, persecucion }
  mejorPiso: 0,
  pisos: 0,
  maquinasTotal: 0,
  investigacion: {},    // { 'Twisted X': 0-100 }
  esperas: {}
})

const ESPERA = { diario: 24 * 60 * 60 * 1000, maquina: 8 * 1000 }

const cab = (t) => `╭━━〔 🌼 ${t} 〕━━⬣`
const pie = `╰━━━━━━━━━━━━━━━━⬣`
const L = '┄'.repeat(22)

const datosToon = (n) => D.toons.find(t => t.nombre === n) || D.toons[0]
const buscarToon = (q) => D.toons.find(t => normal(t.nombre) === normal(q)) || D.toons.find(t => normal(t.nombre).startsWith(normal(q)))
const maquinasDelPiso = (piso) => Math.min(5, 2 + Math.floor(piso / 4))
const corazones = (n, max) => '❤️'.repeat(Math.max(0, n)) + '🖤'.repeat(Math.max(0, max - n))
const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

function elegirTwisted(piso) {
  if (piso >= 15 && Math.random() < 0.08) return D.twisteds.find(t => t.peligro === 3)
  if (piso >= 6 && Math.random() < 0.15 + piso * 0.01) return azar(D.twisteds.filter(t => t.peligro === 2))
  return azar(D.twisteds.filter(t => t.peligro === 1))
}

function estadoPartida(u) {
  const pa = u.partida, t = datosToon(u.toon)
  return `┃ 🏢 Piso: *${pa.piso}*   ${corazones(pa.corazones, t.cor)}
┃ ⚙️ Máquinas: ${pa.maquinasHechas}/${pa.maquinas} ${barra(pa.maquinasHechas, pa.maquinas, 6)}
┃ 💧 Ichor de esta partida: ${num(pa.ichor)}`
}

// Termina la partida y guarda récords
function terminar(u) {
  const pa = u.partida
  const piso = pa.piso
  if (piso > u.mejorPiso) u.mejorPiso = piso
  u.partida = null
  return piso
}

function menuDandy(p) {
  return `
╭━━━━━━━━━━━━━━━━━━━⬣
┃ 🌼 *D A N D Y ' S   W O R L D* 🌼
┃ _Gardenview Center te espera…_
╰━━━━━━━━━━━━━━━━━━━⬣
_"${azar(D.frasesDandy)}"_

╭─〔 🌼 *INFO* 〕
┃ ➢ *${p}dandy* — ¿De qué trata el juego?
┃ ➢ *${p}ichor* — Tu perfil de Toon
┃ ➢ *${p}ichordiario* — Ichor diario
┃ ➢ *${p}rankdandy* — Récords del grupo
╰──────────⬣
╭─〔 🛗 *BAJAR PISOS* 〕
┃ ➢ *${p}elevador* — Empieza / siguiente piso
┃ ➢ *${p}maquina* — Llena una máquina de Ichor
┃ ➢ *${p}esconderse* — Si te persigue un Twisted
┃ ➢ *${p}correr* — Huir corriendo
┃ ➢ *${p}partida* — Cómo vas
┃ ➢ *${p}abandonar* — Salir con lo ganado
╰──────────⬣
╭─〔 🎭 *TOONS* 〕
┃ ➢ *${p}toons* — Tienda de Dandy
┃ ➢ *${p}comprartoon <nombre>*
┃ ➢ *${p}usartoon <nombre>*
┃ ➢ *${p}investigacion* — Twisteds investigados
╰──────────⬣
╭─〔 ❓ *EXTRA* 〕
┃ ➢ *${p}trivia dandy* — Preguntas del juego
┃ ➢ *${p}canjear ichor <cantidad>* — A Rupias
╰──────────⬣
> 🌼 _Llena las máquinas… y no hagas ruido._`
}

async function manejar(ctx) {
  const { comando, q, prefixo: p, sender, pushname, enviar, addXp, respuesta, isReg } = ctx
  const comandos = ['menudandy', 'dandysworld', 'dandy', 'ichor', 'perfildandy', 'ichordiario', 'dandydaily',
    'elevador', 'piso', 'maquina', 'esconderse', 'esconder', 'correr', 'huir', 'partida', 'abandonar',
    'toons', 'tiendadandy', 'comprartoon', 'usartoon', 'investigacion', 'rankdandy', 'topdandy']
  if (!comandos.includes(comando)) return false

  const libres = ['menudandy', 'dandysworld', 'dandy']
  if (!libres.includes(comando) && !isReg) { enviar(respuesta.registro); return true }

  const u = db.obtener(sender, pushname)
  const t = datosToon(u.toon)
  const pa = u.partida

  // Si te persigue un Twisted y haces otra cosa, te alcanza
  const accionesPeligrosas = ['elevador', 'piso', 'maquina']
  if (pa && pa.persecucion && accionesPeligrosas.includes(comando)) {
    pa.corazones--
    const tw = pa.persecucion
    pa.persecucion = null
    if (pa.corazones <= 0) {
      const piso = terminar(u); db.guardar()
      enviar(`💀 *${tw}* te atrapó mientras te distraías…\n\n🏢 Llegaste al piso *${piso}*. El Ichor que juntaste ya está en tu cuenta.\nEmpieza otra vez con *${p}elevador*.`)
      return true
    }
    db.guardar()
    enviar(`💥 *${tw}* te alcanzó porque no huiste. Perdiste un corazón.\n${corazones(pa.corazones, t.cor)}\n\n_La próxima vez usa *${p}esconderse* o *${p}correr*._`)
    return true
  }

  switch (comando) {
    case 'menudandy': case 'dandysworld':
      await mandar(ctx, menuDandy(p), 'menu_dandy', [sender])
      break

    case 'dandy':
      await mandar(ctx, `
${cab("DANDY'S WORLD")}
┃ 🎮 *Juego:* ${D.info.juego}
┃ 🧱 *Plataforma:* ${D.info.plataforma}
┃ 🏭 *Estudio:* ${D.info.estudio}
┃ 🏢 *Lugar:* ${D.info.lugar}
┃ 💧 *Moneda:* ${D.info.moneda}
┃ ${L}
┃ ${D.info.resumen}
${pie}

🌼 *Dandy:* _"${azar(D.frasesDandy)}"_`, 'dandy')
      break

    case 'ichor': case 'perfildandy': {
      const inv = Object.values(u.investigacion)
      enviar(`
${cab('PERFIL DE TOON')}
┃ 👤 @${sender.split('@')[0]}
┃ 💧 *Ichor:* ${num(u.ichor)}
┃ 🎭 *Toon:* ${t.emoji} ${t.nombre}
┃    🏃 ${estrellas(t.vel)}  🤫 ${estrellas(t.sig)}
┃    ⚙️ ${estrellas(t.ext)}  ❤️ x${t.cor}
┃ ${L}
┃ 🏆 Mejor piso: *${u.mejorPiso}*
┃ 🏢 Pisos superados: ${u.pisos}
┃ ⚙️ Máquinas llenadas: ${u.maquinasTotal}
┃ 🔬 Twisteds investigados: ${inv.length} (${inv.filter(x => x >= 100).length} al 100%)
┃ 🎭 Toons: ${u.toons.length}/${D.toons.length}
┃ 🛗 Partida: ${pa ? `en curso (piso ${pa.piso})` : 'ninguna'}
${pie}`, { mentions: [sender] })
      break
    }

    case 'ichordiario': case 'dandydaily': {
      const f = falta(u, 'diario', ESPERA.diario)
      if (f) { enviar(`🌼 Dandy ya te dio tu Ichor de hoy.\nVuelve en *${tiempo(f)}*.`); break }
      const i = entre(50, 120)
      u.ichor += i; marcar(u, 'diario'); db.guardar(); addXp(sender, 40)
      enviar(`💧 *+${i} Ichor* y 📚 +40 XP\n\n🌼 _"${azar(D.frasesDandy)}"_`)
      break
    }

    case 'elevador': case 'piso': {
      if (!pa) {
        u.partida = { piso: 1, corazones: t.cor, maquinas: maquinasDelPiso(1), maquinasHechas: 0, ichor: 0, persecucion: null }
        db.guardar()
        await mandar(ctx, `
${cab('ELEVADOR')}
┃ 🛗 Las puertas se cierran…
┃ ${t.emoji} Bajas como *${t.nombre}* a Gardenview Center
┃ ${L}
${estadoPartida(u)}
${pie}
➢ Usa *${p}maquina* para llenar las máquinas de Ichor.`, 'elevador')
        break
      }
      if (pa.maquinasHechas < pa.maquinas) {
        enviar(`🔒 El elevador no se abre hasta llenar todas las máquinas.\n\n${estadoPartida(u)}\n\n➢ *${p}maquina*`)
        break
      }
      const premio = 10 + pa.piso * 2
      u.ichor += premio; pa.ichor += premio; u.pisos++
      pa.piso++
      pa.maquinas = maquinasDelPiso(pa.piso); pa.maquinasHechas = 0
      if (pa.piso > u.mejorPiso) u.mejorPiso = pa.piso
      // Cada 5 pisos, Dandy regala un corazón
      let extra = ''
      if (pa.piso % 5 === 0 && pa.corazones < t.cor) { pa.corazones++; extra = '\n┃ 🌼 Dandy te dio una venda: *+1 ❤️*' }
      db.guardar(); addXp(sender, 20 + pa.piso)
      await mandar(ctx, `
${cab(`PISO ${pa.piso}`)}
┃ 🛗 ¡Piso superado! *+${premio} Ichor* 💧${extra}
┃ ${L}
${estadoPartida(u)}
${pie}
${pa.piso >= 10 ? '⚠️ _Los Twisteds principales empiezan a rondar…_' : '➢ Sigue con *' + p + 'maquina*'}`, 'elevador')
      break
    }

    case 'maquina': {
      if (!pa) { enviar(`🛗 No estás en ninguna partida. Empieza con *${p}elevador*`); break }
      if (pa.maquinasHechas >= pa.maquinas) { enviar(`✅ Ya llenaste todas las máquinas. ¡Sube al *${p}elevador*!`); break }
      const f = falta(u, 'maquina', ESPERA.maquina)
      if (f) { enviar(`⚙️ Todavía estás trabajando en la máquina… espera ${tiempo(f)}.`); break }
      marcar(u, 'maquina')
      const exito = Math.random() < 0.55 + t.ext * 0.07
      let txt
      if (exito) {
        pa.maquinasHechas++; u.maquinasTotal++
        u.ichor += 5; pa.ichor += 5
        txt = `⚙️ *¡Skill check perfecto!* Máquina llena. +5 Ichor 💧`
        if (pa.maquinasHechas >= pa.maquinas) txt += `\n🛗 *¡El elevador está listo!* Usa *${p}elevador*`
      } else {
        txt = '⚡ *Fallaste el skill check…* hiciste ruido.'
      }
      // ¿Aparece un Twisted? (más probable si fallaste y en pisos altos)
      const prob = Math.min(0.6, 0.18 + pa.piso * 0.02 + (exito ? 0 : 0.2))
      if (Math.random() < prob) {
        const tw = elegirTwisted(pa.piso)
        pa.persecucion = tw.nombre
        txt += `\n\n👹 *¡${tw.nombre.toUpperCase()} TE VIO!* ${tw.peligro >= 2 ? '⚠️ _(Twisted principal)_' : ''}\n➢ *${p}esconderse* o *${p}correr* ¡YA!`
      }
      db.guardar()
      enviar(`${txt}\n\n${estadoPartida(u)}`)
      break
    }

    case 'esconderse': case 'esconder': case 'correr': case 'huir': {
      if (!pa || !pa.persecucion) { enviar('😌 Nadie te está persiguiendo… por ahora.'); break }
      const tw = D.twisteds.find(x => x.nombre === pa.persecucion) || { nombre: pa.persecucion, peligro: 1 }
      const esconde = comando.startsWith('escond')
      const stat = esconde ? t.sig : t.vel
      const prob = Math.max(0.15, Math.min(0.9, 0.25 + stat * 0.13 - (tw.peligro - 1) * 0.12))
      pa.persecucion = null
      if (Math.random() < prob) {
        const antes = u.investigacion[tw.nombre] || 0
        const sube = entre(10, 25)
        const ahora = Math.min(100, antes + sube)
        u.investigacion[tw.nombre] = ahora
        let extra = ''
        if (antes < 100 && ahora >= 100) { u.ichor += 100; extra = `\n🔬 *¡Investigación de ${tw.nombre} completa!* +100 Ichor 💧` }
        db.guardar(); addXp(sender, 25)
        enviar(`${esconde ? '🤫 Te escondiste en un casillero…' : '🏃 ¡Corriste por los pasillos!'}\n✅ *${tw.nombre}* te perdió de vista.\n🔬 Investigación: ${ahora}% ${barra(ahora, 100, 8)}${extra}\n\n${estadoPartida(u)}`)
        break
      }
      pa.corazones--
      if (pa.corazones <= 0) {
        const piso = terminar(u); db.guardar(); addXp(sender, 10)
        await mandar(ctx, `
${cab('FIN DE LA PARTIDA')}
┃ 💀 *${tw.nombre}* te atrapó…
┃ 🏢 Llegaste al piso *${piso}*
┃ 💧 Ichor ganado: ${num(pa.ichor)} (ya está en tu cuenta)
┃ 🏆 Tu récord: piso ${u.mejorPiso}
${pie}
➢ ¿Otra vez? *${p}elevador*`, 'twisted')
        break
      }
      db.guardar()
      enviar(`💥 *${tw.nombre}* te alcanzó ${esconde ? 'en tu escondite' : 'en la carrera'}… pero lograste escapar herido.\n${corazones(pa.corazones, t.cor)}\n\n${estadoPartida(u)}`)
      break
    }

    case 'partida':
      if (!pa) { enviar(`🛗 No tienes partida. Empieza con *${p}elevador*`); break }
      enviar(`${cab('TU PARTIDA')}\n┃ ${t.emoji} Toon: ${t.nombre}\n${estadoPartida(u)}${pa.persecucion ? `\n┃ 👹 ¡Te persigue *${pa.persecucion}*!` : ''}\n${pie}`)
      break

    case 'abandonar': {
      if (!pa) { enviar('🛗 No estás en ninguna partida.'); break }
      const piso = terminar(u); db.guardar()
      enviar(`🚪 Saliste de Gardenview en el piso *${piso}*.\n💧 Te llevas ${num(pa.ichor)} Ichor (ya en tu cuenta).`)
      break
    }

    case 'toons': case 'tiendadandy':
      await mandar(ctx, `
${cab('TIENDA DE DANDY')}
┃ 🌼 _"${azar(D.frasesDandy)}"_
┃ ${L}
${D.toons.map(x => `┃ ${u.toons.includes(x.nombre) ? '✅' : '🔒'} ${x.emoji} *${x.nombre}*${x.principal ? ' 👑' : ''} · ${x.precio ? `${num(x.precio)} 💧` : 'gratis'}\n┃    🏃${x.vel} 🤫${x.sig} ⚙️${x.ext} ❤️${x.cor}`).join('\n')}
┃ ${L}
┃ 💧 Tu Ichor: ${num(u.ichor)}
┃ ➢ *${p}comprartoon <nombre>*
${pie}
_🏃 correr · 🤫 esconderse · ⚙️ máquinas · ❤️ corazones (stats del bot)_`, 'tienda_dandy')
      break

    case 'comprartoon': {
      if (!q) { enviar(`🎭 Ejemplo: *${p}comprartoon Astro*`); break }
      const x = buscarToon(q)
      if (!x) { enviar(`❓ Ese Toon no está en la tienda. Mira *${p}toons*`); break }
      if (u.toons.includes(x.nombre)) { enviar(`✅ Ya tienes a ${x.emoji} ${x.nombre}. Úsalo con *${p}usartoon ${x.nombre}*`); break }
      if (u.ichor < x.precio) { enviar(`💧 Te falta Ichor: tienes ${num(u.ichor)} y ${x.nombre} cuesta ${num(x.precio)}.`); break }
      u.ichor -= x.precio; u.toons.push(x.nombre); db.guardar()
      enviar(`🎉 *¡Compraste a ${x.emoji} ${x.nombre}!*\n🌼 _"¡Excelente elección, amiguito!"_\n\nÚsalo con *${p}usartoon ${x.nombre}*`)
      break
    }

    case 'usartoon': {
      if (!q) { enviar(`🎭 Ejemplo: *${p}usartoon Boxten*`); break }
      if (pa) { enviar('🛗 No puedes cambiar de Toon en medio de una partida.'); break }
      const x = buscarToon(q)
      if (!x || !u.toons.includes(x.nombre)) { enviar(`🔒 No tienes ese Toon. Mira *${p}toons*`); break }
      u.toon = x.nombre; db.guardar()
      enviar(`${x.emoji} Ahora juegas como *${x.nombre}*\n🏃 ${estrellas(x.vel)}\n🤫 ${estrellas(x.sig)}\n⚙️ ${estrellas(x.ext)}\n❤️ x${x.cor}`)
      break
    }

    case 'investigacion': {
      const lista = Object.entries(u.investigacion).sort((a, b) => b[1] - a[1])
      if (!lista.length) { enviar('🔬 Aún no investigaste ningún Twisted. Sobrevive a sus persecuciones para avanzar.'); break }
      enviar(`${cab('INVESTIGACIÓN')}\n${lista.map(([n, v]) => `┃ ${v >= 100 ? '✅' : '🔬'} ${n}\n┃    ${barra(v, 100, 10)} ${v}%`).join('\n')}\n${pie}`)
      break
    }

    case 'rankdandy': case 'topdandy': {
      const top = Object.entries(db.todos())
        .map(([id, x]) => ({ id, piso: x.mejorPiso || 0, ichor: x.ichor || 0 }))
        .filter(x => x.piso > 0)
        .sort((a, b) => b.piso - a.piso || b.ichor - a.ichor).slice(0, 10)
      if (!top.length) { enviar('📭 Nadie ha bajado a Gardenview todavía.'); break }
      const med = ['🥇', '🥈', '🥉']
      enviar(`${cab('RÉCORDS DE GARDENVIEW')}\n${top.map((x, i) => `┃ ${med[i] || `${i + 1}.`} @${x.id.split('@')[0]} · 🏢 piso ${x.piso} · 💧 ${num(x.ichor)}`).join('\n')}\n${pie}`, { mentions: top.map(x => x.id) })
      break
    }
  }
  return true
}

module.exports = { manejar, db, menuDandy }
