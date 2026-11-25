<h1 align="center">
✨🚀 <span style="color:#00FFAA;">NaufraBot V7</span> 🤖💚
</h1>

<p align="center">
  <img src="https://i.postimg.cc/V6bypf9B/20261123-102312.jpg" width="300" alt="NaufraBot V7" />
</p>


---

## 🧠 **¿Qué es NaufraBot V7?**

🔥 **NaufraBot V7** es una versión mejorada del clásico bot de WhatsApp, totalmente optimizado para funcionar 24/7 en cualquier servidor y completamente gratuito en termux, con **más comandos, rendimiento y estabilidad**.

- 🚀 Compatible con la última versión de **Baileys**
- 💬 Juegos RPG integrados
- 🧩 100% perzonalizable
- 📦 Descargas (videos, música, stickers)
- 🤖 Funciones con IA integradas
- 🛡️ Protección AntiLink y AntiSpam para tu grupo 

---

## 🌐 **Página NaufraBot Base (cuentas, NaufraCoins y PayPal)**

Abre la página `https://bot.naufrabot.com`. Ahí cada persona entra con **Google**, recibe **100 NaufraCoins**, conecta hasta **3 números** como bot y cambia su **nombre, foto, prefijo y API key**.

Nuevo comando: `/setclave TU_CLAVE` (dueño) guarda la API key desde WhatsApp.

---

## 🆕 **Actualización: stickers con sonido, gacha, vista única y Baileys rc14**

**🔊 Stickers con sonido (nuevo)** · `/stickersonido`
- Responde a un **video con sonido** y el bot hace un sticker que suena con ese mismo audio.
- Responde a una **foto, GIF o sticker** y luego manda un **audio o nota de voz** (máx. 10 s).
- Quien lo recibe toca el ícono 🔊 del sticker para escucharlo.

**🎴 Gacha de personajes** (traído del bot VIP, ahora con Rupias). Menú: `/menugacha`
`/rw` saca un personaje · `/claim` lo reclama (cuesta el valor del personaje en Rupias, 100 por defecto) · `/harem` · `/delchar` · `/sell` · `/wshop` · `/buyc` · `/givechar` · `/giveall` · `/trade` + `/aceptartrade` · `/votar` · `/wtop` · `/rankc`
- Personajes en `Games/Json/gacha/characters.json` (mismo formato del VIP). Trae la lista del VIP (2.134 personajes de 108 series). Si pones un `database/waifu/characters.json` en la carpeta del bot, se usa ese.
- Las imágenes se buscan solo como **aptas para todo público** (safebooru, danbooru `rating:g`). Gelbooru queda apagado hasta que pongas tu propia clave en `Games/Js/gacha.js`.
- Precios y esperas: arriba de `Games/Js/gacha.js`, en `CONFIG`.

**👁️ Vista única (nueva)**
- `/x9visuunica 1` (admins): el bot guarda cada vista única del grupo apenas llega, por 24 h.
- `/revelar` respondiendo a la vista única (admins o dueño). Ahora descarga y descifra el archivo, ya no manda el enlace cifrado que fallaba.
- `/s` respondiendo a una vista única hace el **sticker de vista única** (también fotos/videos de chats temporales).
- `/modoconexion android` (dueño): WhatsApp **no** entrega vistas únicas a "WhatsApp Web". En modo Android sí. Si después siguen llegando vacías, borra la carpeta `session` y vincula otra vez una sola vez. Para volver: `/modoconexion web`.

**📦 Baileys** fijado en `7.0.0-rc14` en `package.json`.

---

## 🎮 **Zona de juegos (para todo el mundo)**

Juegos de grupo con **animaciones en vivo** (el bot edita sus propios mensajes) y apuestas en Rupias. No necesitan API key ni instalar nada. Menú: `/menujuegos`

| Comando | Juego |
|---|---|
| `/duelo @alguien [apuesta]` | 🤠 Duelo del oeste: cuenta regresiva y gana el primero que escribe **BANG** (si dispara antes, pierde) |
| `/bomba [entrada]` | 💣 Papa caliente: entran escribiendo **yo**, la bomba se pasa con **pasar** y el último en pie gana la bolsa |
| `/carrera` | 🏇 Apuestas con `/apostar <1-5> <monto>`, carrera animada y podio. El ganador paga x4 |
| `/pelear [@alguien] [apuesta]` | 🥊 Batalla automática con barras de vida, críticos y esquivas |
| `/ttt [@alguien] [apuesta]` | ❌ Tres en raya (sin mencionar, juegas contra el bot) |
| `/conecta4 [@alguien] [apuesta]` | 🔴 Conecta 4 (sin mencionar, contra el bot) |
| `/cofre` | 🎁 Cofre misterioso cada 3 h: común, raro, épico, legendario o mítico |
| `/robar @alguien` | 🥷 45 % de robar hasta ₹50; si te atrapan, pagas multa a la víctima |
| `/cancelar` · `/rendirse` | Cancela (devuelve apuestas) o te rindes en un tablero |

Las jugadas se escriben **sin prefijo** (`acepto`, `bang`, `yo`, `pasar`, números del tablero). Por eso en `index.js` hay un bloque nuevo justo antes de `if (!isCmd) return;`. Todo el código está en `Games/Js/fiesta.js`.

---

## 🌸 **Edición temática: Remielle Dan + Dandy's World**

El menú principal ahora tiene el estilo de **Remielle Dan** (Zenless Zone Zero) y trae dos juegos completos que **no necesitan API key**:

| Menú | Juego |
|---|---|
| `/menujuegos` | Resumen de todos los juegos temáticos |
| `/menuzzz` | **Zenless Zone Zero:** ficha de Remielle, gacha `/senal` con pity de 90 y 50/50, `/hollow`, `/cazar` Etéreos, Bangboos, `/comision` diaria, `/rankzzz` |
| `/menudandy` | **Dandy's World:** bajar pisos con `/elevador`, llenar `/maquina`, huir de Twisteds con `/esconderse` o `/correr`, tienda de Toons, investigación, `/rankdandy` |
| `/trivia zzz` · `/trivia dandy` | Trivia por grupo, se responde con `/resp A` |
| `/canjear` | Cambia Dennies o Ichor por Rupias del bot (máx. ₹15 por día) |

Todos los juegos dan **XP** del sistema de niveles y piden estar registrado (`/reg`).

# 🔥INSTALACIÓN POR TERMUX.
* Instala el termux [aqui](https://f-droid.org/repo/com.termux_118.apk)

> [!NOTE]
> Copia los códigos uno por uno, no los pegues todos juntos a la vez. 👁️  
> Algunos comandos como las descargas necesitan una clave API para poder funcionar.  
> Puedes adquirir tu clave en nuestra página oficial:  
> 👉 [https://api.naufrabot.com](https://api.naufrabot.com)

```bash
pkg upgrade -y && pkg update -y && pkg install git -y && pkg install nodejs-lts -y && pkg install ffmpeg -y && pkg install nodejs -y && pkg install wget -y && pkg install tesseract -y
```

```bash
termux-setup-storage
```

```bash
cd /sdcard && git clone https://github.com/NaufraZapp/Naufrabot-base
```

```bash
cd Naufrabot-base
```

```bash
npm start
```

# 🔥INSTALACIÓN POR CLOUD SHELL.
* Instala el Cloud shell [aqui](https://www.mediafire.com/file/bp2l6cci2p30hjv/Cloud+Shell_1.apk/file)

> [!NOTE]
> Copia los códigos uno por uno, no los pegues todos juntos a la vez. 👁️  
> Algunos comandos como las descargas necesitan una clave API para poder funcionar.  
> Puedes adquirir tu clave en nuestra página oficial:  
> 👉 [https://api.naufrabot.com](https://api.naufrabot.com)

```bash
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y git ffmpeg tesseract-ocr wget && cd ~
git clone https://github.com/NaufraZapp/Naufrabot-base && cd Naufrabot-base
```

```bash
npm start
```

# 💥CONTÁCTAME💥

[![WhatsApp](https://img.shields.io/badge/mi_numero-00802f?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/51927339074) <img src="https://raw.githubusercontent.com/Bots-WhatsApp-OFC/Bots-WhatsApp-OFC/master/accesos/iconos/whatsapp.gif" width="30">

[![WhatsApp](https://img.shields.io/badge/Canal_de_WhatsApp-00802f?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vaz3WoQ6RGJPJQcMXQ14) <img src="https://raw.githubusercontent.com/Bots-WhatsApp-OFC/Bots-WhatsApp-OFC/master/accesos/iconos/whatsapp.gif" width="30">

[![YouTube](https://img.shields.io/badge/Canal_de_Youtube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@naufrazapp_bots?si=iZbDpSK_pqT9uXiW)

[![TikTok](https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white)](https://www.tiktok.com/@naufraofficial?_t=ZS-90ePBQwysYj&_r=1)
