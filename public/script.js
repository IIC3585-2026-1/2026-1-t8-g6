const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const clearBtn = document.getElementById("clearBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let currentX = 0;
let currentY = 0;

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}`;

const ws = new WebSocket(wsUrl);

ws.onopen = function () {
  console.log("Conectado al servidor de WebSockets");
};

ws.onmessage = function (event) {
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'draw') {
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false);
    } else if (data.type === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  } catch (e) {
    console.error("Error procesando los datos:", e);
  }
};

ws.onclose = function () {
  console.log("Desconectado del servidor");
};

function drawLine(x0, y0, x1, y1, color, emit = false) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.closePath();

  if (!emit) return;

  const payload = JSON.stringify({
    type: 'draw',
    x0: x0,
    y0: y0,
    x1: x1,
    y1: y1,
    color: color
  });
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(payload);
  }
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  currentX = e.clientX;
  currentY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  
  drawLine(currentX, currentY, e.clientX, e.clientY, colorPicker.value, true);
  
  currentX = e.clientX;
  currentY = e.clientY;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseout", () => {
  isDrawing = false; 
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'clear' }));
  }
});