const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let jogadoresConectados = 0;

io.on("connection", (socket) => {
  jogadoresConectados++;
  console.log("🟢 Jogador conectado:", socket.id);
  io.emit("statusJogadores", jogadoresConectados);

  socket.on("jogada", (data) => {
    socket.broadcast.emit("jogada", data);
  });

  socket.on("disconnect", () => {
    jogadoresConectados--;
    console.log("🔴 Jogador desconectado:", socket.id);
    io.emit("statusJogadores", jogadoresConectados);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
