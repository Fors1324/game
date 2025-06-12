const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let waitingPlayer = null;

io.on("connection", (socket) => {
  console.log("Um jogador entrou:", socket.id);

  if (waitingPlayer) {
    // Dois jogadores conectados: criar sala
    const room = `room-${waitingPlayer.id}-${socket.id}`;
    socket.join(room);
    waitingPlayer.join(room);

    io.to(room).emit("startGame", { room });

    // Remover jogador em espera
    waitingPlayer = null;
  } else {
    // Espera por outro jogador
    waitingPlayer = socket;
  }

  socket.on("play", (data) => {
    socket.to(data.room).emit("play", data);
  });

  socket.on("disconnect", () => {
    console.log("Jogador saiu:", socket.id);
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
