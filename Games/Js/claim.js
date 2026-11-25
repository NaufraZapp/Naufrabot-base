const fs = require('fs')
const JsonGamesClaim = `./Games/Json/claim.json`
const GameClaim = JSON.parse(fs.readFileSync(JsonGamesClaim))

const addClaim = ( sender , time ) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameClaim.push(obj)
fs.writeFileSync(JsonGamesClaim,JSON.stringify(GameClaim, null , 2)+'\n')
}

const checkClaim = (sender) => {
return GameClaim.some(i => i.user === sender)
}

const timeClaim = (sender) => {
let position = false
Object.keys(GameClaim).forEach((i) =>{
if(GameClaim[i].user === sender) {
position = i
}})
if(position !== false ){
return GameClaim[position].time
}}

const expiredClaim = () => {
setInterval(() => {
 const ahora = Date.now()
GameClaim.forEach((item , indice) => {
if(ahora >= item.time){
GameClaim.splice(indice , 1)
fs.writeFileSync(JsonGamesClaim,JSON.stringify(GameClaim,null,2)+'\n')
}
});
},5* 60* 1000); // verifica cada 5 min
}

module.exports = { addClaim , checkClaim , timeClaim ,expiredClaim }
