<h1 align="center">
✨🚀 <span style="color:#00FFAA;">NaufraBot V6</span> 🤖💚
</h1>

<p align="center">
  <img src="https://i.postimg.cc/rzXqHmYQ/20260823-215152.jpg" width="300" alt="NaufraBot V6" />
</p>


---

## 🧠 **¿Qué es NaufraBot V6?**

🔥 **NaufraBot V6** es una versión mejorada del clásico bot de WhatsApp, totalmente optimizado para funcionar 24/7 en cualquier servidor y completamente gratuito en termux, con **más comandos, rendimiento y estabilidad**.

- 🚀 Compatible con la última versión de **Baileys**
- 💬 Juegos RPG integrados
- 🧩 100% perzonalizable
- 📦 Descargas (videos, música, stickers)
- 🤖 Funciones con IA integradas
- 🛡️ Protección AntiLink y AntiSpam para tu grupo 

---

## 🆕 **Novedades de la V6**

### 👋 Bienvenidas y despedidas renovadas
- Ahora la **bienvenida** y la **despedida** se activan **por separado**: `/bienvenida 1/0` y `/despedida 1/0`
- Cada grupo puede poner **su propio texto**: `/setbienvenida` y `/setdespedida`
  - Variables: `{usuario}` `{grupo}` `{miembros}` `{descripcion}` `{hora}` `{fecha}`
- Cada grupo puede poner **su propia imagen**: `/setfotobienvenida` y `/setfotodespedida` (si el usuario tiene foto de perfil, se usa esa)
- Pruébalas sin esperar a que entre alguien: `/probarbienvenida` y `/probardespedida`
- `/resetbienvenida`, `/resetdespedida`, `/configbienvenida` y `/avisosadmin 1/0` (avisa cuando alguien sube o baja de admin)
- Arreglado: ya no hace falta que el bot sea admin para activarlas, los admins con LID ya son reconocidos, y si la imagen falla se envía el texto igual
- Los grupos que tenían `/welcome 1` en la V5 se pasan solos al sistema nuevo

### 🌐 Nuevos comandos con la API oficial ([api.naufrabot.com](https://api.naufrabot.com))
| Comando | Qué hace |
|---|---|
| `/hd` | Mejora una imagen a HD |
| `/removebg` | Quita el fondo de una imagen |
| `/imagine` | Crea imágenes con IA |
| `/llama` | Pregúntale a Llama IA |
| `/buscarsticker` | Busca stickers por nombre |
| `/attp4` `/attp5` `/attp6` | Más estilos de texto a sticker |
| `/clima` | Clima de cualquier ciudad |
| `/mareas` | Estado del mar y mareas |
| `/perfilff` | Perfil de Free Fire por UID |
| `/clanff` | Información de un clan de Free Fire |
| `/nivel` | Tarjeta de nivel con imagen |

Si el bot no tiene la clave puesta, estos comandos responden explicando cómo conseguirla.

### 🛠️ Correcciones
- `/attp`, `/attp2` y `/attp3` no funcionaban (el prefijo se colaba en la URL de la API)
- El **antilink** solo revisaba mensajes que empezaban con el prefijo; ahora revisa todos
- `/unbangp` daba error y no se podía usar dentro del grupo baneado
- La información de los grupos se quedaba guardada para siempre (si hacías admin al bot no lo notaba hasta reiniciar)

> [!TIP]
> Para `/hd`, `/removebg` y `/setfotobienvenida` el bot sube la imagen a internet. Funciona sin configurar nada (usa catbox.moe), pero si quieres puedes poner tu clave gratis de [imgbb.com](https://imgbb.com) en `IMGBB_KEY` dentro de `settings/settings.json`.

---

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
