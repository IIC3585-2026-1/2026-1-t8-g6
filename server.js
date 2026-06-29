const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", function connection(ws) {
  console.log("Un cliente se ha conectado al servidor");

  ws.on("message", function incoming(message) {
    const data = message.toString();
    console.log("Received: " + data);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", function close() {
    console.log("Disconnected from WebSocket server");
  });
});
