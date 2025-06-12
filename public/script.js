const socket = io();
const tabuleiro = document.getElementById("tabuleiro");
const statusEl = document.getElementById("status");

let simbolo = "X"; // alterna entre X e O
let podeJogar = true;

// Atualiza status de jogadores
socket.on("statusJogadores", (total) => {
  if (total < 2) {
    statusEl.textContent = `🕹️ Aguardando jogadores: ${total}/2`;
    podeJogar = false;
  } else {
    statusEl.textContent = `✅ Ambos conectados! Comece a jogar!`;
    podeJogar = true;
  }
});

// Clique na célula
tabuleiro.addEventListener("click", (e) => {
  const celula = e.target;
  if (!celula.classList.contains("celula") || celula.textContent || !podeJogar) return;

  celula.textContent = simbolo;
  socket.emit("jogada", {
    pos: celula.dataset.pos,
    simbolo: simbolo
  });

  simbolo = simbolo === "X" ? "O" : "X";
});

// Recebe jogada do outro jogador
socket.on("jogada", (data) => {
  const celula = document.querySelector(`.celula[data-pos='${data.pos}']`);
  if (celula && !celula.textContent) {
    celula.textContent = data.simbolo;
  }
});
