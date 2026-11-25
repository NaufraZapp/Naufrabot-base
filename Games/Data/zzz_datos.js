// ══════════════════════════════════════════════════════════
// 🌸 DATOS DEL TEMA REMIELLE DAN / ZENLESS ZONE ZERO
//    Puedes editar nombres, probabilidades y frases desde aquí.
// ══════════════════════════════════════════════════════════

// 👤 Ficha del personaje
const ficha = {
  nombre: 'Remielle Dan',
  alias: 'Ramiel',
  rango: 'S',
  atributo: 'Lumiflux ✨ (el primer agente de este atributo)',
  especialidad: 'Anomalía',
  faccion: 'Covenant of Dayat',
  titulo: 'Cazadora del Vacío de primera generación',
  bangboo: 'Ariel',
  llegada: 'Versión 3.1 (2.º aniversario, julio 2026)',
  vozEN: 'Amber Lee Connors',
  vozJP: 'Ōnishi Saori'
}

// 💬 Frases originales con la personalidad de Remielle (coqueta, bromista y misteriosa)
const frases = [
  '¿Me buscabas? Qué casualidad… yo también estaba pensando en desaparecer un rato contigo cerca 🌸',
  'Acércate, pero no tanto. Lo divertido de un misterio es no resolverlo de golpe ✨',
  'Un siglo cazando en el Vacío y todavía me sorprende que alguien me haga reír. Tú vas bien.',
  'Mis alas no son para presumir… bueno, un poquito sí 🪽',
  'Si el Hollow se pone feo, quédate detrás de mí. Si se pone aburrido, quédate al lado.',
  '¿Promesas? Las cumplo todas. Por eso hago tan pocas 😌',
  'La luz también corta, ¿sabías? Solo que lo hace con más estilo ✨',
  'No me mires así, que me distraigo. Y cuando me distraigo, gano igual 💫',
  'Ariel dice que hablo demasiado con los Proxies. Ariel es un Bangboo, no opina 🐰',
  'Hay cosas que no cuento. No por secreto… sino porque te verías adorable intentando adivinarlas.',
  'Respira, Proxy. Lo peor de un Hollow es entrar con prisa.',
  'Si preguntas mucho por mi pasado, voy a empezar a preguntar por el tuyo. ¿Trato? 🌸'
]

// Saludos para el menú según la hora
const saludos = {
  manana: 'Buenos días, Proxy. ¿Saliste temprano a buscarme? 🌸',
  tarde: 'Buenas tardes… justo a tiempo para una misión ✨',
  noche: 'De noche los Hollows brillan distinto. Igual que yo 🌙'
}

// 🎰 GACHA (Señal) — probabilidades estilo ZZZ
const gacha = {
  costo: 160,            // Polychrome por tirada
  probS: 0.006,          // 0.6 %
  probA: 0.094,          // 9.4 %
  pityS: 90,             // S asegurado a las 90
  softPity: 74,          // desde aquí sube la probabilidad de S
  pityA: 10,             // A asegurado cada 10
  destacado: 'Remielle Dan'
}

// Agentes rango S que salen si pierdes el 50/50 (banner estándar)
const sEstandar = ['Grace', 'Rina', 'Koleda', 'Nekomata', 'Soldier 11', 'Lycaon']

// Agentes rango A
const agentesA = [
  'Anby', 'Billy', 'Nicole', 'Anton', 'Ben', 'Corin', 'Lucy',
  'Piper', 'Soukaku', 'Seth', 'Pulchra', 'Pan Yinhu'
]

// Emoji por agente (los que no estén aquí usan ⭐)
const emojiAgente = {
  'Remielle Dan': '🌸', Grace: '⚡', Rina: '🎀', Koleda: '🔨', Nekomata: '🐱',
  'Soldier 11': '🔥', Lycaon: '🐺', Anby: '⚡', Billy: '🔫', Nicole: '💼',
  Anton: '🛠️', Ben: '🐻', Corin: '🧹', Lucy: '🐗', Piper: '🚚', Soukaku: '❄️',
  Seth: '🛡️', Pulchra: '🐈‍⬛', 'Pan Yinhu': '🍜'
}

// 🐰 Bangboos que se pueden adoptar
const bangboos = [
  { nombre: 'Ariel', bono: 0.20, desc: 'El compañero de Remielle. Brilla un poquito cuando ella sonríe.' },
  { nombre: 'Eous', bono: 0.15, desc: 'El Bangboo de los Proxies. Siempre sabe dónde está la salida.' },
  { nombre: 'Amillion', bono: 0.10, desc: 'Le encanta el dinero tanto como a ti.' },
  { nombre: 'Sharkboo', bono: 0.10, desc: 'Muerde primero, pregunta después.' },
  { nombre: 'Penguinboo', bono: 0.08, desc: 'Fresco como un congelador.' },
  { nombre: 'Butler', bono: 0.08, desc: 'Educado, puntual y muy formal.' },
  { nombre: 'Bagboo', bono: 0.06, desc: 'Guarda cosas que nadie le pidió guardar.' },
  { nombre: 'Rocketboo', bono: 0.06, desc: 'Llega rápido… a veces demasiado.' },
  { nombre: 'Luckyboo', bono: 0.12, desc: 'Dicen que trae buena suerte en las tiradas.' },
  { nombre: 'Knightboo', bono: 0.10, desc: 'Un caballero diminuto con mucho valor.' }
]
const costoBangboo = 8000 // Dennies

// 🕳️ Eventos del Hollow (.hollow)
const eventosHollow = [
  { peso: 30, tipo: 'dennies', texto: 'Encontraste una caja de suministros abandonada 📦', min: 800, max: 2200 },
  { peso: 18, tipo: 'poly', texto: 'Un cristal de Polychrome brillaba entre los escombros 💎', min: 40, max: 120 },
  { peso: 15, tipo: 'pelea', texto: 'Un grupo de Etéreos te cerró el paso ⚔️', min: 1500, max: 3500 },
  { peso: 12, tipo: 'trampa', texto: 'Pisaste una zona de Corrupción Etérea ☣️ y tuviste que retirarte', min: 300, max: 900 },
  { peso: 10, tipo: 'tienda', texto: 'Te cruzaste con un comerciante en el Hollow 🛒', min: 0, max: 0 },
  { peso: 10, tipo: 'remielle', texto: 'Una luz rosada cruzó el pasillo… Remielle te abrió el camino 🪽', min: 1000, max: 2500 },
  { peso: 5, tipo: 'jackpot', texto: '¡Hallaste una caja sellada de la Asociación de Investigación de Hollows! 🎁', min: 150, max: 320 }
]

// ⚔️ Etéreos para .cazar
const etereos = [
  { nombre: 'Etéreo merodeador', poder: 30, dennies: [600, 1200], emoji: '👾' },
  { nombre: 'Etéreo acorazado', poder: 45, dennies: [900, 1700], emoji: '🛡️' },
  { nombre: 'Dullahan', poder: 60, dennies: [1400, 2400], emoji: '🗡️' },
  { nombre: 'Hati', poder: 70, dennies: [1800, 3000], emoji: '🐺' },
  { nombre: 'Tyrfing', poder: 80, dennies: [2200, 3600], emoji: '🚜' },
  { nombre: 'Dead End Butcher', poder: 95, dennies: [3000, 4800], emoji: '🔪' },
  { nombre: 'Nineveh', poder: 110, dennies: [3800, 6000], emoji: '🌺' }
]

// ❓ Trivia de ZZZ
const trivia = [
  { p: '¿Qué atributo nuevo debutó con Remielle Dan?', o: ['Lumiflux', 'Auric Ink', 'Frost', 'Ether'], r: 0 },
  { p: '¿Cuál es la especialidad de combate de Remielle?', o: ['Ataque', 'Aturdimiento', 'Anomalía', 'Defensa'], r: 2 },
  { p: '¿A qué facción pertenece Remielle Dan?', o: ['Sección 6', 'Covenant of Dayat', 'Victoria Housekeeping', 'Hermanos Belobog'], r: 1 },
  { p: '¿Cómo se llama el Bangboo de Remielle?', o: ['Eous', 'Amillion', 'Ariel', 'Butler'], r: 2 },
  { p: '¿En qué versión llegó Remielle como agente jugable?', o: ['2.0', '3.0', '3.1', '1.4'], r: 2 },
  { p: '¿Qué otra agente rango S llegó junto a Remielle en la 3.1?', o: ['Sigrid', 'Miyabi', 'Ellen', 'Jane Doe'], r: 0 },
  { p: '¿Cómo se llama la ciudad flotante del arco de Remielle?', o: ['Nueva Eridu', 'Roscaelifer', 'Gardenview', 'Sixth Street'], r: 1 },
  { p: '¿Cuál es la ciudad principal de Zenless Zone Zero?', o: ['Nueva Eridu', 'Inazuma', 'Belobog', 'Penacony'], r: 0 },
  { p: '¿Cómo se llaman los hermanos Proxy protagonistas?', o: ['Wise y Belle', 'Ben y Anby', 'Lucy y Piper', 'Seth y Zhu'], r: 0 },
  { p: '¿Cuál es el alias legendario de los Proxies?', o: ['Phaethon', 'Ramiel', 'Ariel', 'Dayat'], r: 0 },
  { p: '¿Cuál es la moneda común del juego?', o: ['Ichor', 'Dennies', 'Primogemas', 'Rupias'], r: 1 },
  { p: '¿Cuál es la moneda premium para las tiradas?', o: ['Polychrome', 'Dennies', 'Jade Estelar', 'Ichor'], r: 0 },
  { p: '¿Qué empresa desarrolla Zenless Zone Zero?', o: ['HoYoverse', 'Kuro Games', 'Nexon', 'BlushCrunch Studio'], r: 0 },
  { p: '¿Para quién trabaja Ellen Joe?', o: ['Sección 6', 'Victoria Housekeeping', 'Liebres Astutas', 'Hermanos Belobog'], r: 1 },
  { p: '¿Qué unidad lidera Hoshimi Miyabi?', o: ['Sección 6', 'Covenant of Dayat', 'Hermanos Belobog', 'Obol Squad'], r: 0 },
  { p: '¿Cómo se llama la tienda de videos de los Proxies?', o: ['Random Play', 'Box Galaxy', 'Videoclub 6', 'Hollow Store'], r: 0 },
  { p: '¿Cada cuántas tiradas está asegurado un rango S?', o: ['50', '80', '90', '100'], r: 2 },
  { p: '¿Quién pone la voz en inglés de Remielle?', o: ['Amber Lee Connors', 'Erica Lindbeck', 'Anairis Quiñones', 'Laura Stahl'], r: 0 }
]

module.exports = { ficha, frases, saludos, gacha, sEstandar, agentesA, emojiAgente, bangboos, costoBangboo, eventosHollow, etereos, trivia }
