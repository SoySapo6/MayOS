# ✨ MayOS Terminal ✨

Bienvenido a **MayOS Terminal**, un sistema hecho con amor por **SoyMaycol <3**, que te permite ejecutar comandos reales en tiempo real con todo el flow de una terminal mágica y personalizada.

Este proyecto tiene **dos modos**: uno visual tipo consola estilo Linux y otro vía API tipo webserver para usarlo remotamente desde peticiones HTTP.

---

## ✨ Requisitos

- Node.js v18+ (ESM habilitado)
- Host compatible (Render, Replit, NekoHost, VPS, etc)
- Host sin bash/shell

---

## 🧠 Instalación (paso a paso)

> En Tu Host elije el repositorio:
```
https://github.com/SoySapo6/MayOS git
```

---

⚙️ Modo 1: Terminal visual (modo consola)

Este modo muestra una terminal falsa pero ejecuta comandos reales en tu consola, con mensajes bonitos y coloridos.

▶️ Para host tipo VPS, NekoHost, Replit o PC

```
npm install
```

```
npm run cmd
```
O Si estas en Host que usan de base a CtrlPanel Simplemente pon Instalación Automática.

Si todo sale Bien Verás algo así:

![MayOS Preview](https://files.catbox.moe/t1yz7o.png)

---

🌐 Modo 2: Servidor web (modo API)

Este modo levanta un servidor HTTP con un endpoint /cmd donde puedes enviar comandos para que se ejecuten en la terminal, pero NO devuelve la respuesta en la web, por seguridad y control.

▶️ Para host tipo Render, Vercel, Cyclic, etc.

Build Command
```
npm install
```

Start Command
```
npm run web
```

📡 Endpoint:

```
POST http://tu-web.com/cmd
```

🧾 Body JSON:

```
{
  "command": "ls"
}
```

✅ Respuesta:

```
{
  "status": "Comando recibido y ejecutándose"
}
```

⚠️ Importante

La respuesta del comando NO se muestra en la web.

Solo puedes verla en la terminal del host.

Usa CORS activado por defecto para permitir peticiones externas.



---

🧑‍💻 Autor

Creado con amor por SoyMaycol <3
Un niño programador con más flow que tu ISP.
