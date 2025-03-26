let gridItems = document.getElementsByClassName("square");
let currentTurn = "X";
let gameIsFinished = false;
let scores = { X: 0, O: 0 };
let isSinglePlayer = true; 

let boardArray = [
    "0", "1", "2",
    "3", "4", "5",
    "6", "7", "8"
];


function updateLeaderboard() {
    document.getElementById("score-x").innerText = scores.X;
    document.getElementById("score-o").innerText = scores.O;
}

document.addEventListener("DOMContentLoaded", function () {
    updateLeaderboard();
});

for (const item of gridItems) {
    item.addEventListener("click", function () {
        if (gameIsFinished || (isSinglePlayer && currentTurn === "O")) return;

        let value = item.getAttribute("value");
        let index = value - 1;

        if (boardArray[index] === "X" || boardArray[index] === "O") {
            return;
        }

        makeMove(index, currentTurn);

        if (!gameIsFinished && isSinglePlayer && currentTurn === "O") {
            setTimeout(computerMove, 500); 
        }
    });
}


function makeMove(index, player) {
    let squareContent = document.querySelector(`.square[value="${index + 1}"]`);
    squareContent.innerText = player;
    squareContent.style.transform = "scale(1.2)";
    setTimeout(() => squareContent.style.transform = "scale(1)", 200);

    boardArray[index] = player;
    evaluateBoard();

    if (!gameIsFinished) {
        currentTurn = currentTurn === "X" ? "O" : "X";
        document.getElementById("instruction").innerText = `${currentTurn} turn`;
    }
}


function computerMove() {
    let bestMove = findBestMove();
    if (bestMove !== -1) {
        makeMove(bestMove, "O");
    }
}


function findBestMove() {
   
    for (let i = 0; i < 9; i++) {
        if (boardArray[i] !== "X" && boardArray[i] !== "O") {
            boardArray[i] = "O";
            if (checkWin("O")) {
                boardArray[i] = i.toString();
                return i;
            }
            boardArray[i] = i.toString();
        }
    }

 
    for (let i = 0; i < 9; i++) {
        if (boardArray[i] !== "X" && boardArray[i] !== "O") {
            boardArray[i] = "X";
            if (checkWin("X")) {
                boardArray[i] = i.toString(); 
                return i;
            }
            boardArray[i] = i.toString();
        }
    }


    let availableMoves = boardArray.filter(cell => cell !== "X" && cell !== "O");
    if (availableMoves.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableMoves.length);
        return parseInt(availableMoves[randomIndex]);
    }

    return -1; 
}


function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];

    return winPatterns.some(pattern => 
        boardArray[pattern[0]] === player &&
        boardArray[pattern[1]] === player &&
        boardArray[pattern[2]] === player
    );
}


function evaluateBoard() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];

    for (const pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (boardArray[a] === boardArray[b] && boardArray[b] === boardArray[c]) {
            gameIsFinished = true;
            scores[boardArray[a]]++;
            updateLeaderboard();
            highlightWinningPattern(pattern);
            alertify.success(`${boardArray[a]} Won! 🎉`);
            return;
        }
    }

    if (!boardArray.includes("0") && !boardArray.includes("1") && !boardArray.includes("2") &&
        !boardArray.includes("3") && !boardArray.includes("4") && !boardArray.includes("5") &&
        !boardArray.includes("6") && !boardArray.includes("7") && !boardArray.includes("8")) {
        gameIsFinished = true;
        alertify.error("Draw! 🤝");
    }
}


function highlightWinningPattern(pattern) {
    for (let index of pattern) {
        let square = document.querySelector(`.square[value="${index + 1}"]`);
        square.style.backgroundColor = "#4CAF50";
    }
}


document.getElementById("reset-btn").addEventListener("click", function () {
    reset();
});

function reset() {
    for (const item of gridItems) {
        let value = item.getAttribute("value");
        let squareContent = document.querySelector(`.square[value="${value}"]`);
        squareContent.innerText = "";
        squareContent.style.backgroundColor = "";
    }
    boardArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    gameIsFinished = false;
    currentTurn = "X";
    document.getElementById("instruction").innerText = `${currentTurn} turn`;
}
