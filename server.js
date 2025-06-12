const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Evento de conexão WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Usuário conectado:", socket.id);

  socket.on("jogada", (data) => {
    // Envia jogada para todos os outros clientes
    socket.broadcast.emit("jogada", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado:", socket.id);
  });
});

// Inicia o servidor na porta fornecida pela Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
