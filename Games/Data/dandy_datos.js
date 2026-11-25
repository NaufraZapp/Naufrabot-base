// ══════════════════════════════════════════════════════════
// 🌼 DATOS DEL TEMA DANDY'S WORLD (Roblox, BlushCrunch Studio)
//    Las estadísticas y precios están ADAPTADOS para el bot
//    (no son los números exactos del juego). Edítalos a tu gusto.
// ══════════════════════════════════════════════════════════

const info = {
  juego: "Dandy's World",
  plataforma: 'Roblox',
  estudio: 'BlushCrunch Studio',
  lugar: 'Gardenview Center',
  moneda: 'Ichor',
  resumen: 'Juego de terror y supervivencia: los Toons bajan piso por piso en Gardenview Center llenando máquinas de Ichor mientras los Twisteds los persiguen.'
}

// 🎭 Toons: vel = correr, sig = esconderse, ext = reparar máquinas, cor = corazones
//    principal: true = Toon principal (más caro)
const toons = [
  { nombre: 'Boxten', precio: 0, vel: 3, sig: 3, ext: 4, cor: 3, emoji: '📦' },
  { nombre: 'Poppy', precio: 0, vel: 3, sig: 3, ext: 3, cor: 3, emoji: '🎈' },
  { nombre: 'Shrimpo', precio: 100, vel: 2, sig: 2, ext: 2, cor: 2, emoji: '🦐' },
  { nombre: 'Cosmo', precio: 150, vel: 3, sig: 3, ext: 4, cor: 3, emoji: '🍪' },
  { nombre: 'Looey', precio: 150, vel: 4, sig: 3, ext: 3, cor: 2, emoji: '🎈' },
  { nombre: 'Tisha', precio: 300, vel: 3, sig: 4, ext: 3, cor: 3, emoji: '🧽' },
  { nombre: 'Brightney', precio: 300, vel: 3, sig: 2, ext: 4, cor: 3, emoji: '💡' },
  { nombre: 'Finn', precio: 300, vel: 4, sig: 3, ext: 3, cor: 3, emoji: '🐟' },
  { nombre: 'Flutter', precio: 450, vel: 5, sig: 3, ext: 2, cor: 2, emoji: '🦋' },
  { nombre: 'Gigi', precio: 450, vel: 3, sig: 4, ext: 3, cor: 3, emoji: '🎁' },
  { nombre: 'Glisten', precio: 450, vel: 3, sig: 3, ext: 4, cor: 3, emoji: '🪞' },
  { nombre: 'Goob', precio: 600, vel: 3, sig: 3, ext: 3, cor: 4, emoji: '🤗' },
  { nombre: 'Razzle & Dazzle', precio: 600, vel: 3, sig: 4, ext: 4, cor: 3, emoji: '🎭' },
  { nombre: 'Rodger', precio: 600, vel: 3, sig: 4, ext: 4, cor: 3, emoji: '🔍' },
  { nombre: 'Teagan', precio: 750, vel: 3, sig: 3, ext: 4, cor: 4, emoji: '🫖' },
  { nombre: 'Toodles', precio: 750, vel: 5, sig: 3, ext: 3, cor: 3, emoji: '🍭' },
  { nombre: 'Vee', precio: 3000, vel: 4, sig: 4, ext: 5, cor: 3, emoji: '📺', principal: true },
  { nombre: 'Pebble', precio: 3000, vel: 5, sig: 4, ext: 3, cor: 3, emoji: '🪨', principal: true },
  { nombre: 'Shelly', precio: 3000, vel: 3, sig: 5, ext: 4, cor: 3, emoji: '🐢', principal: true },
  { nombre: 'Sprout', precio: 3000, vel: 4, sig: 4, ext: 4, cor: 4, emoji: '🍓', principal: true },
  { nombre: 'Astro', precio: 5000, vel: 4, sig: 5, ext: 5, cor: 4, emoji: '🌙', principal: true }
]

// 👹 Twisteds: versiones corruptas de los Toons. peligro 2 = Twisted principal
const twisteds = [
  ...toons.filter(t => !t.principal).map(t => ({ nombre: `Twisted ${t.nombre}`, peligro: 1 })),
  { nombre: 'Twisted Vee', peligro: 2 },
  { nombre: 'Twisted Pebble', peligro: 2 },
  { nombre: 'Twisted Shelly', peligro: 2 },
  { nombre: 'Twisted Sprout', peligro: 2 },
  { nombre: 'Twisted Astro', peligro: 2 },
  { nombre: 'Twisted Dandy', peligro: 3 }
]

// 🌼 Frases de Dandy (originales) para la tienda y el menú
const frasesDandy = [
  '¡Hola, hola, amiguito! ¿Vienes a comprar o solo a mirar mis pétalos? 🌼',
  'Todo tiene un precio en mi tienda… ¡pero hoy estoy de buen humor! 🌸',
  'Llena esas máquinas y vuelve con Ichor. Aquí te espero… siempre 🙂',
  '¿Escuchaste algo en el piso de abajo? No, no, seguro no fue nada 🌻',
  'Mis amigos Toons son lo más importante. Bueno, después del Ichor 💧'
]

// ❓ Trivia de Dandy's World
const trivia = [
  { p: "¿En qué plataforma se juega Dandy's World?", o: ['Roblox', 'Minecraft', 'Fortnite', 'Steam'], r: 0 },
  { p: "¿Qué estudio creó Dandy's World?", o: ['BlushCrunch Studio', 'HoYoverse', 'Mojang', 'Scott Games'], r: 0 },
  { p: '¿Cómo se llama el edificio donde ocurre el juego?', o: ['Gardenview Center', 'Playtime Co.', 'Freddy Fazbear Pizza', 'Nueva Eridu'], r: 0 },
  { p: '¿Cuál es la moneda principal del juego?', o: ['Robux', 'Ichor', 'Dennies', 'Tapes'], r: 1 },
  { p: '¿Cómo se llaman las versiones corruptas de los Toons?', o: ['Twisteds', 'Etéreos', 'Sombras', 'Glitches'], r: 0 },
  { p: '¿Cómo se llaman los personajes jugables?', o: ['Toons', 'Agentes', 'Bangboos', 'Mascotas'], r: 0 },
  { p: '¿Qué tienes que completar en cada piso para avanzar?', o: ['Máquinas', 'Puzzles', 'Carreras', 'Jefes'], r: 0 },
  { p: '¿Qué tipo de criatura es Dandy?', o: ['Una flor', 'Un gato', 'Un robot', 'Una nube'], r: 0 },
  { p: '¿Cuántos Trinkets puedes equipar a la vez?', o: ['1', '2', '3', '5'], r: 1 },
  { p: '¿Qué se consigue llevando la investigación de un Twisted al 100 %?', o: ['Desbloquear cosas como Trinkets', 'Robux gratis', 'Un piso extra', 'Nada'], r: 0 }
]

module.exports = { info, toons, twisteds, frasesDandy, trivia }
