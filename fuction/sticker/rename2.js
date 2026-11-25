const axios = require("axios")
const fs = require('fs-extra');
const {
imageToWebp2,
videoToWebp2,
writeExifImg2,
writeExifVid2
} = require('./exif2');
const getBuffer = (url, options) => new Promise(async (resolve, reject) => {
          options ? options : {}
          await axios({ method: "get", url, headers: { "DNT": 1, "Upgrade-Insecure-Request": 1 }, ...options, responseType: "arraybuffer" }).then((res) => {
            resolve(res.data)
          }).catch(reject)
        })

const sendImageAsSticker2 = async (sock, from, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
 let buffer;
 if (options && (options.packname || options.author)) {
buffer = await writeExifImg2(buff, options);
} else {
buffer = await imageToWebp2(buff);
}

await sock.sendMessage(from, {sticker: {url: buffer}, ...options}, {quoted})
return buffer;
};



const sendVideoAsSticker2 = async (sock, from, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
 let buffer;
 if (options && (options.packname || options.author)) {
buffer = await writeExifVid2(buff, options);
} else {
buffer = await videoToWebp2(buff);
}

await sock.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
return buffer;
}

module.exports = {
sendVideoAsSticker2,
sendImageAsSticker2
};