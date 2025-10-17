//Base 100% Editable creditos a Naufrabot 

//Página oficial naufrabot.com

//Sígueme en todas mis redes para estar informados con las novedades de la base 

//Modulos
const { default: makeWASocket,
  DisconnectReason, JulsBotIncConnect, getAggregateVotesInPollMessage, delay, makeCacheableSignalKeyStore, useMultiFileAuthState,
 fetchLatestBaileysVersion, 
 generateForwardMessageContent,
 prepareWAMessageMedia, 
 generateWAMessageFromContent, 
 generateMessageID,
  downloadContentFromMessage, 
  jidDecode,
   proto } = require("baileys")
const fs = require('fs')
const { Boom } = require('@hapi/boom')
const NodeCache = require("node-cache")
const readline = require("readline")
const PhoneNumber = require('awesome-phonenumber')
const cfonts = require('cfonts');
const fetch = require('node-fetch')
const pino = require('pino')
const util = require("util")
const speed = require("performance-now");
const mimetype = require('mime-types')
const { exec, spawn, execSync } = require("child_process")
let phoneNumber = "5199999999"; // cambiar número
const axios = require("axios")
 const ffmpeg = require('fluent-ffmpeg')
 
 //color
const chalk = require('chalk')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) };
 
 //baner
const banner = cfonts.render("Naufra| Bot| Base", {
  font: 'pallet',
  align: 'center',
  gradient: ["green","blue"]
})
      // FUNCIONES DESCARGA 
const { fetchJson , getBuffer ,fetchBuffer } = require('./fuction/download/gets.js')


const {getExtension, getRandom } =require('./fuction/settings/fuctions.js')

 //Stickers
const { sendVideoAsSticker, sendImageAsSticker } = require('./fuction/sticker/rename.js');
const { sendVideoAsSticker2, sendImageAsSticker2 } = require('./fuction/sticker/rename2.js');
 
 //Grupos js
const { MoneyOfSender, addkoin, delkoin, AddReg, checkOfReg , addLevel, addXp,levelOfsender , xpOfsender ,checkOfRegM ,addkoinM , delkoinM , MoneyOfM,Rxp, addRxp ,addRep , delRep , repUser  } = require('./settings/Grupo/Js/reg.js')
     
           // GAMES
const  { addClaim , checkClaim , timeClaim ,expiredClaim } = require('./Games/Js/claim.js')
const { checkCasino,checkAttp,checkEmoji,checkEve, addClaimTraga, checkClaimTraga, timeClaimTraga, checkRuleta,checkMinar,addCasino,addAttp,addEmoji,addEve,addRuleta ,addMinar,expiredCasino,expiredMinar,expiredAttp,expiredEmoji,expiredEve,expiredRuleta,timeAttp,timeEmoji,timeEve,timeRuleta,timeMinar,timeCasino,expiredDayli,JsonDayli,addDayli,timeDayli,checkDayli,checkPescar,timePescar,addPescar,expiredPescar}
 = require('./Games/Js/mining.js')



  


      
    // Menu bot js
const Menu = require ('./settings/Bot/Js/menu.js')

 //configurar ggrupos
const welkom = JSON.parse(fs.readFileSync('./settings/Grupo/Json/welkom.json')) 
const antilink = JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink.json'))
const bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json'))
const Antipv = JSON.parse(fs.readFileSync('./settings/Grupo/Json/chat.json'))
const registro = JSON.parse(fs.readFileSync('./settings/Grupo/Json/registros.json')) 
const Exportion = JSON.parse(fs.readFileSync('./Games/Json/exportion.json'))
const Exportion1 = JSON.parse(fs.readFileSync('./Games/Json/exportion1.json'))
const Cuestions = JSON.parse(fs.readFileSync('./Games/Json/cuestions.json'))
              
   // 𝚃𝙸𝙼𝙴
const moment = require("moment-timezone") 
const time = moment.tz('America/Lima').format('DD/MM HH:mm:ss')
const horap = moment().format('HH')
var timeFt ='𝘽𝙪𝙚𝙣𝙖𝙨 🙋'
if (horap >= '01' && horap <= '05') {
  timeFt = '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ✨'
} else if (horap >= '05' && horap <= '12') {
  timeFt = '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ☀️'
} else if (horap >= '12' && horap <= '18') {
  timeFt = '𝘽𝙪𝙚𝙣𝙖𝙨 𝙩𝙖𝙧𝙙𝙚𝙨 ⛅'
} else if (horap >= '18' && horap <= '23') {
  timeFt = '𝙗𝙪𝙚𝙣𝙖𝙨 𝙣𝙤𝙘𝙝𝙚𝙨 🌑'
} 



 //Configuraciones 
var { creador, owner, Bot, JpgBot, API_KEY_NAUFRA } = require("./settings/settings.json");        
const prefixo = ['#','/','•','.','!','?','*']// @ Prefijos



const pairingCode = true;

const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

function getGroupAdmins(participants) {
admins = []
for (let i of participants) {
if(i.admin == 'admin') admins.push(i.id)
if(i.admin == 'superadmin') admins.push(i.id)
}
return admins
}

async function startProo() {
  console.clear();
  console.log(banner.string);
  console.log(chalk.cyanBright("🔥 NaufraBot Base"));

  // Estado de sesión
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();

  // Crear socket
  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // Desactivado para no mostrar QR
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    syncFullHistory: false,
  });

  // 🟢 Si no hay sesión registrada, generar el código de vinculación de 8 dígitos
  if (!sock.authState.creds.registered) {
    let number = await question(
      chalk.cyan("📱 Escribe tu número de WhatsApp con código de país (solo números): ")
    );
    rl.close();
    number = number.replace(/[^0-9]/g, "");

    if (!number) {
      console.log(chalk.red("❌ Número inválido."));
      process.exit(1);
    }

    console.log(chalk.yellow("⌛ Solicitando código de vinculación..."));
    try {
      const code = await sock.requestPairingCode(number);
      console.log(chalk.bgGreen.black("✅ CÓDIGO DE VINCULACIÓN:"), chalk.white(code));
    } catch (err) {
      console.error(chalk.red("❌ Error al generar código de vinculación:"), err.message);
      process.exit(1);
    }
  }

  // 🔄 Monitorear el estado de conexión
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red("❌ Sesión cerrada. Borra la carpeta 'session' y vuelve a emparejar."));
      } else {
        console.log(chalk.yellow("⚠️ Conexión cerrada, reconectando..."));
        startProo();
      }
    } else if (connection === "open") {
      console.log(chalk.greenBright("✅ Conectado exitosamente"));
      exec("rm -rf tmp && mkdir tmp");
    }
  });

  // Guardar credenciales cuando se actualicen
  sock.ev.on("creds.update", saveCreds);



    
               // 𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 
        // 𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙰 𝚈 𝙳𝙴𝚂𝙿𝙴𝙳𝙸𝙳𝙰 
sock.ev.on("group-participants.update", async (anu) => {
if(!welkom.includes(anu.id)) return
try {
const metadata = await sock.groupMetadata(anu.id)
  participants = anu.participants
  for (let num of participants){
 
if(anu.action == 'add') {
const grup = metadata.subject
const num = anu.participants[0]
const mem = metadata.participants.length
const descr = metadata.desc
const sol = `
✦━─⌬༓༒༓⌬─━✦
*✧༺ 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒐/𝒂 ✦༻✧*

💌 「 Hola @${num.split('@')[0]} 🌟 y bienvenido/a al reino de *${grup}* 」
🥂 Que tu estancia esté llena de risas, buena charla 🗨 y alguna que otra copa de hidromiel 🍯🍺

📜 Recuerda echarle un ojo a nuestras reglas para no invocar a los dragones 🐉🔥
 
『 👥 Miembros actuales: ${mem} 』
✦━─⌬༓༒༓⌬─━✦
`

await sock.sendMessage(anu.id, {
  image: { url: "https://i.ibb.co/HDf3hw9J/20250702-214923.jpg" },
  caption: sol,
  mentions: [num]  // 👈 Aquí haces la mención real
})
}
if (anu.action == 'promote') {
    num = anu.participants[0]    
    teks = `
✦━─┈༓༒༓┈─━✦

     *✧༺ 𝓝𝓾𝓮𝓿𝓸 𝓐𝓭𝓶𝓲𝓷 ༻✧*

🪪 𝗡𝗼𝗺𝗯𝗿𝗲: @${num.split('@')[0]}
🌐 𝗚𝗿𝘂𝗽𝗼: ${metadata.subject}
💌 「 ¡Enhorabuena! 🎉 Has ascendido a la mesa de los administradores 🪄 」

✦━─┈༓༒༓┈─━✦
`
  await sock.sendMessage(anu.id,{image : { url : "https://i.postimg.cc/0ygy14nq/20251017-152852.jpg" }, caption : teks})
    }

} 
}catch(e) {
console.log('Error: %s', color(e, "red"))
}
})

//Bienvenida y despedidas

sock.ev.on('creds.update', saveCreds)
sock.ev.on("messages.upsert",  () => { })

sock.ev.on('messages.upsert', async m => {
 try {
 const info = m.messages[0]
 if (!info.message) return 
 if (info.key && info.key.remoteJid == "status@broadcast") return
 const altpdf = Object.keys(info.message)
 const type = altpdf[0] == "senderKeyDistributionMessage" ? altpdf[1] == "messageContextInfo" ? altpdf[2] : altpdf[1] : altpdf[0]
const content = JSON.stringify(info.message)
const from = info.key.remoteJid
 var body = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId : ''

const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

var pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''

const numerodono = [
  `${owner}`
];


const verificarN = async(sla) => {
const [result] = await sock.onWhatsApp(sla)
if(result == undefined) {
enviar("Este usuário no existe en WhatsApp")
} else {
enviar(`${sla} Número existente en WhatsApp con  id: ${result.jid}`)
}
}
    
// Constantes is
 const isGroup = info.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? info.key.participant: from
const groupMetadata = isGroup ? await sock.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupDesc = isGroup ? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants || [] : [];
const nome = info.pushName ? info.pushName : ''
const groupAdmins = groupMembers.filter(p => p.admin);
const Sadm = isGroup ? getGroupAdmins(groupAdmins) :''
const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const text = args.join(' ')
const isCmd = body.startsWith(prefixo)
              
  // MULTIPREFIJO 
const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const prefixes = prefixo ? prefixo.map(prefix => prefix.toLowerCase()) : [];
const lowerBudy = budy.toLowerCase();
const hasPrefix = prefixes.some(prefix => lowerBudy.startsWith(prefix));
const commandArgs = hasPrefix ? lowerBudy.slice(prefixes.find(prefix => lowerBudy.startsWith(prefix)).length).trim().split(' ') : lowerBudy.trim().split(' ');
const comando = removeAccents(commandArgs[0]);
  // MULTIPREFIJO
const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? sock.sendMessage(from, {text: teks.trim(), mentions: memberr}) : sock.sendMessage(from, {text: teks.trim(), mentions: memberr})}
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).Mimetype || ""
const sleep = async (ms) => {return new Promise(resolve => setTimeout(resolve, ms))}
const pushname = info.pushName ? info.pushName : ''
const isBot = info.key.fromMe ? true : false
const senderNumber = sender.split("@")[0]
const BotNumber = sock.user.id.split(':')[0]+'@s.whatsapp.net'
const isOwner =  numerodono.includes(sender)


const isGroupAdmins = groupAdmins.some(admin => admin.id?.includes(sender));
const isBotGroupAdmins = esAdminFlexible(sock, groupAdmins.map(p => p.id));

function esAdminFlexible(sock, listaDeAdmins = []) {
  if (!sock?.authState?.creds?.me) return false;

  const botId = sock.authState.creds.me.id;   // ej: 51916525000:26@lid
  const botLid = sock.authState.creds.me.lid; // ej: 51916525000@lid

  const clean = (jid) => jid?.split(':')[0]; // elimina el ":26" si existe

  return listaDeAdmins.some(adminJid => {
    const adminBase = clean(adminJid);
    return (
      adminJid === botId ||
      adminJid === botLid ||
      adminJid === botId.replace(/:\d+/, '') || // compara sin ":xx"
      adminJid === botLid.replace(/:\d+/, '') ||
      adminBase === clean(botId) ||
      adminBase === clean(botLid)
    );
  });
}

const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi')) }
const deviceType = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'
const options = { timeZone: 'America/Lima', hour12: false }
const data = new Date().toLocaleDateString('PE', { ...options, day: '2-digit', month: '2-digit', year: '2-digit' })
const hora = new Date().toLocaleTimeString('PE', options) 

           // Constantes if nuevas
  const iswelkom = isGroup ? welkom.includes(from) : false
const isBanGp = isGroup ? bngp.includes(from) : false
const isAntipv = Antipv.includes('activo')
const isReg = checkOfReg(sender)
 const isAntiLink = isGroup ? antilink.includes(from) : false 
const coins = MoneyOfSender(sender)
 
 // 🟢 Sistema de encendido/apagado global del bot

const estadoPath = './settings/estadoBot.json'


if (!fs.existsSync(estadoPath)) {
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: true }, null, 2))
}
let botActivo = JSON.parse(fs.readFileSync(estadoPath)).activo
function guardarEstadoBot(estado) {
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: estado }, null, 2))
  botActivo = estado
}

//

//MODO ADMIN 

const modoAdminPath = './settings/Grupo/Json/modo_admin.json';
const modoAdminList = fs.existsSync(modoAdminPath) ? JSON.parse(fs.readFileSync(modoAdminPath)) : [];
const isModoAdmin = isGroup ? modoAdminList.includes(from) : false;



 //Funciones nuevas
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
} 
function DLT_FL(file) {
        try {
            fs.unlinkSync(file);
        } catch (error) {
            return;
        }
    }
    
 const enviar = (texto) => {
 sock.sendMessage(from,{ text : texto }, {quoted : info})
 }
 
 //rangos
const rangos = JSON.parse(fs.readFileSync('./settings/rangos.json'))
const YouN = levelOfsender(sender)
const Mlevel = rangos[YouN] || '🎖️𝐒𝐢𝐧 𝐑𝐚𝐧𝐠𝐨🎖️'

 
 

 
 const Rrxp = Rxp(sender)
 const Crxp = xpOfsender(sender)
 var Mrxp ;
 if(Crxp <= Rrxp + 50){
 var Mrxp = '*▒▒▒▒▒▒▒▒▒▒ 0%*'
 }else if(Crxp <= Rrxp + 100){
 var Mrxp = '*█▒▒▒▒▒▒▒▒▒ 10%*'
 }else if(Crxp <= Rrxp + 200){
 var Mrxp = '*██▒▒▒▒▒▒▒▒ 20%*'
 }else if(Crxp <= Rrxp + 300){
 var Mrxp = '*███▒▒▒▒▒▒▒ 30%*'
 } else if(Crxp <= Rrxp + 400){
 var Mrxp = '*████▒▒▒▒▒▒ 40%*'
 }else if(Crxp <= Rrxp + 500){
 var Mrxp = '*█████▒▒▒▒▒ 50%*'
 }else if(Crxp <= Rrxp + 600){
 var Mrxp = '*██████▒▒▒▒ 60%*'
 }else if(Crxp <= Rrxp + 700){
 var Mrxp = '*███████▒▒▒ 70%*'
 }else if(Crxp <= Rrxp + 800){
 var Mrxp = '*████████▒▒ 80%*'
 }else if(Crxp <= Rrxp + 999){
 var Mrxp = '*█████████▒ 90%*'
 } else if(Crxp >= Rrxp + 1000){
 var Mrxp = '*██████████ 100%*'
 }
 
             // 𝙽iveles
 // Constantes if
 const isImage = type == "imageMessage"
const isVideo = type == "videoMessage"
const isAudio = type == "audioMessage"
const isSticker = type == "stickerMessage"
const isContact = type == "contactMessage"
const isLocation = type == "locationMessage"
const isProduct = type == "productMessage"
const isMedia = (type === "imageMessage" || type === "videoMessage" || type === "audioMessage") 
typeMessage = body.substr(0, 50).replace(/\n/g, "")
if (isImage) typeMessage = "Image"
else if (isVideo) typeMessage = "Video"
else if (isAudio) typeMessage = "Audio"
else if (isSticker) typeMessage = "Sticker"
else if (isContact) typeMessage = "Contact"
else if (isLocation) typeMessage = "Location"
else if (isProduct) typeMessage = "Product"
const isQuotedMsg = type === "extendedTextMessage" && content.includes("textMessage")
const isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
const isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
const isQuotedDocument = type === "extendedTextMessage" && content.includes("documentMessage")
const isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
const isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
const isQuotedContact = type === "extendedTextMessage" && content.includes("contactMessage")
const isQuotedLocation = type === "extendedTextMessage" && content.includes("locationMessage")
const isQuotedProduct = type === "extendedTextMessage" && content.includes("productMessage")


const getFileBuffer = async (mediakey, MediaType) => {
const stream = await downloadContentFromMessage(mediakey, MediaType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
return buffer}



//funcion para mencionar 

const obtenerMencionado = (info) => {
    const context = info.message?.extendedTextMessage?.contextInfo
        || info.message?.contextInfo
        || null;

    if (context?.mentionedJid && context.mentionedJid.length > 0) {
        return context.mentionedJid[0];
    }

    if (context?.participant) {
        return context.participant;
    }

    return null;
};

     //  Time
const runtime = function(seconds) {
    seconds = Number(seconds);
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Utilizando Math.floor() para asegurar que los segundos sean enteros
    const parts = [];    
    if (days > 0) {
        parts.push(days + (days === 1 ? " 𝙳𝙸𝙰" : " 𝙳𝙸𝙰𝚂"));
    }
    if (hours > 0) {
        parts.push(hours + (hours === 1 ? " 𝙷𝙾𝚁𝙰" : " 𝙷𝙾𝚁𝙰𝚂"));
    }
    if (minutes > 0) {
        parts.push(minutes + (minutes === 1 ? "  𝙼𝙸𝙽𝚄𝚃𝙾" : " 𝙼𝙸𝙽𝚄𝚃𝙾𝚂"));
    }
   if (remainingSeconds > 0) {
    parts.push(remainingSeconds + (remainingSeconds === 1 ? " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾" : " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾𝚂"));
    }    
    return parts.join(', ');
}

  // Respuesta
     const respuesta = {
  admin: "『 🚫 𝒏𝒐 𝒆𝒓𝒆𝒔 𝒖𝒏 𝒂𝒅𝒎𝒊𝒏 』",
  botadmin: "『 ⚠️ 𝒆𝒍 𝒃𝒐𝒕 𝒅𝒆𝒃𝒆 𝒕𝒆𝒏𝒆𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒐 𝒅𝒆 𝒂𝒅𝒎𝒊𝒏 』",
  grupos: "『 💬 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒍𝒆 𝒔𝒐𝒍𝒐 𝒆𝒏 𝒈𝒓𝒖𝒑𝒐𝒔 』",
  vacio: "『 ❓ 𝒆𝒔𝒄𝒓𝒊𝒃𝒆 𝒂𝒍𝒈𝒐, 𝒏𝒐 𝒑𝒖𝒆𝒅𝒐 𝒂𝒅𝒊𝒗𝒊𝒏𝒂𝒓 』",
  miowner: "『 ⛔ 𝒏𝒐 𝒆𝒓𝒆𝒔 𝒎𝒊 𝒄𝒓𝒆𝒂𝒅𝒐𝒓 』",

  registro: `
╔════◇◆◇════╗
💬 ❝ 𝑷𝒓𝒊𝒎𝒆𝒓𝒐 𝒅𝒆𝒃𝒆𝒔 𝒓𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒓𝒕𝒆 🤔 ¡𝑬𝒔 𝒇𝒂𝒄𝒊𝒍! 😄 ❞
💬 ❝ 𝑬𝒔𝒄𝒓𝒊𝒃𝒆:  .𝒓𝒆𝒈 ❞
╚════◇◆◇════╝
`,

  yaregistro: `
╔══════◇◆◇══════╗
💬 ❝ 𝑳𝒐 𝒍𝒂𝒎𝒆𝒏𝒕𝒐, 𝒚𝒂 𝒆𝒔𝒕𝒂́𝒔 𝒓𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒅𝒐 🗒 ❞
╚══════◇◆◇══════╝
`,

  coins: `『 💰 ᴄᴏɪɴs ɪɴsᴜғɪᴄɪᴇɴᴛᴇs @${sender.split('@')[0]} 』`
}

 
   // Verificados
 const SvnC = {key : {participant : '0@s.whatsapp.net'},message : {contactMessage : {displayName : `${pushname}`}}};
 
  // Funciones para crear códigos de 6 Digitos
  
  function generarCodigo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indice);
    }
    return codigo;
}


 // MENSAJES EN CONSOLA
 
// comando pv
if (!isGroup && isCmd) console.log( '\n  ╔─━━━━ ', color(' 𝗖𝗠𝗗 「 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 」','blue'), '━━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' COMANDO :','lime'),color(comando,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━ '),color ('𝗘𝗹𝗶𝘀𝘃𝗮𝗻 | 𝗥𝘆𝘂𝗸','red'), '━━━━━─╝')

//pv
if (!isCmd && !isGroup) console.log( '\n  ╔─━━━━━', color(' 𝗖𝗛𝗔𝗧 「 𝗕𝗢𝗧 」','blue'), '━━━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' MENSAJE :','lime'),color(budy,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━━━ '),color ('【✔】 ','red'), '━━━━━━━━━─╝')

//comando grupo
if (isCmd && isGroup) console.log( '\n  ╔─━━━ ', color('  𝗖𝗠𝗗「 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 」','blue'), '━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' COMANDO :','lime'),color(comando,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━ '),color ('𝗘𝗹𝗶𝘀𝘃𝗮𝗻 | 𝗥𝘆𝘂𝗸','red'), '━━━━━─╝')

//mensaje grupo
if (!isCmd && isGroup) console.log( '\n  ╔─━━━━━', color(' 𝗖𝗛𝗔𝗧「 𝗕𝗢𝗧 」','blue'), '━━━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' MENSAJE :','lime'),color(budy,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━━━━ '),color ('【✔】 ','red'), '━━━━━━━━━─╝')
   
  
   expiredClaim();
 expiredMinar()
expiredAttp()
expiredEmoji()
expiredEve()
expiredDayli()
expiredPescar()
expiredRuleta()
//ban grupo
if(isBanGp) {
return
}
      // antiprivado
if(isAntipv && !isGroup && !isOwner){
sock.updateBlockStatus(sender, 'block')
}

// INICIO DE COMANDOS
//solo funciona si está activado el bot
// Si el grupo está en modo admin y el usuario no es admin ni owner, se bloquea su acceso
if (isModoAdmin && !isGroupAdmins && !isOwner) return;
if (!botActivo && !isOwner) return

switch(comando) {

//Comandos owner


  

  
  
  case 'menu':
case 'help': {
    if (!isGroup) return;
    if (!isReg) return enviar(respuesta.registro);

    const Mnu = Menu(timeFt, Bot, sender, groupName, groupMembers);

    // Enviar imagen del menú completa
    await sock.sendMessage(from, {
        image: { url: JpgBot },
        caption: Mnu,
        mentions: [sender]
    }, { quoted: info });
}
break;

case 'boton': 
case 'botonon':
case 'encenderbot':
  if (!isOwner) return enviar(respuesta.miowner)
  if (botActivo) return enviar('✅ El bot ya está encendido.')
  guardarEstadoBot(true)
  enviar('🤖 El bot ha sido *ACTIVADO* y volverá a responder a los comandos.')
break

case 'botoff':
case 'apagabot':
case 'offbot':
  if (!isOwner) return enviar(respuesta.miowner)
  if (!botActivo) return enviar('⚠️ El bot ya estaba apagado.')
  guardarEstadoBot(false)
  enviar('😴 El bot ha sido *DESACTIVADO* y dejará de responder a los comandos.')
break


case 'antiprivado':
case 'antipv':{
if(!isOwner) return enviar(respuesta.miowner)
if(args[0]=== 'on' ){
if(isAntipv) return enviar('El anti-privado ya esta activo')
Antipv.push('activo')
fs.writeFileSync('./settings/Json/chat.json' , JSON.stringify(Antipv))
enviar('Anti-privado activado exitosamente')
} else if(args[0] === 'off'){
if(!isAntipv) return enviar('El anti-privado ya estaba desactivado')
Antipv.splice('desactivo')
fs.writeFileSync('./settings/Json/chat.json' , JSON.stringify(Antipv))
enviar('Anti-privado desactivado exitosamente')
} else {
enviar('on para activar y off para desactivar')
}
}
break 



case 'rvisu': case 'revelarvisu': case 'open':
    if(!isOwner) return enviar(respuesta.miowner)
    enviar('🥱')
    try{    
        if(JSON.stringify(info).includes("videoMessage")) {
            var vio = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
            var viewImage = vio?.imageMessage || info.message?.imageMessage || vio?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || vio?.viewOnceMessage?.message?.imageMessage
            var viewVideo = vio?.videoMessage || info.message?.videoMessage || vio?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || vio?.viewOnceMessage?.message?.videoMessage
            viewVideo.viewOnce = false
            viewVideo.video = {url: viewVideo.url}
            viewVideo.caption += "El vídeo fue *Revelado*"
            sock.sendMessage(from, viewVideo)
        } else {
            var vio = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
            var viewImage = vio?.imageMessage || info.message?.imageMessage || vio?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || vio?.viewOnceMessage?.message?.imageMessage
            var viewVideo = vio?.videoMessage || info.message?.videoMessage || vio?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || vio?.viewOnceMessage?.message?.videoMessage
            viewImage.viewOnce = false
            viewImage.image = {url: `${viewImage.url}`}
            viewImage.caption += "😼"
            sock.sendMessage(from, viewImage)
        }
    } catch(e){
        console.log(e)
        enviar(e)
    }
    break
    
case 'reiniciar': {
    console.log("=== DEBUG REINICIAR ===");
    console.log("Número que ejecuta el comando:", sender);
    console.log("Número(s) configurados como owner:", global.owner || owner || "No definido");
    console.log("¿Es owner?:", isOwner);

    if (!isOwner) return enviar(respuesta.miowner);

    enviar('𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾, 𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝚄𝙽 𝙼𝙾𝙼𝙴𝙽𝚃𝙾 ');
    setTimeout(async () => {
        console.log("Reiniciando el bot...");
        process.exit(0);
    }, 1000);
}
break;


//información 

case 'infobot': case 'ping': {
if (!isGroup) return
let timestamp = speed()
let latensi = speed() - timestamp
uptime = process.uptime()
botinfo = `
╔═【 𝑰𝒏𝒇𝒐 𝒅𝒆𝒍 𝑩𝒐𝒕 】═╗
⏰  𝐇𝐎𝐑𝐀  »  ${time}
📅  𝐅𝐄𝐂𝐇𝐀 »  ${data}
🤖  𝐍𝐎𝐌𝐁𝐑𝐄 »  ${Bot}
🔰  𝐏𝐑𝐄𝐅𝐈𝐉𝐎 »  𝓜𝓾𝓵𝓽𝓲𝓹𝓻𝓮𝓯𝓲𝓳𝓸
⚡  𝐕𝐄𝐋𝐎𝐂𝐈𝐃𝐀𝐃 »  ${latensi.toFixed(4)} seg
📲  𝐃𝐈𝐒𝐏𝐎𝐒𝐈𝐓𝐈𝐕𝐎 »  ${deviceType}
⏳  𝐄𝐍 𝐋𝐈𝐍𝐄𝐀 »  ${runtime(uptime)}
💾  𝐌𝐄𝐌𝐎𝐑𝐈𝐀 »  ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
👤  𝐔𝐒𝐔𝐀𝐑𝐈𝐎 »  ${pushname}
╚══❖═══════❖══╝
`
sock.sendMessage(from, { image: { url: JpgBot }, caption: botinfo }, { quoted: info })
}
break 

case 'botcompleto':
case 'bot':
enviar(`💫 ¿𝙌𝙪𝙞𝙚𝙧𝙚𝙨 𝙪𝙣 𝙗𝙤𝙩 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙤 𝙘𝙤𝙣 𝙨𝙪𝙥𝙚𝙧 𝙁𝙪𝙣𝙘𝙞𝙤𝙣𝙚𝙨? 🤖

*[💡]  ᴏɴʟɪɴᴇ 24/7*
*[💡]  sᴏᴘᴏʀᴛᴇ 100% ᴅɪsᴘᴏɴɪʙʟᴇ*
*[💡]  ᴏʀɢᴀɴɪᴄᴇ sᴜ ɢʀᴜᴘᴏ*
*[💡]  ᴀᴅᴍɪɴɪsᴛʀᴇ sᴜ ɢʀᴜᴘᴏ*
*[💡]  ᴘʀᴏᴛᴇᴊᴀ sᴜ ɢʀᴜᴘᴏ*
*[💡]  ᴠᴇᴜʟᴠᴀ sᴜ ɢʀᴜᴘᴏ ᴍᴀs ᴀᴄᴛɪᴠᴏ*

  𝙋𝙍𝙀𝘾𝙄𝙊𝙎 𝙋𝘼𝙍𝘼 𝙀𝙇 𝘼𝙇𝙌𝙐𝙄𝙇𝙀𝙍 𝘿𝙀𝙇 𝘽𝙊𝙏

*┠💵⃟ꦿ〢* ᴘʟᴀɴ ǫᴜɪɴᴄᴇɴᴀʟ (15 dias): USD$ 1,50
    
*┠💵⃟ꦿ〢* ᴘʟᴀɴ ᴍᴇɴsᴜᴀʟ (30 dias): USD$ 2,90 ⭐(ᴍᴀs ᴘᴏᴘᴜʟᴀʀ)

*┠💵⃟ꦿ〢* ᴘʟᴀɴ sᴇᴍᴇsᴛʀᴀʟ (180 dias): USD$ 13,90

*┠💵⃟ꦿ〢* ᴘʟᴀɴ ᴀɴᴜᴀʟ (360 dias): USD$ 28,90

*┠💵⃟ꦿ〢* ʙᴏᴛ ᴘᴇʀᴢᴏɴᴀʟɪᴢᴀᴅᴏ (30 dias): USD$ 5,90 ⭐(ᴘᴏᴘᴜʟᴀʀ)


╚═════❖•ೋ° 🌟 °ೋ•❖═════╝

*__________🔒 𝙋𝙍𝙊𝙏𝙀𝘾𝘾𝙄𝙊𝙉𝙀𝙎 🔒__________*

*[🔐] ANTI-LINK*
*[🔐] ANTI-FAKE*
*[🔐] ANTI-CONTACTO*
*[🔐] ANTI-LOCALIZACION*
*[🔐] ANTI-DOCUMENTO*
*[🔐] ANTI-VIDEO*
*[🔐] ANTI-IMAGEN*
*[🔐] ANTI-AUDIO*
*[🔐] ANTI-VIEWONCE*

*_________🔧 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎 🔧__________*
*[🛠️] ᴄʀᴇᴀʀ sᴛɪᴄᴋᴇʀs*
*[🛠️] ᴅᴇsᴄᴀʀɢᴀʀ ᴍᴜsɪᴄᴀs*
*[🛠️] ᴅᴇsᴄᴀʀɢᴀʀ ᴠɪᴅᴇᴏs*
*[🛠️] ᴀʙʀɪʀ ʏ ᴄᴇʀʀᴀʀ ɢʀᴜᴘᴏ ᴄᴏɴ ᴛɪᴇᴍᴘᴏ*
*[🛠️] ʙᴀɴ ʏ ᴋɪᴄᴋ*
*[🛠️] ᴊᴜᴇɢᴏs*
*[🛠️] ᴄᴏᴍᴀɴᴅᴏs +🔞*


*_________👑 𝘾𝙊𝙉𝙏𝙍𝘼𝙏𝙀 👑__________*
[🔥] *Puedes contratar el bot directamente desde nuestra pagina web oficial*👇
[💬] https://naufrabot.com/`);
break

case 'grupos':
case 'grupo':
enviar(`🧩 𝙂𝙍𝙐𝙋𝙊 𝙊𝙁𝙄𝘾𝙄𝘼𝙇 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙐𝙉 𝘽𝙊𝙏 𝘼𝘾𝙏𝙄𝙑𝙊 24/7 👇

➫https://chat.whatsapp.com/Jd7WKQBsAhkCG4k1SPxK7r?mode=ac_t`);
break

case 'serdueño':
case 'sercreador':
case 'owner':
case 'serowner':
enviar(`*🧩 Mira el siguiente vídeo donde te enseño cómo convertirte en dueño del bot y usar los comandos de owner 👇*

➫https://youtu.be/LugjBfJEoiQ?si=Z-qaGhjNdC-p3fGS`);
break

case 'canal':
case 'canales':
enviar(`𝘾𝙖𝙣𝙖𝙡𝙚𝙨 𝙤𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 𝙥𝙖𝙧𝙖 𝙧𝙚𝙘𝙞𝙗𝙞𝙧:
🌐𝙉𝙤𝙫𝙚𝙙𝙖𝙙𝙚𝙨 
🌐𝙎𝙤𝙧𝙩𝙚𝙤𝙨
🌐𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙘𝙞𝙤𝙣 
🌐𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙘𝙞𝙤𝙣𝙚𝙨 𝙨𝙤𝙗𝙧𝙚 𝙚𝙡 𝙗𝙤𝙩

*➫ YouTube* 
https://youtube.com/@naufrazapp_bots?si=Ie89Ben9B1Mn-jOU

*➫ Sitio web*
https://naufrabot.com/

*➫ Instagram*
https://www.instagram.com/naufrabot_official?igsh=cXFwemd0b213dWl1

*➫ Tik tok*
https://www.tiktok.com/@naufra.zapp?_t=8lMjEw7d9SX&_r=1

*➫ WhatsApp*
https://whatsapp.com/channel/0029Vaz3WoQ6RGJPJQcMXQ14
`)
break




case 'serbot':
    try {
        const moneybot = `𝗣𝗲𝗻𝘀𝗮𝘀𝘁𝗲 𝗾𝘂𝗲 𝘁𝗲 𝗴𝗲𝗻𝗲𝗿𝗮𝗿𝗶𝗮 𝗲𝗹 𝗖𝗼𝗱𝗶𝗴𝗼 𝗤𝗥, ¿𝗩𝗲𝗿𝗱𝗮𝗱? 😂

𝗟𝗮𝗺𝗲𝗻𝘁𝗮𝗯𝗹𝗲𝗺𝗲𝗻𝘁𝗲, *𝗲𝗻 𝗲𝘀𝘁𝗲 𝗯𝗼𝘁 𝗻𝗼 𝗽𝘂𝗲𝗱𝗲𝘀 𝘀𝗲𝗿 𝘀𝘂𝗯 𝗯𝗼𝘁* 𝗽𝗼𝗿𝗾𝘂𝗲 𝗲𝘀𝗼 𝗰𝗼𝗺𝗽𝗿𝗼𝗺𝗲𝘁𝗲 𝗹𝗼𝘀 𝗿𝗲𝗰𝘂𝗲𝗿𝘀𝗼𝘀 𝗱𝗲𝗹 𝘀𝗲𝗿𝘃𝗶𝗱𝗼𝗿 𝘆 𝗹𝗼 𝗵𝗮𝗰𝗲 𝗺𝗮𝘀 𝗹𝗲𝗻𝘁𝗼.  
𝗦𝗶 𝗿𝗲𝗮𝗹𝗺𝗲𝗻𝘁𝗲 𝗾𝘂𝗲𝗿𝗲𝘀 𝘀𝗲𝗿 𝘀𝘂𝗯 𝗯𝗼𝘁, 𝗽𝘂𝗲𝗱𝗲𝘀 𝗼𝗯𝘁𝗲𝗻𝗲𝗿 𝗺𝗮𝘀 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝗰𝗶𝗼𝗻 𝗲𝗻 𝗻𝘂𝗲𝘀𝘁𝗿𝗮 𝗽𝗮𝗴𝗶𝗻𝗮 𝘄𝗲𝗯:  
🔗 https://naufrabot.com/subbots/`;

        // Enviar el mensaje final
        await enviar(moneybot);

    } catch (e) {
        console.error(e);
        enviar("Error al procesar el comando.");
    }
break;


//AJUSTES DEL GRUPO

case 'welcome' : 
case 'bienvenida' :
if (!isGroup) return 
if(args.length<1) return enviar('「 𝟏 𝐏𝐚𝐫𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐲 𝟎 𝐏𝐚𝐫𝐚 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐫 」 ')
if(!isGroupAdmins) return enviar(respuesta.admin)
if(!isBotGroupAdmins) return enviar('El bot necesita ser administrador') 
if(Number(args[0])=== 1) {
if(iswelkom) return enviar('「 ✅ 𝐋𝐚 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 𝐘𝐚 𝐄𝐬𝐭𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐝𝐚 𝐄𝐧 𝐄𝐥 𝐆𝐫𝐮𝐩𝐨 」 ')
welkom.push(from)
fs.writeFileSync('./settings/Grupo/Json/welkom.json',JSON.stringify(welkom))
enviar('「 ✅ 𝐀𝐜𝐭𝐢𝐯𝐚𝐝𝐨 𝐄𝐱𝐢𝐭𝐨𝐬𝐚𝐦𝐞𝐧𝐭𝐞 」')
} else if (Number(args[0])=== 0 ) {
if (!iswelkom) return enviar('「 ❌ 𝐋𝐚 𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 𝐧𝐨 𝐞𝐬𝐭𝐚 𝐚𝐜𝐭𝐢𝐯𝐚𝐝𝐚」')
welkom.splice(from,1)
fs.writeFileSync('./settings/Grupo/Json/welkom.json',JSON.stringify(welkom))
enviar('❌ 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐝𝐨 𝐞𝐱𝐢𝐭𝐨𝐬𝐚𝐦𝐞𝐧𝐭𝐞 ')
} else {
enviar('「 𝟏 𝐏𝐚𝐫𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐲 𝟎 𝐏𝐚𝐫𝐚 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐫 」')
}
break


case 'bangp':{
  if (!isGroup) return  
  if(!isOwner) return enviar(respuesta.miowner)
  if(!isBanGp) { // antes estaba al revés
    const JsonGp = './settings/Grupo/Json/grupo.json';
    bngp.push(from)
    fs.writeFileSync(JsonGp, JSON.stringify(bngp));
    enviar('✅ GRUPO BANEADO EXITOSAMENTE')
  } else {
    enviar('⚠️ El GRUPO YA SE ENCUENTRA BANEADO')
  }
}
break

case 'unbangp':{
  if (!isGroup) return  
  if(!isOwner) return enviar(respuesta.miowner)
  if(isBanGp) { // antes también estaba al revés
    const JsonGp = './settings/Grupo/Json/grupo.json';
    bngp = bngp.filter(g => g !== from)
    fs.writeFileSync(JsonGp, JSON.stringify(bngp));
    enviar('✅ GRUPO DESBANEADO EXITOSAMENTE')
  } else {
    enviar('⚠️ El GRUPO YA SE ENCUENTRA DESBANEADO')
  }
}
break



case 'todos':
case 'revivir':
  if(!isReg) return enviar(respuesta.registro)
if(!isGroup) return enviar('Es enserio invocar en un chat , te violo tu tio verdad')
if(!isGroupAdmins) return enviar(respuesta.admin) 
members_id = []
teks = (args.length > 1) ? body.slice(8).trim(): ''
teks += `𝐓𝐎𝐓𝐀𝐋 : ${groupMembers.length}\n`
nu = 0
for (let mem of groupMembers) {
nu += 1
teks += ` ➫[${nu.toString()}] @${mem.id.split('@')[0]}\n`
members_id.push(mem.id)
}
mentions(`
🗣️💬 ❝¡𝑳𝑳𝒂𝒎𝒂𝒅𝒂 𝒂 𝒕𝒐𝒅𝒐 𝑬𝒍 𝑴𝒖𝒏𝒅𝒐!❞ \n\n➫ ${teks}
`, members_id, true)
break


case 'anuncio':{
if(!isGroup) return enviar('Es enserio invocar en un chat , te violo tu tio verdad')
if(!isGroupAdmins) return enviar(respuesta.admin) 
men = []
num = 0
teks = `
🗣💬 ❝𝑨𝒕𝒆𝒏𝒄𝒊𝒐𝒏 𝒂 𝒆𝒔𝒕𝒆 𝑨𝒏𝒖𝒏𝒄𝒊𝒐.❞
 👉 ❝ ${q} ❞ 👈 
\n`
for(let m of groupMembers){
num +=1 
teks += `• [${num.toString()}] @${m.id.split('@')[0]}\n`
men.push(m.id)
}
mentions(teks,men,true)
}
break 


case 'modoadmin': {
  if (!isGroup) return enviar("⚠️ Este comando solo se puede usar en grupos.");
  if (!isGroupAdmins) return enviar("🚫 Solo los administradores pueden cambiar este modo.");
  
  const JsonModoAdmin = './settings/Grupo/Json/modo_admin.json';
  let modoAdmin = JSON.parse(fs.readFileSync(JsonModoAdmin));

  const estado = args[0]; // puede ser "1" o "0"

  if (!estado) return enviar("🧩 Usa el comando correctamente:\n\n*modoadmin 1* → Activar modo admin\n*modoadmin 0* → Desactivar modo admin");

  if (estado === "1") {
    if (!modoAdmin.includes(from)) {
      modoAdmin.push(from);
      fs.writeFileSync(JsonModoAdmin, JSON.stringify(modoAdmin, null, 2));
      enviar("✅ *Modo admin activado* — Ahora solo los administradores pueden usar el bot en este grupo.");
    } else {
      enviar("⚠️ El modo admin ya estaba activado en este grupo.");
    }
  } 
  
  else if (estado === "0") {
    if (modoAdmin.includes(from)) {
      modoAdmin = modoAdmin.filter(g => g !== from);
      fs.writeFileSync(JsonModoAdmin, JSON.stringify(modoAdmin, null, 2));
      enviar("🟢 *Modo admin desactivado* — Todos los miembros pueden usar el bot nuevamente.");
    } else {
      enviar("⚠️ El modo admin ya estaba desactivado en este grupo.");
    }
  } 
  
  else {
    enviar("❌ Solo puedes usar *1* para activar o *0* para desactivar.");
  }
}
break;



case 'hidetag' :
case 'notify' :
  if(!isReg) return enviar(respuesta.registro)
  if(!isGroupAdmins) return enviar(respuesta.admin)
if(!q) return enviar('Digite un texto ejemplo !notify hola hermanos 🔥')
if(!isGroup) return enviartexto ('Enserio , hidetag en un chat')
if(!isGroupAdmins) return enviartexto ("El bot necesita ser administrador")
			var group = await sock.groupMetadata(from)
			var member = group['participants']
			var mem = []
			member.map(async adm => {
			mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
			})
			var optionshidetag = {
			text : q,
			contextInfo: { mentionedJid: mem },
			quoted: m
			}
			sock.sendMessage(from, optionshidetag)
			break


case 'kick' :
case 'ban' :
case 'largate' :{
if (!isGroup) return  
if(!isGroupAdmins) return enviar(respuesta.admin)
if(!isBotGroupAdmins) return enviar (respuesta.botadmin)
let mentioned = obtenerMencionado(info);

    if (!mentioned) return enviar("⚠️ Debes mencionar a alguien para usar este comando.");

if(mentioned === BotNumber || mentioned === owner) return enviar('🤨')
await sock.groupParticipantsUpdate(from, [mentioned] , 'remove')
enviar('Accion realizada exitosamente')
}
break 
     



// ⚙️ Comando para activar/desactivar antilink
case 'antilink':
  if (!isGroupAdmins) return enviar(respuesta.admin)
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin)
  if (args.length < 1) return enviar(`𝐃𝐈𝐆𝐈𝐓𝐄 𝟏 𝐏𝐀𝐑𝐀 𝐀𝐂𝐓𝐈𝐕𝐀𝐑 𝐘 𝟎 𝐏𝐀𝐑𝐀 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐑`)

  if (Number(args[0]) === 1) {
    if (isAntiLink) return enviar('✅ El antilink ya está activado en este grupo')
    antilink.push(from)
    fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2))
    enviar('✅ ● ️𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊 𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎 ● ️')
  } 
  else if (Number(args[0]) === 0) {
    if (!isAntiLink) return enviar('❌ El antilink ya está desactivado en este grupo')
    const index = antilink.indexOf(from)
    antilink.splice(index, 1)
    fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2))
    enviar('❌ ● ️𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎 ● ️')
  } 
  else {
    enviar(`𝐃𝐈𝐆𝐈𝐓𝐄 𝟏 𝐏𝐀𝐑𝐀 𝐀𝐂𝐓𝐈𝐕𝐀𝐑 𝐘 𝟎 𝐏𝐀𝐑𝐀 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐑`)
  }
break;





// STICKERS 
case 's':
case 'sticker':
  if(!isReg) return enviar(respuesta.registro)
  if(coins < 1) return enviar(respuesta.coins)
var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage
if(boij2){
enviar(`Creando tu sticker supere un poco ❤️`)
var pack = `
👑 Dueño 👑
 ✅Naufra
⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :
 ${pushname} `
var author2 = ` 
🤖 𝐁𝐨𝐭 🤖
 ⃟NaufraBot
💐 𝐆𝐫𝐮𝐩𝐨💐
${groupName} `
owgi = await getFileBuffer(boij2, 'image')
let encmediaa = await sendImageAsSticker2(sock, from, owgi, info, { packname:pack, author:author2})
await DLT_FL(encmediaa)
await addXp(sender,1)
await delkoin(sender,1)
} else if(boij && boij.seconds < 11){
enviar(`Creando tu Sticker ${pushname}`)
var pack = `
👑 Dueño 👑
 ✅Naufra
⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :
 ${pushname} `
var author2 = ` 
🤖 𝐁𝐨𝐭 🤖
 ⃟NaufraBot
💐 𝐆𝐫𝐮𝐩𝐨💐
${groupName} `
owgi = await getFileBuffer(boij, 'video')
let encmedia = await sendVideoAsSticker2(sock, from, owgi, info, { packname:pack, author:author2})
await DLT_FL(encmedia)
await addXp(sender,1)
await delkoin(sender,1)
} else {
return enviar(`Marque una imagen o \nUn vídeo máximo de 10 segundos ⏲️`)
}
break

///Nesecitas clave API//
case 'attp': 
case 'attp2': 
case 'attp3': 
try {
    if (!q.trim()) return enviar(`*_❕Escribe el texto que quieras!_*\n- *🧑‍🏫 Por ejemplo:* !attp te amo`);
    enviar('*Ok amor❤️ Estoy convirtiendo*');

    var Fontes = commandArgs === "attp2" ? "Roboto" : "Noto Emoji, Noto Sans Mono";

    // Descargar el sticker como buffer
    let axios = require("axios");
    let res = await axios.get(`https://api.bronxyshost.com.br/api-bronxys/attp_edit?texto=${encodeURIComponent(q)}&fonte=${Fontes}&apikey=${API_KEY_NAUFRA}`, {
        responseType: 'arraybuffer'
    });

    // Enviar el sticker desde el buffer
    await sock.sendMessage(from, { sticker: res.data }, { quoted: info });

} catch (e) {
    console.error(e);
    return enviar("Error..");
}
break;



                
                
                case 'emojimix': {
    if (!isReg) return enviar(respuesta.registro);
    if (coins < 1) return enviar(respuesta.coins);

    if (!q) return enviar(`
🔁𝑪𝒐𝒎𝒃𝒊𝒏𝒂 𝒆𝒎𝒐𝒋𝒊𝒔 𝒚 𝒅𝒆𝒔𝒄𝒖𝒃𝒓𝒆 𝒏𝒖𝒆𝒗𝒂𝒔 𝒄𝒓𝒆𝒂𝒄𝒊𝒐𝒏𝒆𝒔‼️
☑️𝑬𝒔𝒄𝒓𝒊𝒃𝒆 𝒆𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 𝒂𝒔í:
👉 *!emojimix 😊+😂*`);

    enviar('`🔁 𝑴𝒆𝒛𝒄𝒍𝒂𝒏𝒅𝒐...`');

    try {
        let [emoji1, emoji2] = q.split`+`;
        var em = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&
            contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
        
        for (let res of em.results) {
            let templateMessage = {
                image: { url: `${res.url}`, quoted: info }
            };
            sock.sendMessage(from, templateMessage, { quoted: info });

            // Reducir 1 moneda y agregar 1 de experiencia
            await delkoin(sender, 1);
            await addXp(sender, 1);
        }
        
    } catch (err) {
        enviar('❌ Ocurrió un error, intenta con otros emojis.');
        console.log(err);
    }
}
break;


///////////////////HERRAMIENTAS///////////

case 'amp3':
case 'tomp3':
  if(!isReg) return enviar(respuesta.registro)
if(!isQuotedVideo) return enviar (`[❗] ${sender.split('@')[0]}, Marque un video `)
enviar('`Creando....`')
tomp = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage , 'video')
	sock.sendMessage(from,{audio :  tomp, mimetype: 'audio/mpeg'},{ quoted: info })		
		await addXp(sender,6)
		await delkoin(sender,3)
				break 
				
		
  case 'toimg':
  if(!isReg) return enviar(respuesta.registro)
if(!isQuotedSticker) return enviar('[❗]• 𝗠𝗔𝗥𝗤𝗨𝗘 𝗨𝗡 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 •')
try {
enviar('`Creando....`')
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
sock.sendMessage(from, {image: buff , caption : ` [❗] *${pushname}*, Aquí tienes tu pedido `},{quoted : info }).catch(e => {
console.log(e);
enviar('Nose pudo convertir a imagen verifica que sea un sticker y no un gif ❌')
})
await addXp(sender,3)
await delkoin(sender,2)
} catch {
enviar('ocurrio un error ')
}
break


case 'calcular':
  case 'cal' :
          if (!isReg) return enviar(respuesta.registro)
          if(args.length == 0) return enviar( ` ┣「 𝗢𝗣𝗘𝗥𝗔𝗖𝗜𝗢𝗡𝗘𝗦 」┫\n╭──────────────────\n│➫┇+ 𝐒𝐮𝐦𝐚\n│➫┇- 𝐑𝐞𝐬𝐭𝐚\n│➫┇/ 𝐃𝐢𝐯𝐢𝐬𝐢𝐨𝐧\n│➫┇* 𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐢𝐜𝐚𝐜𝐢𝐨𝐧\n│➫ 𝔼𝕛𝕖𝕞𝕡𝕝𝕠 : 𝐂𝐚𝐥 𝟒+𝟒\n╰──────────────────`)
            const resultzx = eval(q)
            await sleep(1000)
            enviar(`\n╭──────────────────\n││「 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 」│\n│➫┇${q} = *${resultzx}*\n╰──────────────────`)
            break
            
//Nesecita clave API ////
case 'nik': case 'nic':
case 'generarnick': case 'nick':

try {
if(!q.trim()) return enviar(`Escriba su nombre para enviar con letras especiales, Ejemplo: !nick NaufraBot`);
ABC = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/gerar_nick?nick=${encodeURI(q)}&apikey=${API_KEY_NAUFRA}`)
AB = `*🗒️Lista a base de su nombre,* Escoja la mejor fuente que desea utilizar:\n\n`;
for ( i of ABC) {
AB += `${i}\n\n`;
}
enviar(AB);
} catch (e) {
return enviar("Error..");
}
break;


//nesecitas api
case 'ia': case 'openai': case 'gpt': case 'chatgpt':
try {
  if (!q || !q.trim()) return enviar(`Escribe tu pregunta, Ejemplo: .ia ¿Cuál es la capital de Francia?`);
  
  enviar("*🔍 BUSCANDO 🔍*");
  ABC = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/PERGUNTE_E_EU_RESPONDO?q=${encodeURIComponent(q.trim())}&apikey=${API_KEY_NAUFRA}`)
  
  enviar(`( ${ABC.msg} )`);
} catch (err) { 
  console.error(err);
  enviar("Error..");
}
break;


//Economía niveles y experiencia 

case 'perfil' : case 'cartera' :
case 'nivel' : case 'minivel' :{
if(!isReg) return enviar(respuesta.registro)
var saldo = MoneyOfSender(sender)
const Xp = xpOfsender(sender)
const Mnv = levelOfsender(sender)
const Rxxp = Rxp(sender)
const myrep2 = repUser(sender)
const Xpnull = Rxxp - 1000
if(Xp === null) return addXp(sender,Xpnull)
const Mp = `
╔══✦❖✦══【 𝑻𝒖 𝑷𝒆𝒓𝒇𝒊𝒍 】══✦❖✦══╗
🏷️  𝐍𝐨𝐦𝐛𝐫𝐞      »  @${sender.split('@')[0]}
⚔️  𝐑𝐚𝐧𝐠𝐨       »  ${Mlevel}
👑  𝐑𝐞𝐩𝐮𝐭𝐚𝐜𝐢𝐨́𝐧  »  ${myrep2}
💰  𝐃𝐢𝐧𝐞𝐫𝐨     »  ₹${saldo} 𝐑𝐮𝐩𝐢𝐚𝐬
📈  𝐍𝐢𝐯𝐞𝐥       »  ${Mnv} ➜ ${Mnv + 1}
📚  𝐄𝐗𝐏         »  ${Xp} / ${Rxxp + 1000}
╚══✦❖✦══【 𝐏𝐫𝐨𝐠𝐫𝐞𝐬𝐨 】══✦❖✦══╝
▰▰ ${Mrxp} ▰▰
`
   sock.sendMessage(from,{text : Mp, mentions : [sender]},{quoted : info})        
  
}
break 

//comando tragamonedas 
case 'tragamonedas':
case 'tragamoneda':
if (!isReg) return enviar("Debes registrarte para jugar.");
const apuestas = 1; // Coste por jugar
if (coins < apuestas) return enviar("No tienes suficientes Coins 🪙 para jugar.");

const ahora = Date.now();
const tiempoGuardado = timeClaimTraga(sender) || 0;
const tiempoRestante = tiempoGuardado - ahora;

if (tiempoRestante > 0) {
    return await enviar(`[❗] 𝙴𝚂𝙿𝙴𝚁𝙴 ${runtime(tiempoRestante / 1000)} para volver a jugar.`);
} else {
    const espera = 8 * 60 * 60 * 1000; // 8 horas
    await addClaimTraga(sender, espera);
}


// Restar una moneda por jugar
await delkoin(sender, apuestas);

// Lista de símbolos para la tragamonedas
const simbolos = ['🥕', '🐰', '🐸', '🦊', '🐱', '🍋', '🔔', '🍒', '🍉', '🍌'];

// Generar filas aleatorias
const obtenerFila = () => [
    simbolos[Math.floor(Math.random() * simbolos.length)],
    simbolos[Math.floor(Math.random() * simbolos.length)],
    simbolos[Math.floor(Math.random() * simbolos.length)]
];

// Generar las tres filas
const filaArriba = obtenerFila();
const filaAbajo = obtenerFila();

let filaCentro;
const probabilidad = Math.random(); // Número entre 0 y 1

// 60% de probabilidad de que los tres símbolos del centro sean iguales
if (probabilidad < 0.6) {
    const simboloGanador = simbolos[Math.floor(Math.random() * simbolos.length)];
    filaCentro = [simboloGanador, simboloGanador, simboloGanador]; // Hacer que las 3 sean iguales
} else {
    filaCentro = obtenerFila(); // Si no, generar aleatoriamente
}

// Verificar si el usuario ganó
const esGanador = filaCentro[0] === filaCentro[1] && filaCentro[1] === filaCentro[2];

let resultadoMensaje = "😢 Has perdido... Inténtalo de nuevo dentro de 8 horas.";
let premioTexto = "";

// Si gana, recibe aleatoriamente Coins o EXP entre 5 y 10
if (esGanador) {
    const premioCantidad = Math.floor(Math.random() * 6) + 5; // Número aleatorio entre 5 y 10
    const tipoPremio = Math.random() < 0.5 ? 'coins' : 'exp'; // 50% de probabilidad para cada tipo

    if (tipoPremio === 'coins') {
        await addkoin(sender, premioCantidad);
        premioTexto = `🎉 Recibiste ${premioCantidad} Coins 🪙.`;
    } else {
        await addXp(sender, premioCantidad);
        premioTexto = `📚 Recibiste ${premioCantidad} de EXP.`;
    }

    resultadoMensaje = "🎉 ¡Has ganado! 🎉";
}

// Construcción del mensaje de respuesta
const mensajeCasino = `
         *༻  𝙏𝙍𝘼𝙂𝘼𝙈𝙊𝙉𝙀𝘿𝘼𝙎 ༺*
            ┏━━━━┛🎰┗━━━━┓
             ||   【${filaArriba[0]}】【${filaArriba[1]}】【${filaArriba[2]}】   ||
           ◢◞───────────◟◣
        █ ||   【${filaCentro[0]}】【${filaCentro[1]}】【${filaCentro[2]}】   || █
           ◥◝───────────◜◤
             ||   【${filaAbajo[0]}】【${filaAbajo[1]}】【${filaAbajo[2]}】   ||
            ┗━━━━┓🎰┏━━━━┛
   🪙◆━━━━━━━▣✦▣━━━━━━━━◆🪙
Has gastado ${apuestas} Coin 🪙.
${resultadoMensaje}
${premioTexto}
`;

// Enviar el mensaje después de 3 segundos
setTimeout(() => {
    enviar(mensajeCasino);
}, 3000);

break;



case"dayli": case "daily":
if(!isGroup) return
if(!isReg) return 
const dayli = checkDayli(sender)
if(dayli) {
const ahora = Date.now()
const time = timeDayli(sender)
const result = ahora - time
const resultado = (0 - result) / 1000;
return sock.sendMessage(from,{text : `Espere ${runtime(resultado)} para su nueva recompensa`},{quoted : info})
} else {
const time = 24* 60* 60* 1000
await addDayli(sender,time)
const montoExperiencia = 5
const monto = 1
enviar(`
⏳🪙 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀 𝐃𝐈𝐀𝐑𝐈𝐀 🪙⏳

𝑮𝒂𝒏𝒂𝒔𝒕𝒆 ${monto} 𝑪𝒐𝒊𝒏𝒔 𝒚 ${montoExperiencia} 𝒅𝒆 𝑬𝒙𝒑𝒆𝒓𝒊𝒆𝒏𝒄𝒊𝒂.
`)
await addkoin(sender,monto)
await addXp(sender,montoExperiencia)
}
break

 

case 'reg': case 'registrarme': case 'registrame': case 'rg':
    if (isReg) return enviar(respuesta.yaregistro)
    const nombre = pushname
    await AddReg(sender, nombre)
    sock.sendMessage(from, {
        image: { url: JpgBot },
        caption: `★━━━━★━━━━★★━━━━★
         *༻  𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎  ༺*
🎉𝑅𝑒𝑔𝑖𝑠𝑡𝑟𝑜 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑎𝑑𝑜 *${nombre}* 🥳
🪙𝑹𝒆𝒄𝒊𝒃𝒊𝒔𝒕𝒆 *₹50 Rupias* 🪙 𝒄𝒐𝒎𝒐 𝑹𝒆𝒈𝒂𝒍𝒐 𝒅𝒆 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒂.
◆━━━━━━━▣✦▣━━━━━━━━◆`
    }, { quoted: info })
    break


case 'levelup': {
const XpR = xpOfsender(sender)
const Rxxp = Rxp(sender)
if(XpR >= Rxxp + 1000) {
await addLevel(sender , 1)
sleep(100)
await addkoin(sender,10)
sleep(100)
await addXp(sender,100)
sleep(100)
await addRxp(sender,1000)
const Mup = ` 
        ★━━━ 𝐒𝐔𝐁𝐈𝐒𝐓𝐄 𝐃𝐄 𝐍𝐈𝐕𝐄𝐋 ━━━★
✪ @${sender.split('@')[0]}
🎉 ¡𝑭𝒆𝒍𝒊𝒄𝒊𝒅𝒂𝒅𝒆𝒔 𝑯𝒂𝒛 𝒅𝒆𝒔𝒃𝒍𝒐𝒒𝒖𝒆𝒂𝒅𝒐 𝒖𝒏 𝒏𝒖𝒆𝒗𝒐 𝒓𝒂𝒏𝒈𝒐! 💪
`
sock.sendMessage(from,{text : Mup , mentions : [sender]},{quoted : info})
} else {
enviar(`
❌ 𝑬𝒙𝒑𝒆𝒓𝒊𝒆𝒏𝒄𝒊𝒂 𝒊𝒏𝒔𝒖𝒇𝒊𝒄𝒊𝒆𝒏𝒕𝒆. ${pushname} 𝒅𝒆𝒃𝒆𝒓𝒂𝒔 𝒆𝒏𝒕𝒓𝒆𝒏𝒂𝒓 𝒎𝒂𝒔 𝒔𝒆𝒈𝒖𝒊𝒅𝒐. 
`)
}
}
break




case 'minar' : {
if(!isReg) return enviar(respuesta.registro)
if(!isGroup) return enviar(respuesta.grupos)
const isMin = checkMinar(sender)
if(isMin) {
const ahora = Date.now()
const time = timeMinar(sender)
const result = ahora - time
const resultado = (0 - result) / 1000;
return enviar(`𝑪𝒉𝒂𝒎𝒃𝒆𝒂𝒏𝒅𝒐... ${runtime(resultado)} `)
} else {
const time = 24* 60* 60* 1000
await addMinar(sender,time)
const numbeR = [5, 6, 7, 8, 9, 10];
const randomIndex = Math.floor(Math.random() * numbeR.length);
const monto = numbeR[randomIndex];
enviar(`
               ★━━━ 𝐌𝐈𝐍𝐀𝐍𝐃𝐎... ━━━★
💰 Descubriste oro puro y obtuviste *₹${monto} Rupias* 
💬 ❝ 🌟 𝑮𝒓𝒂𝒄𝒊𝒂𝒔 𝒂𝒍 𝑮𝒓𝒆𝒎𝒊𝒐 𝒅𝒆 𝑴𝒊𝒏𝒆𝒓𝒐𝒔 ⛏ 𝒔𝒆 𝒈𝒂𝒓𝒂𝒏𝒕𝒊𝒛𝒂 𝑺𝒖𝒆𝒍𝒅𝒐 𝑴𝒊𝒏𝒊𝒎𝒐 𝒅𝒆 *₹5 Rupias* 🪙.❞

⏳ 𝑽𝒖𝒆𝒍𝒗𝒆 𝒆𝒏 24 𝒉𝒐𝒓𝒂𝒔.
`)
await addkoin(sender,monto)
}
}
break 


    case "ruleta": {
if (!q) return enviar(`Indique un monto para apostar, ejemplo .ruleta 4`);
if (!isReg) return enviar(respuesta.registro)
const montto = q
const monto = (montto * 1) / 1
if (isNaN(monto)) return enviar(`Indique un monto válido en coins`);
if (monto > MoneyOfSender(sender)) return enviar(`No tienes suficiente dinero`);
if (monto > 5) return enviar('La apuesta no debe ser mayor a 5 Rupias');
const isMinxxx = checkRuleta(sender)
if(isMinxxx) {
const ahora = Date.now()
const time = timeRuleta(sender)
const result = ahora - time
const resultado = (0 - result) / 1000;
return enviar(`Espere... ${runtime(resultado)} `)
} else {
const time = 24* 60* 60* 1000
await addRuleta(sender,time)
const ppt = ["muere", "vive"]; // Posibilidades
const pptb = ppt[Math.floor(Math.random() * ppt.length)];  // Elección aleatoria del sistema
let vit;

// Modo Duelo Letal
if (pptb === "muere") {
    vit = `💭「𝙍𝙖𝙯𝙚𝙧, 𝙚𝙡 𝙎𝙞𝙣 𝙈𝙞𝙚𝙙𝙤 🐺 𝙖𝙥𝙪𝙣𝙩𝙖 𝙖 𝙡𝙖 𝙘𝙖𝙗𝙚𝙯𝙖 𝙙𝙚 ${pushname} 😨🔫」
💭「𝙍𝙖𝙯𝙚𝙧 🐺 𝙖𝙥𝙧𝙚𝙩𝙖 𝙚𝙡 𝙜𝙖𝙩𝙞𝙡𝙡𝙤... 💥 𝘽𝙊𝙊𝙈!」
💭「${pushname} 𝙝𝙖 𝙘𝙖í𝙙𝙤 𝙮 𝙥𝙚𝙧𝙙𝙞ó ${monto} Rupias 🪙」`;
    await delkoin(sender, monto);
    // El jugador pierde
} else if (pptb === "vive") {
    vit = `💭「𝙍𝙖𝙯𝙚𝙧, 𝙚𝙡 𝙎𝙞𝙣 𝙈𝙞𝙚𝙙𝙤 🐺 𝙖𝙥𝙪𝙣𝙩𝙖 𝙖 𝙡𝙖 𝙘𝙖𝙗𝙚𝙯𝙖 𝙙𝙚 ${pushname} 😨🔫」
💭「𝙍𝙖𝙯𝙚𝙧 🐺 𝙖𝙥𝙧𝙚𝙩𝙖 𝙚𝙡 𝙜𝙖𝙩𝙞𝙡𝙡𝙤... 💥 𝘽𝙊𝙊𝙈!」
💭「𝙀𝙨 𝙪𝙣𝙖 𝙗𝙧𝙤𝙢𝙖, ${pushname} 𝙨𝙤𝙗𝙧𝙚𝙫𝙞𝙫𝙚 𝙮 𝙜𝙖𝙣𝙖 ${monto} Rupias 🪙」`;
    await addkoin(sender, monto);
    // El jugador gana
}

const datatt = `
╭━━━╾⭑✦  ✦⭑╼━━━╮
         ⌬ 𝙍𝙐𝙇𝙀𝙏𝘼 𝙍𝙐𝙎𝘼 ⌬
${vit}
⌛ 𝙑𝙪𝙚𝙡𝙫𝙚 𝙚𝙣 24 𝙝𝙤𝙧𝙖𝙨...
╰━━━╾⭑✦ ⬤ ✦⭑╼━━━╯
`;


enviar(datatt);
}
}
        break




case "pescar": {
if (q) return enviar(`no ponga ninguna palabra solo /pescar`);
if (!isReg) return enviar(respuesta.registro)
const isMinxxx = checkPescar(sender)
if(isMinxxx) {
const ahora = Date.now()
const time = timePescar(sender)
const result = ahora - time
const resultado = (0 - result) / 1000;
return enviar(`Espere... ${runtime(resultado)} `)
} else {
const time = 8 * 60 * 60 * 1000;
await addPescar(sender,time)
const ppt = ["delfin", "pulpo","pez","pez2","pez3","zapato"]; // Posibilidades
const pptb = ppt[Math.floor(Math.random() * ppt.length)];  // Elección aleatoria del sistema
let vit;

// Cazador Marino
if (pptb === "delfin") {
    vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🦈 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙜𝙖𝙣𝙖𝙨 20 𝙙𝙚 𝙀𝙓𝙋 📚」`;
    await addXp(sender, 20);
    // El jugador gana
} else if (pptb === "pulpo") {
    vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐙 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 8 𝙍𝙪𝙥𝙞𝙖𝙨 💎」`;
    await addkoin(sender, 8);
} else if (pptb === "pez") {
    vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐠 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 4 𝙍𝙪𝙥𝙞𝙖𝙨 💎 𝙮 5 𝙙𝙚 𝙀𝙓𝙋 📚」`;
    await addkoin(sender, 4);
    await addXp(sender, 5);
} else if (pptb === "pez2") {
    vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐟 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 3 𝙍𝙪𝙥𝙞𝙖𝙨 💎 𝙮 3 𝙙𝙚 𝙀𝙓𝙋 📚」`;
    await addkoin(sender, 3);
    await addXp(sender, 3);
} else if (pptb === "pez3") {
    vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐡 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 1 𝙍𝙪𝙥𝙞𝙖 💎 𝙮 2 𝙙𝙚 𝙀𝙓𝙋 📚」`;
    await addkoin(sender, 1);
    await addXp(sender, 2);
} else if (pptb === "zapato") {
    vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🥾 𝙮 𝙖𝙡 𝙩𝙧𝙖𝙩𝙖𝙧 𝙙𝙚 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯, 𝙚́𝙡 𝙨𝙚 𝙧𝙞𝙚 🤣 𝙙𝙚 𝙩𝙞 🥲」`;
}

const datatt = `
╔════ ⭑✦.   ✦⭑ ════╗
         ❖ 𝙋𝙀𝙎𝘾𝘼 𝙀𝙉 𝙀𝙇 𝙈𝘼𝙍 ❖
${vit}
⌛ 𝙑𝙪𝙚𝙡𝙫𝙚 𝙚𝙣 8 𝙝𝙤𝙧𝙖𝙨...
╚════ ⭑✦ ❖ ✦⭑ ════╝
`;


enviar(datatt);
}
}
        break







case 'listreg' : {
R_ = []
teks = '*REGISTRADOS* 😼\n'
for(let R of registro){
teks += `• @${R.id.split('@')[0]}\n`
R_.push(R.id)
}
teks += '• ' + registro.length
mentions(teks,R_,true)
}
break 




case 'regalar':
case 'tradecoin':
case 'tradecoins':
case 'enviarcoins':
case 'enviar': {
  if (!isGroup) return enviar("⚠️ Este comando solo funciona en grupos.");

  (async () => {
    try {
      const mencionado = obtenerMencionado(info); // destinatario
      const emisor = sender; // quien envía las monedas
      const monto = Number(args[1]);

      if (!mencionado) return enviar("⚠️ Debes mencionar a alguien para enviarle monedas.\nEj: .regalar @usuario 100");
      if (mencionado === emisor) return enviar("⚠️ No puedes enviarte monedas a ti mismo.");
      if (isNaN(monto) || monto <= 0) return enviar("⚠️ Ingresa una cantidad válida de monedas.\nEj: .regalar @usuario 100");

      const saldoEmisor = await MoneyOfM(emisor);
      if (saldoEmisor < monto) return enviar("❌ No tienes suficientes monedas para hacer esta transferencia.");

      // Realizar transferencia
      await delkoin(emisor, monto);
      await addkoin(mencionado, monto);
      await sleep(100);

      const nuevoSaldo = await MoneyOfM(emisor);
      enviar(`✅ Transferencia completada.\nUsted envió *₹${monto} Rupias.*`, {
        mentions: [emisor, mencionado]
      });
    } catch (e) {
      enviar('❌ Error: ' + e.message);
    }
  })();
}
break;









case 'rep' : case 'mirep' : case 'mireputacion':
if(!isReg) return enviar(respuesta.registro)
const myrep = repUser(sender)
const mitulamide30milimetros = `
╭━━━╾⭑✦REPUTACIÓN✦⭑╼━━━╮
𝑳𝒂 𝑹𝒆𝒑𝒖𝒕𝒂𝒄𝒊𝒐𝒏 𝒅𝒆 ${pushname} 𝒆𝒔 𝒅𝒆 ${myrep}.
`
if (myrep < 20) {
    await sock.sendMessage(from, {
        image: { url: "https://i.postimg.cc/NfJfvsBW/Untitled-05-12-2024-09-16-50-1.png" },
        caption: mitulamide30milimetros
    }, { quoted: info });
} else if (myrep >= 21 && myrep <= 40) {
    await sock.sendMessage(from, {
        image: { url: "https://i.postimg.cc/PxjdQNQ8/Untitled-05-12-2024-09-16-50-2.png" },
        caption: mitulamide30milimetros
    }, { quoted: info });
} else if (myrep >= 41 && myrep <= 60) {
    await sock.sendMessage(from, {
        image: { url: "https://i.postimg.cc/HL5pMbXg/Untitled-05-12-2024-09-16-50-3.png" },
        caption: mitulamide30milimetros
    }, { quoted: info });
} else if (myrep >= 61 && myrep <= 80) {
    await sock.sendMessage(from, {
        image: { url: "https://i.postimg.cc/brWX3NWB/IMG-20241223-WA0014.jpg" },
        caption: mitulamide30milimetros
    }, { quoted: info });
} else {
    await sock.sendMessage(from, {
        image: { url: "https://i.postimg.cc/Cx9hdcZ7/Untitled-05-12-2024-09-16-50-5.png" },
        caption: mitulamide30milimetros
    }, { quoted: info });
}

break 

case 'rank' : case 'rankrep' : 
if(!isGroup) return 
if(!isGroupAdmins) return enviar(respuesta.admin)
let teks2 = `
▭▬ ۞ ▬▛ ༼⁠ᘛ 𝑳𝒖𝒏𝒂-𝑩𝒐𝒕 ᘚ༽ ▜▬ ۞ ▬▭
*༻❦ 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐃𝐄 𝐑𝐄𝐏𝐔𝐓𝐀𝐂𝐈𝐎𝐍 ❦༺\n`;
registro.sort((a, b) => b.rep - a.rep) // Ordena de mayor a menor
       .slice(0, 10) // Toma solo los 10 primeros
       .forEach((usuario, indice) => {
           teks2 += `• 🚩Numero ${indice + 1}: *${usuario.nombre}* | *${usuario.rep}* de Reputación\n`;
       });
enviar(teks2)
break 

case 'rankcoins': {
  if (!isGroup) return;
  if(!isGroupAdmins) return enviar(respuesta.admin)
  const pathi = './settings/Grupo/Json/registros.json';

  // Leer los datos actualizados en el momento
  const registro = JSON.parse(fs.readFileSync(pathi, 'utf8'));

  let rankingMensaje = `*🏆 RANKING DE MILLONARIOS*\n\nTOP.  USUARIO.   RUPIAS\n\n`;

  // Convertir a array si registro es un objeto
  const rankingArray = Array.isArray(registro)
    ? registro
    : Object.entries(registro).map(([jid, data]) => ({
        nombre: data.nombre || jid.split('@')[0],
        dinero: data.dinero || 0,
      }));

  rankingArray
    .sort((a, b) => b.dinero - a.dinero)
    .slice(0, 10)
    .forEach((usuario, index) => {
      rankingMensaje += `• ${index + 1}. *${usuario.nombre}* ➫ _${usuario.dinero}_ Rupias\n`;
    });

  enviar(rankingMensaje);
}
break;




case 'ranknivel':{
if(!isGroup) return 
if(!isGroupAdmins) return enviar(respuesta.admin)
let teks = `
*RANKING DE NIVEL* :
TOP.   USUARIO.   NIVEL\n`
registro.sort((a,b) => b.nivel - a.nivel).forEach((usuario,index) => {
teks +=`• ${index + 1 }.     *${usuario.nombre}*  ➫  _*${usuario.nivel}*_\n`
});
enviar(teks)
}
break 

case "tienda":

if (!q) return enviar(`
✦━───༺༻───━✦
🎀❖ 𝓣𝓘𝓔𝓝𝓓𝓐 ❖🎀

🐾💬 "𝓑𝓲𝓮𝓷𝓿𝓮𝓷𝓲𝓭𝓸 𝓪 𝓵𝓪 𝓽𝓲𝓮𝓷𝓭𝓪 🌙"
━━━━━━━━━━━━━━━
🍀 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 1️⃣:
👉 *.tienda 1* 👈
🏷️ 50 𝓒𝓸𝓲𝓷𝓼 🪙 🔁 200 𝓔𝓧𝓟 📚

🌟 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 2️⃣:
👉 *.tienda 2* 5 Los dragones 👈
🏷️ 50 𝓒𝓸𝓲𝓷𝓼 🪙 🔁 𝓒𝓪𝓶𝓫𝓲𝓪 𝓷𝓸𝓶𝓫𝓻𝓮 𝓭𝓮 𝓻𝓪𝓷𝓰𝓸𝓼
( .𝓽𝓲𝓮𝓷𝓭𝓪 2 + 𝓷𝓲𝓿𝓮𝓵 𝓭𝓮 𝓻𝓪𝓷𝓰𝓸 + 𝓷𝓸𝓶𝓫𝓻𝓮𝓝𝓾𝓮𝓿𝓸 )

💎 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 3️⃣:
👉 *.emojimix 😇+😈* 👈
🏷️ 1 𝓒𝓸𝓲𝓷 🪙 🔁 𝓒𝓸𝓶𝓫𝓲𝓷𝓪 🌀 𝓮𝓶𝓸𝓳𝓲𝓼.

🎨 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 4️⃣:
👉 *.sticker* 👈
🏷️ 1 𝓒𝓸𝓲𝓷 🪙 🔁 𝓒𝓻𝓮𝓪 𝓼𝓽𝓲𝓬𝓴𝓮𝓻𝓼 𝓬𝓸𝓷 𝓯𝓸𝓽𝓸𝓼 𝓸 𝓖𝓘𝓕𝓼.

✦━───༺༻───━✦
`);


if (q.startsWith("1")) {
    if (coins < 50) return enviar("❌ No tienes suficientes Reales para hacer esta compra. Necesitas al menos 50 Rupias.");
    await delkoin(sender, 50);
    await addXp(sender, 200);

    return enviar(`🐱💬 Gracias ${pushname}, cambiaste 50 Rupias por 200 EXP.`);
}

if (q.startsWith("2")) {
    const args = q.split(" ");
    const nivel = parseInt(args[1]);
    const nuevoNombre = args.slice(2).join(" ");

    if (isNaN(nivel) || !nuevoNombre) {
        return enviar("❌ Usa el comando correctamente: .tienda 2 <nivel> <nuevo nombre>\nEjemplo: .tienda 2 8 Los Poderosos");
    }

    if (coins < 50) {
        return enviar("❌ No tienes suficientes Coins para cambiar el nombre del rango. Necesitas 50 Coins.");
    }

    const path = './settings/rangos.json';
    let rangosData;

    try {
        rangosData = JSON.parse(fs.readFileSync(path));
    } catch (e) {
        return enviar("⚠️ Error al leer los rangos. Asegúrate de que el archivo exista y esté bien formado.");
    }

    rangosData[nivel] = nuevoNombre;

    try {
        fs.writeFileSync(path, JSON.stringify(rangosData, null, 2));
        await delkoin(sender, 50);

        return enviar(`✅ ¡Perfecto, ${pushname}!\nHas cambiado el rango del nivel *${nivel}* a:\n✨ *${nuevoNombre}* ✨\nY se descontaron 50 Rupias 🪙`);
    } catch (e) {
        return enviar("⚠️ No se pudo guardar el nuevo nombre. Intenta de nuevo.");
    }
}

break;

//DESCARGAS
//nesecitas api
case 'play': case 'p':
    if (!q) return enviar(`- Ejemplo: !play nombre de la canción\nLa canción se descargará, solo elige audio o video. Si no se descarga, es posible que YouTube haya restringido la descarga, o algo similar.`);
    try {
        // Realizar la solicitud a la nueva API
        const response = await axios.get(`https://api.bronxyshost.com.br/api-bronxys/pesquisa_ytb`, {
            params: {
                nome: q,
                apikey: API_KEY_NAUFRA
            }
        });
        const data = response.data;

        // Verificar si el video es demasiado largo
        if (data[0]?.tempo?.length >= 7) return enviar("Lo siento, este video o audio es demasiado largo, no puedo realizar esta solicitud. Pide otra canción de menos de una hora.");

        // Crear el mensaje de respuesta
        const N_E = " No encontrado.";
        const caption = `
        ▧⃯⃟📝• 𝐓𝐢𝐭𝐮𝐥𝐨: ${data[0]?.titulo || N_E}
        ▧⃯⃟⏱️• 𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧: ${data[0]?.tempo || N_E}
        ▧⃯⃟🎚• 𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨: ${data[0]?.postado || N_E}
        ▧⃯⃟🛠• 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐜𝐢𝐨𝐧: ${data[0]?.desc || N_E}

        ■■■■■ 100% 

        εรρε૨ε µɳ ρσ૮σ...

        Si deseas descargar el video, usa !playvideo ${q.trim()}
        `;

        // Enviar la imagen con la información del video
        await sock.sendMessage(from, {image: {url: data[0]?.thumb || logoslink?.logo}, caption: caption}, {quoted: info});
        
        // Enviar el audio
        await sock.sendMessage(from, {audio: {url: `https://api.bronxyshost.com.br/api-bronxys/play?nome_url=${q}&apikey=${API_KEY_NAUFRA}`}, mimetype: "audio/mpeg", fileName: data[0]?.titulo || "play.mp3"}, {quoted: info}).catch(e => {
            return enviar("Error...");
        });

    } catch (e) {
        console.log(e);
        return enviar("No se pudo encontrar con tan poca información... / Error");
    }
break;


//nesecitas api
case 'playvideo': case 'pvid': case 'playmp4': 

{
    try {
        if (!q.trim()) return enviar(`- Ejemplo: !play nombre de la música\nLa música será descargada, solo debes elegir audio o video. Si no se descarga, es posible que YouTube haya restringido la descarga o haya algún otro problema.`);
        
        // Llamada a la nueva API del vendedor para buscar el video
        let data = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/pesquisa_ytb?nome=${q}&apikey=${API_KEY_NAUFRA}`);
        
        if (data[0]?.tempo?.length >= 7) return enviar("Lo siento, este video o audio es demasiado largo. No puedo procesar esta solicitud. Por favor, elige otra música que dure menos de una hora.");

        var N_E = " No encontrado.";
        var bla = `
🎙️⃤𝐓𝐢𝐭𝐮𝐥𝐨: ${data[0]?.titulo || N_E}
⏰⃤𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧: ${data[0]?.tempo || N_E}
📹⃤𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨: ${data[0]?.postado || N_E}
🗞️⃤𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐜𝐢𝐨𝐧: ${data[0]?.desc || N_E}

■■■■■ 100% 

Espere un poco...

Si deseas descargar el audio, usa !play ${q.trim()}
        `;
        
        // Enviar información sobre el video al usuario
        sock.sendMessage(from, {image: {url: data[0]?.thumb || logoslink?.logo}, caption: bla}, {quoted: info});
        
        // Enviar el video al usuario
        sock.sendMessage(from, {
            video: {url: `https://api.bronxyshost.com.br/api-bronxys/play_video?nome_url=${q}&apikey=${API_KEY_NAUFRA}`},
            mimetype: "video/mp4",
            fileName: data[0]?.titulo || "play.mp4"
        }, {quoted: info}).catch(e => {
            return enviar("Error al intentar descargar el video.");
        });

    } catch (e) {
        console.log(e);
        return enviar("No se pudo encontrar el contenido con la información proporcionada o hubo un error en la solicitud.");
    }
}
break;



//nesecitas api      
case 'tiktokvideo':
try {
    if(!q) return enviar('Por favor, proporciona un enlace de TikTok válido.');
    
    enviar("Procesando el video...");
    
    // Realiza la solicitud a la API
    let response = await fetch(`https://api.bronxyshost.com.br/api-bronxys/tiktok?url=${q}&apikey=${API_KEY_NAUFRA}`);
    
    // Verifica si la respuesta es JSON válida
    let contentType = response.headers.get("content-type");
    
    if(contentType && contentType.includes("application/json")) {
        // Procesa la respuesta como JSON
        let ABC = await response.json();
        enviar("No se pudo descargar el video. Por favor, intenta nuevamente.");
    } else {
        // Procesa la respuesta como un archivo binario
        let buffer = await response.buffer();
        sock.sendMessage(from, { video: buffer, mimetype: 'video/mp4' }, { quoted: info });
    }
} catch (e) {
    enviar("Ocurrió un error al intentar descargar el video.");
}
break;



//nesecitas api
case 'tiktokaudio':
try {
if(!q.includes("tiktok")) return enviar(`!tiktokaudio link de Tiktok`);
enviar("Realizando acción..");
sock.sendMessage(from, {audio: {url:`https://api.bronxyshost.com.br/api-bronxys/tiktok?url=${q}&apikey=${API_KEY_NAUFRA}`}, mimetype: "audio/mpeg"}, {quoted: info}).catch(e => {
console.log(e)
return enviar("Error..")
})
} catch (e) {
console.log(e)
return enviar("Error...");
}
break;


//nesecitas api
case 'buscarapk': 
; // Verificación si el usuario es premium
if (!q.trim()) return enviar(`Ejemplo: !buscarapk WhatsApp`); // Asegurarse de que haya una búsqueda

try {
    enviar('Espera un momento estoy enviando'); // Mensaje de espera
    let abc = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/aptoide_pesquisa?pesquisa=${q.trim()}&apikey=${API_KEY_NAUFRA}`); // Llamada a la API
    enviar(abc.aptoide || 'No se encontró ninguna información.'); // Respuesta con la información o mensaje de error
} catch (e) {
    console.log(e);
    return enviar(mess.error()); // Mensaje de error en caso de fallo
}
break;

//nesecitas api

case "descargarapk":
;
if (!q.trim().includes("aptoide.com")) return enviar(`Ejemplo: !descargarapk link de la aplicación\n\nUse el comando !buscarapk Ejemplo: whatsapp, y usted recibirá una url, pegue la url despues del comando para descargarla.`);
enviar('Espera un momento estoy enviando tu apk');
try {
    abc = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/aptoide?url=${q.trim()}&apikey=${API_KEY_NAUFRA}`);
    sock.sendMessage(from, {
        document: { url: abc.link },
        mimetype: "application/vnd.android.package-archive",
        fileName: abc.titulo
    }, { quoted: info }).catch((e) => console.log(e));
} catch (e) {
    console.log(e);
    return enviar("Error...");
}
break;



//Parejas


case 'alea': case 'casar' : case 'parejas':{
  if(!isReg) return enviar(respuesta.registro)
const men1 = groupMembers[Math.floor(Math.random() * groupMetadata.participants.length)]
const men3 = groupMembers[Math.floor(Math.random() * groupMetadata.participants.length)]
const men2 = men1.id
const men4 = men3.id
const rmen = `𝙰 @${men4.split('@')[0]} 𝙻𝙴 𝙶𝚄𝚂𝚃𝙰 @${men2.split('@')[0]} 𝚈 𝙳𝙴𝙱𝙴𝚁𝙸𝙰𝙽 𝙲𝙰𝚂𝙰𝚁𝚂𝙴`
sock.sendMessage(from,{text : rmen , mentions :[men4,men2]},{quoted : info})
}
break 





// COMANDOS SIN PREFIJO
default:


/// 🚫 ANTILINK MEJORADO CON DEPURACIÓN Y COMPATIBILIDAD LID/JID

const { jidNormalizedUser } = require("baileys")
const texto = (budy || "").toLowerCase()

if (isGroup && isAntiLink && !isGroupAdmins && !isOwner) {
  if (texto.includes(".com") || texto.includes("http://") || texto.includes("https://")) {
    console.log("⚠️ Enlace detectado:", texto)

    const groupMetadata = await sock.groupMetadata(from)
    const botIsAdmin = groupMetadata.participants.find(p => p.id === owner && p.admin)
    if (!isBotGroupAdmins) return enviar("⚠️ No soy administrador, no puedo expulsar.")

    const member = groupMetadata.participants.find(p => p.id === sender)
    if (!member) return console.log("⚠️ El usuario ya no está en el grupo.")

    const Kick = jidNormalizedUser(sender)
    console.log("👞 Intentando expulsar a:", Kick)

    try {
      console.log("🗑️ Eliminando mensaje...")
      await sock.sendMessage(from, { 
        delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } 
      })

      console.log("🚷 Expulsando usuario...")
      const result = await sock.groupParticipantsUpdate(from, [Kick], "remove")
      console.log("✅ Resultado expulsión:", result)

      await enviar(`🚫 Se detectó un link prohibido, el usuario @${sender.split("@")[0]} fue eliminado`, { mentions: [sender] })

    } catch (err) {
      console.log("❌ Error al ejecutar antilink:")
      console.log("Mensaje:", err.message)
      console.log("Stack completo:", err)
      await enviar(`⚠️ No se pudo expulsar a @${sender.split("@")[0]}.\nMotivo: ${err.message}`, { mentions: [sender] })
    }
  }
}



    
   if (budy.startsWith('=>Duueño')) {
    if (!isOwner) return enviar(respuesta.miowner)
        function Return(sul) {
             sat = JSON.stringify(sul, null, 2)
                  bang = util.format(sat)
                       if (sat == undefined) {
                            bang = util.format(sul)
                            }
                            enviar(bang)
                    }
                    try {
                        enviar(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                    } catch (e) {
                        enviar(String(e))
                    }
                }
                
                		      		      
              		      		      		      	
                		      		      		      		      		      		      		      		      
}
 
 } catch (e) {

 e = String(e)
if (!e.includes("this.isZero") && !e.includes("Could not find MIME for Buffer <null>") && !e.includes("Cannot read property 'conversation' of null") && !e.includes("Cannot read property 'contextInfo' of undefined") && !e.includes("Cannot set property 'mtype' of undefined") && !e.includes("jid is not defined")) {
console.log('Error : %s', color(e, 'red'))
}
 
 }   
 
 
 
 
 
 
        
    })


    
}
///////////MODIFIC INDEX 
startProo()
fs.watchFile('./index.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log(color('  [❗] El archivo Index fue modificada',"blue"));
process.exit()
}
})

