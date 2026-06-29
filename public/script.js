const ws = new WebSocket("ws://localhost:8080");

ws.onopen = function () {
  console.log("Connected to WebSocket server");
  ws.send("Hello, WebSocket server!");
};

ws.onmessage = function (event) {
  console.log("Received: " + event.data);
};

ws.onclose = function () {
  console.log("Disconnected from WebSocket server");
};
