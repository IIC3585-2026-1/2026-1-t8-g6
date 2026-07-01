const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

console.log("Iniciando el servidor...");

wss.on("connection", function connection(ws) {
  console.log("Un cliente se ha conectado al servidor");

  ws.on("message", function incoming(message) {
    const data = message.toString();

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", function close() {
    console.log("Un cliente se ha desconectado");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor Web y WebSockets corriendo en puerto ${PORT}`);
  console.log(`Abre tu navegador en: http://localhost:${PORT}`);
});