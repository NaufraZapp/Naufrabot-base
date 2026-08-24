const fs = require('fs')
const JsonMining = './Games/Json/mining.json';
const GameMinar = JSON.parse(fs.readFileSync(JsonMining))
const JsonCasino =  './Games/Json/casino.json';
const JsonPescar =  './Games/Json/pescar.json';
const GameCasino = JSON.parse(fs.readFileSync(JsonCasino))
const GamePescar = JSON.parse(fs.readFileSync(JsonPescar))
//dayli

//tragacoins
const JsonTraga = './Games/Json/tragaperras.json';
const GameTraga = JSON.parse(fs.readFileSync(JsonTraga));

const JsonDayli =  './Games/Json/dayli.json';
const GameDayli = JSON.parse(fs.readFileSync(JsonDayli))

// ruleta
const JsonRuleta =  './Games/Json/ruleta.json';
const GameRuleta = JSON.parse(fs.readFileSync(JsonRuleta))

// Eve
const JsonEve =  './Games/Json/eve.json';
const GameEve = JSON.parse(fs.readFileSync(JsonEve))

// Emoji+
const JsonEmoji =  './Games/Json/emoji.json';
const GameEmoji = JSON.parse(fs.readFileSync(JsonEmoji))

// Attp
const JsonAttp =  './Games/Json/attp.json';
const GameAttp = JSON.parse(fs.readFileSync(JsonAttp))

// dayli

const addDayli = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameDayli.push(obj)
fs.writeFileSync(JsonDayli , JSON.stringify(GameDayli, null , 2)+'\n')
}


//

const addMinar = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameMinar.push(obj)
fs.writeFileSync(JsonMining , JSON.stringify(GameMinar, null , 2)+'\n')
}
// Ruleta
const addRuleta = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameRuleta.push(obj)
fs.writeFileSync(JsonRuleta , JSON.stringify(GameRuleta, null , 2)+'\n')
}

// Eve
const addEve = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameEve.push(obj)
fs.writeFileSync(JsonEve , JSON.stringify(GameEve, null , 2)+'\n')
}

// Emoji +
const addEmoji = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameEmoji.push(obj)
fs.writeFileSync(JsonEmoji , JSON.stringify(GameEmoji, null , 2)+'\n')
}

// Attp
const addAttp = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameAttp.push(obj)
fs.writeFileSync(JsonAttp , JSON.stringify(GameAttp, null , 2)+'\n')
}

//
const addCasino = (sender , time) => {
const obj = {
user : sender,
time : Date.now() + time
}
GameCasino.push(obj)
fs.writeFileSync(JsonCasino , JSON.stringify(GameCasino, null , 2)+'\n')
}


const addPescar = (sender , time) => {
  if (!sender || typeof time !== 'number') return; // Validación básica
  const obj = {
    user: sender,
    time: Date.now() + time
  };
  GamePescar.push(obj);
  fs.writeFileSync(JsonPescar, JSON.stringify(GamePescar, null , 2) + '\n');
};



//
const checkDayli = (sender) => {
return GameDayli.some(i => i.user === sender)
}
//
const checkMinar = (sender) => {
return GameMinar.some(i => i.user === sender)
}
// 
const checkRuleta = (sender) => {
return GameRuleta.some(i => i.user === sender)
}

//tragacois
// ✅ Agregar tiempo de espera
const addClaimTraga = (sender, time) => {
    const index = GameTraga.findIndex(i => i.user === sender);
    const nuevoTiempo = Date.now() + time;

    if (index !== -1) {
        GameTraga[index].time = nuevoTiempo;
    } else {
        GameTraga.push({ user: sender, time: nuevoTiempo });
    }

    fs.writeFileSync(JsonTraga, JSON.stringify(GameTraga, null, 2) + '\n');
};


// ✅ Verificar si ya reclamó
const checkClaimTraga = (sender) => {
    const user = GameTraga.find(i => i.user === sender);
    if (!user) return false;
    return user.time > Date.now(); // solo si todavía está dentro del tiempo de espera
};


// ✅ Obtener el tiempo de espera restante
const timeClaimTraga = (sender) => {
    const data = GameTraga.find(i => i.user === sender);
    return data ? data.time : 0;
};


//
const checkEve = (sender) => {
return GameEve.some(i => i.user === sender)
}

const checkPescar = (sender) => {
return GamePescar.some(i => i.user === sender)
}

//

const checkEmoji = (sender) => {
return GameEmoji.some(i => i.user === sender)
}



//
const checkAttp = (sender) => {
return GameAttp.some(i => i.user === sender)
}

//

const checkCasino = (sender) => {
return GameCasino.some(i => i.user === sender)
}

//
const timeDayli = (sender) => {
let position = false
Object.keys(GameDayli).forEach((i) => {
if(GameDayli[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameDayli[position].time
}
}

const timePescar = (sender) => {
  const userData = GamePescar.find(i => i.user === sender);
  return userData ? userData.time : 0;
};


//

const timeMinar = (sender) => {
let position = false
Object.keys(GameMinar).forEach((i) => {
if(GameMinar[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameMinar[position].time
}
}

// 
const timeRuleta = (sender) => {
let position = false
Object.keys(GameRuleta).forEach((i) => {
if(GameRuleta[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameRuleta[position].time
}
}





///
const timeEve = (sender) => {
let position = false
Object.keys(GameEve).forEach((i) => {
if(GameEve[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameEve[position].time
}
}





//

const timeEmoji = (sender) => {
let position = false
Object.keys(GameEmoji).forEach((i) => {
if(GameEmoji[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameEmoji[position].time
}
}


const timeCasino = (sender) => {
let position = false
Object.keys(GameCasino).forEach((i) => {
if(GameCasino[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameCasino[position].time
}
}


///


const timeAttp = (sender) => {
let position = false
Object.keys(GameAttp).forEach((i) => {
if(GameAttp[i].user === sender) {
position = i
}}) 
if(position !== false){
return GameAttp[position].time
}
}

const expiredRuleta = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameRuleta.forEach((item , indice) => {
if(ahora >= item.time ) {
GameRuleta.splice(indice,1)
fs.writeFileSync(JsonRuleta, JSON.stringify(GameRuleta,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}



//
const expiredPescar = () => {
  setInterval(() => {
    const ahora = Date.now();
    const activos = GamePescar.filter(item => ahora < item.time);
    if (activos.length !== GamePescar.length) {
      GamePescar.length = 0;
      GamePescar.push(...activos);
      fs.writeFileSync(JsonPescar, JSON.stringify(GamePescar, null, 2) + '\n');
    }

  },1 * 60 * 1000); // cada 1 minuto
};


//
const expiredEve = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameEve.forEach((item , indice) => {
if(ahora >= item.time ) {
GameEve.splice(indice,1)
fs.writeFileSync(JsonEve, JSON.stringify(GameEve,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}

const expiredDayli = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameDayli.forEach((item , indice) => {
if(ahora >= item.time ) {
GameDayli.splice(indice,1)
fs.writeFileSync(JsonDayli, JSON.stringify(GameDayli,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}

const expiredEmoji = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameEmoji.forEach((item , indice) => {
if(ahora >= item.time ) {
GameEmoji.splice(indice,1)
fs.writeFileSync(JsonEmoji, JSON.stringify(GameEmoji,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}

//
const expiredAttp = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameAttp.forEach((item , indice) => {
if(ahora >= item.time ) {
GameAttp.splice(indice,1)
fs.writeFileSync(JsonAttp, JSON.stringify(GameAttp,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}

const expiredMinar = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameMinar.forEach((item , indice) => {
if(ahora >= item.time ) {
GameMinar.splice(indice,1)
fs.writeFileSync(JsonMining, JSON.stringify(GameMinar,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}

const expiredCasino = (sender) => {
setInterval(() => {
const ahora = Date.now()
GameCasino.forEach((item , indice) => {
if(ahora >= item.time ) {
GameCasino.splice(indice,1)
fs.writeFileSync(JsonCasino, JSON.stringify(GameCasino,null, 2)+'\n')
}
});
},1* 60 * 1000) // verifica cada 5 min
}

module.exports = { checkCasino,checkAttp,checkEmoji,checkEve, timeClaimTraga, addClaimTraga, checkClaimTraga, checkRuleta,checkMinar,addCasino,addAttp,addEmoji,addEve,addRuleta ,addMinar,expiredCasino,expiredMinar,expiredAttp,expiredEmoji,expiredEve,expiredRuleta,timeAttp,timeEmoji,timeEve,timeRuleta,timeMinar,timeCasino,expiredDayli,JsonDayli,addDayli,timeDayli,checkDayli,expiredPescar,checkPescar,addPescar,timePescar}
