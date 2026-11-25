// ══════════════════════════════════════════════
//  MENÚ PRINCIPAL DE NAUFRABOT BASE
//  Todo lo que está entre las comillas ` ` es el texto que se envía.
//  ✏️ Para AGREGAR un comando, copia estas 2 líneas y cámbialas:
//       *➢comando*
//       > ➥Lo que hace el comando
//  ✏️ Para QUITAR un comando, borra sus 2 líneas.
//  ${Bot} = nombre del bot · ${prefixo} = prefijo · ${timeFt} = saludo
// ══════════════════════════════════════════════

const Menu = ( timeFt , Bot , prefixo, sender , groupName  , groupMembers ) => {
return `
 ❱ ➢${timeFt}, @${sender.split('@')[0]}
╭══════════════════
│✦ ➮ sᴏʏ: ${Bot}
│✦ ➮ ᴘʀᴇғɪᴊᴏ ᴀᴄᴛᴜᴀʟ: *${prefixo}*
│✦ ➮ ᴠᴇʀsɪᴏ́ɴ: *7.0* 🆕
│✦ ➮ ᴘᴀɢɪɴᴀ ᴏғɪᴄɪᴀʟ:  https://naufrabot.com
│✦ ➮ ᴀᴘɪ ᴏғɪᴄɪᴀʟ:  https://api.naufrabot.com
╰━━━━━─「✪」─━━━━━

➮☆ۣۜۜ͜͡ \`📂 ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs\` ꔷ㆒⸼݇҉ֻ᠂⃟✥

  ━━━━━─「✪」─━━━━━

╭
   ❍ 𝐙𝐎𝐍𝐀 𝐃𝐄 𝐉𝐔𝐄𝐆𝐎𝐒 🆕  ❐
╰
*➢duelo @alguien*
> ➥Duelo del oeste: el más rápido gana
*➢bomba*
> ➥Papa caliente para todo el grupo
*➢carrera*
> ➥Apuesta y mira la carrera en vivo
*➢pelear @alguien*
> ➥Batalla animada con barras de vida
*➢ttt / conecta4*
> ➥Tableros contra amigos o el bot
*➢cofre*
> ➥Cofre misterioso cada 3 horas
*➢robar @alguien*
> ➥Róbale Rupias… si te atreves
*➢menujuegos*
> ➥Ver todos los juegos

╭
   ❍ 𝐆𝐀𝐂𝐇𝐀 𝐃𝐄 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐉𝐄𝐒 🆕  ❐
╰
*➢rw*
> ➥Saca un personaje al azar
*➢claim*
> ➥Reclama el último que salió
*➢harem*
> ➥Tu colección de personajes
*➢sell / wshop / buyc*
> ➥Vende y compra personajes
*➢givechar / giveall*
> ➥Regala personajes
*➢trade*
> ➥Intercambia con otro usuario
*➢votar / wtop / rankc*
> ➥Valor y rankings
*➢menugacha*
> ➥Todo el gacha explicado

╭
  ❍ 𝐌𝐄𝐍𝐔 𝐈𝐍𝐅𝐎  ❐
╰
*➢ping*
> ➥Velocidad del bot
*➢perfil*
> ➥Mira tu perfil
*➢ship*
> ➥Porcentaje de que le guste alguien
*➢botcompleto*
> ➥Cómo tener un bot completo
*➢grupos*
> ➥Grupos oficiales
*➢canales*
> ➥Canales oficiales
*➢serbot*
> ➥Cómo ser un bot
*➢personalizarbot*
> ➥Cómo editar este bot
*➢miapi*
> ➥Mira tu API key
*➢comprarapi*
> ➥Cómo adquirir una clave API
*➢infocomando*
> ➥La IA te explica qué hace cualquier comando

╭
   ❍ 𝐌𝐄𝐍𝐔 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀𝐒  ❐
╰
*➢bienvenida 1/0*
> ➥Activa/desactiva la bienvenida
*➢despedida 1/0*
> ➥Activa/desactiva la despedida
*➢setbienvenida*
> ➥Cambia el texto de bienvenida
*➢setdespedida*
> ➥Cambia el texto de despedida
*➢setfotobienvenida*
> ➥Pon tu imagen de bienvenida
*➢setfotodespedida*
> ➥Pon tu imagen de despedida
*➢probarbienvenida*
> ➥Mira cómo se ve la bienvenida
*➢probardespedida*
> ➥Mira cómo se ve la despedida
*➢resetbienvenida*
> ➥Vuelve al texto por defecto
*➢avisosadmin 1/0*
> ➥Avisa cuando alguien sube/baja de admin
*➢configbienvenida*
> ➥Mira la configuración del grupo

╭
   ❍ 𝐌𝐄𝐍𝐔 𝐀𝐃𝐌𝐈𝐍  ❐
╰
*➢antilink 1/0*
> ➥Activa/desactiva anti enlaces
*➢modoadmin 1/0*
> ➥Solo admins pueden usar el bot
*➢todos*
> ➥Menciona a todos con @
*➢anuncio*
> ➥Otra forma de mencionar a todos
*➢ban/kick*
> ➥Elimina a un participante
*➢notify*
> ➥Notificación fantasma
*➢grupo*
> ➥Abrir/cerrar grupo
*➢mute*
> ➥Silencia a alguien X tiempo
*➢desmute*
> ➥Quita el silencio a alguien
*➢sorteo*
> ➥Sortea un premio entre los miembros
*➢x9visuunica 1/0* 🆕
> ➥Guarda las vistas únicas al llegar
*➢revelar* 🆕
> ➥Revela una vista única (respóndela)
*➢rankrep*
> ➥Ranking de reputación
*➢rankcoins*
> ➥Ranking de coins
*➢ranknivel*
> ➥Ranking de nivel

╭
  ❍ 𝐌𝐄𝐍𝐔 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒 🔑  ❐
╰
*➢play*
> ➥Descarga músicas
*➢play2*
> ➥Descarga músicas (iPhone)
*➢playvideo*
> ➥Descarga videos
*➢playdoc*
> ➥Descarga videos en documento
*➢tiktok*
> ➥Videos de TikTok
*➢x*
> ➥Videos de X (Twitter)
*➢facebook*
> ➥Videos de Facebook
*➢instagram*
> ➥Videos de Instagram
*➢mediafire*
> ➥Archivos de MediaFire
*➢descargarapk*
> ➥Descarga APK
*➢pinterest*
> ➥Imágenes de Pinterest

╭
   ❍ 𝐌𝐄𝐍𝐔 𝐅𝐈𝐆𝐔𝐒  ❐
╰
*➢sticker*
> ➥Imagen/video a sticker (también vista única)
*➢stickersonido* 🆕
> ➥Sticker que suena: responde a un video con sonido, o a una foto/sticker y luego manda un audio
*➢attp / attp2 / attp3*
> ➥Texto a sticker
*➢attp4 / attp5 / attp6*
> ➥Más estilos de texto a sticker
*➢buscarsticker*
> ➥Busca stickers por nombre
*➢emojimix*
> ➥Mezcla emojis

╭
   ❍ 𝐌𝐄𝐍𝐔 𝐈𝐌𝐀𝐆𝐄𝐍 𝐄 𝐈𝐀 🔑  ❐
╰
*➢hd*
> ➥Mejora una imagen a HD
*➢removebg*
> ➥Quita el fondo de una imagen
*➢imagine*
> ➥Crea imágenes con IA
*➢llama*
> ➥Pregúntale a Llama IA
*➢ia*
> ➥Pregúntale a la IA
*➢chatgpt*
> ➥Pregúntale a ChatGPT

╭
   ❍ 𝐂𝐋𝐈𝐌𝐀 𝐘 𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 🔑  ❐
╰
*➢clima*
> ➥Clima de cualquier ciudad
*➢mareas*
> ➥Estado del mar y mareas
*➢perfilff*
> ➥Perfil de Free Fire por UID
*➢clanff*
> ➥Información de un clan

╭
   ❍ 𝐌𝐄𝐍𝐔 𝐇𝐄𝐑𝐑𝐀𝐌𝐈𝐄𝐍𝐓𝐀𝐒  ❐
╰
*➢toimg*
> ➥Sticker a imagen
*➢tomp3*
> ➥Video a audio
*➢ytsearch*
> ➥Buscar videos en YouTube
*➢wikipedia*
> ➥Busca en Wikipedia
*➢google*
> ➥Busca en Google
*➢simi*
> ➥Habla con el bot
*➢horoscopo*
> ➥Pronóstico diario

╭
   ❍ 𝐌𝐄𝐍𝐔 𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀  ❐
╰
*➢reg*
> ➥Regístrate en el sistema
*➢nivel*
> ➥Tu tarjeta de nivel con imagen
*➢cartera*
> ➥Revisa tu dinero
*➢listreg*
> ➥Lista de registrados
*➢levelup*
> ➥Sube de nivel
*➢dayli*
> ➥Recompensa diaria
*➢minar*
> ➥Mina y gana
*➢pescar*
> ➥Pesca y gana
*➢ruleta*
> ➥Juega a la ruleta
*➢tragamonedas*
> ➥Juega a las tragamonedas
*➢casino*
> ➥Apuesta en el casino
*➢dado*
> ➥Apuesta a un número del 1 al 6
*➢flip*
> ➥Cara o cruz
*➢regalar*
> ➥Regala dinero
*➢mireputacion*
> ➥Mira tu reputación
*➢tienda*
> ➥Compra y vende experiencia
*➢casar*
> ➥Parejas aleatorias
*➢canjear* 🆕
> ➥Cambia Dennies o Ichor por Rupias

╭
    ❍ 𝐌𝐄𝐍𝐔 𝐂𝐑𝐄𝐀𝐃𝐎𝐑  ❐
╰
*➢sercreador*
> ➥Cómo convertirte en dueño
*➢antiprivado*
> ➥No aceptar personas en tu privado
*➢modoconexion* 🆕
> ➥Modo Android para recibir vistas únicas
*➢setclave* 🆕
> ➥Guarda tu API key desde WhatsApp
*➢reiniciar*
> ➥Reinicia el bot
*➢setprefix*
> ➥Cambia el prefijo del bot
*➢bangp*
> ➥Bloquea el bot en un grupo
*➢unbangp*
> ➥Desbloquea el bot en un grupo
*➢botoff*
> ➥Apaga el bot
*➢boton*
> ➥Prende el bot

> 🔑 = necesita la API de https://api.naufrabot.com
`}
module.exports = Menu
