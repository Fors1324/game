const socket = io();
const board = document.getElementById("board");
const statusDiv = document.getElementById("status");

let symbol = "X";
let myTurn = false;
let room = null;

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => {
      if (myTurn && cell.textContent === "") {
        cell.textContent = symbol;
        myTurn = false;
        statusDiv.textContent = "Vez do oponente";
        socket.emit("play", {
          room,
          index: i,
          symbol,
        });
      }
    });
    board.appendChild(cell);
  }
}

socket.on("startGame", (data) => {
  room = data.room;
  symbol = "X";
  myTurn = true;
  statusDiv.textContent = "Seu turno!";
  createBoard();
});

socket.on("play", (data) => {
  const cells = document.querySelectorAll(".cell");
  cells[data.index].textContent = data.symbol === "X" ? "O" : "X";
  myTurn = true;
  statusDiv.textContent = "Seu turno!";
});
