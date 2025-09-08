const gameTestScreen = document.querySelector(".game-test-screen");

function addNewChild(parent, childContent, childType) {
    const newChild = document.createElement(!childType ? "p" : childType);
    newChild.textContent = childContent;
    parent.appendChild(newChild);
}

addNewChild(gameTestScreen, "So...");
addNewChild(gameTestScreen, "Tic");
addNewChild(gameTestScreen, "Tac");
addNewChild(gameTestScreen, "Toe");

//const boxGame = ["", "", "", "", "", "", "", "", ""];
//const boxGame = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let playerTurn = false;
let isThereMatch = false;
let isGameOver = false;
let gameWinner = "";

const Player = (name, mark) => {
    return { name, mark };
};

const gameBoard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setMark = (index, mark) => { board[index] = mark };


    return { getBoard, setMark };
})();

const displayController = (function () {
    const updateGameBoard = () => {
        //console.clear();
        let counter = 0;
        for (let index = 0; index < 3; index++) {
            let row = "";
            for (let indexB = 0; indexB < 3; indexB++) {
                if (indexB === 2) {
                    row += `${boxGame[counter]}`;
                } else {
                    row += `${boxGame[counter]} `;
                    row += "| ";
                }
                counter++;
            }
            console.log(row);
        }
        console.log("Updated! :)");
    }

    const showGameResults = () => {
        if (isThereMatch) {
            const winnerMessage = `${gameWinner} has won the game.\nCongratulations!`;
            console.log(winnerMessage);
            alert(winnerMessage);
        } else {
            const tieMessage = `The game ended in a tie, no one won.\nBetter luck next time.`;
            console.log(tieMessage);
            alert(tieMessage);
        }
    }
    return { updateGameBoard, showGameResults };
})();

const gameController = (function () {
    const compareCurrentBoardData = (currentBoardPatterns, patternToWin) => {
        for (const currentPattern of currentBoardPatterns) {
            if (currentPattern === patternToWin) {
                return true;
            }
        }
        return false;
    }
    const checkMatch = () => {
        const patternX = "XXX";
        const patternO = "OOO";
        const matches = {
            verticalMatches: [
                `${board[0]}${board[1]}${board[2]}`,
                `${board[3]}${board[4]}${board[5]}`,
                `${board[6]}${board[7]}${board[8]}`,
            ],
            horizontalMatches: [
                `${board[0]}${board[3]}${board[6]}`,
                `${board[1]}${board[4]}${board[7]}`,
                `${board[2]}${board[5]}${board[8]}`,
            ],
            diagonalMatches: [
                `${board[0]}${board[4]}${board[8]}`,
                `${board[2]}${board[4]}${board[6]}`,
            ],
        }

        for (const patternGroup of Object.values(matches)) {
            if (compareCurrentBoardData(patternGroup, patternX)) {
                gameWinner = "Player 1 playing with the mark X";
                return true;
            }
        }
        for (const patternGroup of Object.values(matches)) {
            if (compareCurrentBoardData(patternGroup, patternO)) {
                gameWinner = "Player 2 playing with the mark O";
                return true;
            }
        }
        return false;
    }

    const checkGameBoard = () => {
        isThereMatch = checkMatch();
        if (!board.includes("")) {
            isGameOver = true;
        }
        updateGameBoard();
    }

    const checkPlayerChoice = (userChoice) => {
        if ((/^[1-9]$/).test(userChoice) && board[userChoice - 1] === "") {
            return true;
        }
        return false;
    }
    const playRound = () => {
        while (!isThereMatch && !isGameOver) {
            playerTurn = !playerTurn;
            const markType = playerTurn ? "X" : "O";
            const promptForPlayer = `Player ${playerTurn ? "1" : "2"}, indicate the position number where you want to mark ${markType}\n
            | ${boxGame[0] || "1"} | ${boxGame[1] || "2"} | ${boxGame[2] || "3"} |\n
            | ${boxGame[3] || "4"} | ${boxGame[4] || "5"} | ${boxGame[5] || "6"} |\n
            | ${boxGame[6] || "7"} | ${boxGame[7] || "8"} | ${boxGame[8] || "9"} |\n`;
            let choice = prompt(promptForPlayer);
            //Safe word to stop the game immediately
            if (choice === "goal") {
                return;
            };
            while (!checkPlayerChoice(choice)) {
                choice = prompt(`You must choose a valid and available option from 1 to 9\n${promptForPlayer}`);
            }
            boxGame[choice - 1] = markType;
            checkGameBoard();
        }
        showGameResults();
    }
    return {};
})();

// function updateGameBoard() {
//     //console.clear();
//     let counter = 0;
//     for (let index = 0; index < 3; index++) {
//         let row = "";
//         for (let indexB = 0; indexB < 3; indexB++) {
//             if (indexB === 2) {
//                 row += `${boxGame[counter]}`;
//             } else {
//                 row += `${boxGame[counter]} `;
//                 row += "| ";
//             }
//             counter++;
//         }
//         console.log(row);
//     }
//     console.log("Updated! :)");
// }

// function compareCurrentGameData(currentTablePatterns, patternToWin) {
//     for (const currentPattern of currentTablePatterns) {
//         //console.log(`${currentPattern} === ${patternToWin} => ${currentPattern === patternToWin}`);
//         if (currentPattern === patternToWin) {
//             //console.log(`There's a pattern match!`);
//             return true;
//         }
//     }
//     return false;
// }

// function checkMatch() {
//     const patternX = "XXX";
//     const patternO = "OOO";
//     const matches = {
//         verticalMatches: [
//             `${boxGame[0]}${boxGame[1]}${boxGame[2]}`,
//             `${boxGame[3]}${boxGame[4]}${boxGame[5]}`,
//             `${boxGame[6]}${boxGame[7]}${boxGame[8]}`,
//         ],
//         horizontalMatches: [
//             `${boxGame[0]}${boxGame[3]}${boxGame[6]}`,
//             `${boxGame[1]}${boxGame[4]}${boxGame[7]}`,
//             `${boxGame[2]}${boxGame[5]}${boxGame[8]}`,
//         ],
//         diagonalMatches: [
//             `${boxGame[0]}${boxGame[4]}${boxGame[8]}`,
//             `${boxGame[2]}${boxGame[4]}${boxGame[6]}`,
//         ],
//     }

//     for (const patternGroup of Object.values(matches)) {
//         if (compareCurrentGameData(patternGroup, patternX)) {
//             gameWinner = "Player 1 playing with the mark X";
//             return true;
//         }
//     }
//     for (const patternGroup of Object.values(matches)) {
//         if (compareCurrentGameData(patternGroup, patternO)) {
//             gameWinner = "Player 2 playing with the mark O";
//             return true;
//         }
//     }
//     return false;
// }

// function checkGameBoard() {
//     isThereMatch = checkMatch();
//     if (!boxGame.includes("")) {
//         isGameOver = true;
//     }
//     updateGameBoard();
// }

// function checkPlayerChoice(userChoice) {
//     if ((/^[1-9]$/).test(userChoice) && boxGame[userChoice - 1] === "") {
//         return true;
//     }
//     return false;
// }

// function showGameResults() {
//     if (isThereMatch) {
//         const winnerMessage = `${gameWinner} has won the game.\nCongratulations!`;
//         console.log(winnerMessage);
//         alert(winnerMessage);
//     } else {
//         const tieMessage = `The game ended in a tie, no one won.\nBetter luck next time.`;
//         console.log(tieMessage);
//         alert(tieMessage);
//     }
// }

// function playRound() {
//     while (!isThereMatch && !isGameOver) {
//         playerTurn = !playerTurn;
//         const markType = playerTurn ? "X" : "O";
//         const promptForPlayer = `Player ${playerTurn ? "1" : "2"}, indicate the position number where you want to mark ${markType}\n
//             | ${boxGame[0] || "1"} | ${boxGame[1] || "2"} | ${boxGame[2] || "3"} |\n
//             | ${boxGame[3] || "4"} | ${boxGame[4] || "5"} | ${boxGame[5] || "6"} |\n
//             | ${boxGame[6] || "7"} | ${boxGame[7] || "8"} | ${boxGame[8] || "9"} |\n`;
//         let choice = prompt(promptForPlayer);
//         //Safe word to stop the game immediately
//         if (choice === "goal") {
//             return;
//         };
//         while (!checkPlayerChoice(choice)) {
//             choice = prompt(`You must choose a valid and available option from 1 to 9\n${promptForPlayer}`);
//         }
//         boxGame[choice - 1] = markType;
//         checkGameBoard();
//     }
//     showGameResults();
// }

//updateGameBoard();
//playRound();
console.log(gameBoard.getBoard()[0]);
gameBoard.setMark(0, "X");
gameBoard.setMark(8, "O");
gameBoard.setMark(4, "X");
gameBoard.setMark(1, "O");
console.log(gameBoard.getBoard()[0]);