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
    const updateGameBoard = (currentBoard) => {
        //console.clear();
        let counter = 0;
        for (let index = 0; index < 3; index++) {
            let row = "";
            for (let indexB = 0; indexB < 3; indexB++) {
                if (indexB === 2) {
                    row += `${currentBoard[counter]}`;
                } else {
                    row += `${currentBoard[counter]} `;
                    row += "| ";
                }
                counter++;
            }
            console.log(row);
        }
        console.log("Updated! :)");
    }

    const promptCreatePlayer = (playerNumber) => {
        return `Enter the name of player number ${playerNumber} to continue, if you want to play without a name, press enter to continue:`;
    };

    const promptForPlayer = (currentBoard, player) => {
        return `${player.name}, indicate the position number where you want to mark ${player.mark}\n
        | ${currentBoard[0] || "1"} | ${currentBoard[1] || "2"} | ${currentBoard[2] || "3"} |\n
        | ${currentBoard[3] || "4"} | ${currentBoard[4] || "5"} | ${currentBoard[5] || "6"} |\n
        | ${currentBoard[6] || "7"} | ${currentBoard[7] || "8"} | ${currentBoard[8] || "9"} |\n`
    };

    const showGameResults = (isThereMatch, gameWinner) => {
        if (isThereMatch) {
            const winnerMessage = `${gameWinner.name} has won the game.\nCongratulations!`;
            console.log(winnerMessage);
            alert(winnerMessage);
        } else {
            const tieMessage = `The game ended in a tie, no one won.\nBetter luck next time.`;
            console.log(tieMessage);
            alert(tieMessage);
        }
    }
    return { updateGameBoard, promptCreatePlayer, promptForPlayer, showGameResults };
})();

const gameController = (function (playerFactory, boardModule, displayCtrl) {
    let players = [];
    let playerTurn = false;
    let isThereMatch = false;
    let isGameOver = false;
    let gameWinner = null;

    const createPlayers = () => {
        let playerName = "";
        for (let index = 1; index <= 2; index++) {
            if (index === 1) {
                playerName = prompt(displayCtrl.promptCreatePlayer(index));
                players.push(playerFactory(playerName || "Player 1", "X"));
            } else {
                playerName = prompt(displayCtrl.promptCreatePlayer(index));
                players.push(playerFactory(playerName || "Player 2", "O"));
            }
        }
    };

    const compareCurrentBoardData = (currentBoardPatterns, patternToWin) => {
        for (const currentPattern of currentBoardPatterns) {
            if (currentPattern === patternToWin) {
                return true;
            }
        }
        return false;
    }
    const checkMatch = (currentBoard) => {
        const patternX = "XXX";
        const patternO = "OOO";
        const matches = {
            horizontalMatches: [
                `${currentBoard[0]}${currentBoard[1]}${currentBoard[2]}`,
                `${currentBoard[3]}${currentBoard[4]}${currentBoard[5]}`,
                `${currentBoard[6]}${currentBoard[7]}${currentBoard[8]}`,
            ],
            verticalMatches: [
                `${currentBoard[0]}${currentBoard[3]}${currentBoard[6]}`,
                `${currentBoard[1]}${currentBoard[4]}${currentBoard[7]}`,
                `${currentBoard[2]}${currentBoard[5]}${currentBoard[8]}`,
            ],
            diagonalMatches: [
                `${currentBoard[0]}${currentBoard[4]}${currentBoard[8]}`,
                `${currentBoard[2]}${currentBoard[4]}${currentBoard[6]}`,
            ],
        }

        if (playerTurn) {
            for (const patternGroup of Object.values(matches)) {
                if (compareCurrentBoardData(patternGroup, patternX)) {
                    gameWinner = players[0];
                    return true;
                }
            }
        } else {
            for (const patternGroup of Object.values(matches)) {
                if (compareCurrentBoardData(patternGroup, patternO)) {
                    gameWinner = players[1];
                    return true;
                }
            }
        }

        return false;
    }

    const checkGameBoard = (currentBoard) => {
        isThereMatch = checkMatch(currentBoard);
        if (!currentBoard.includes("")) {
            isGameOver = true;
        }
        displayCtrl.updateGameBoard(currentBoard);
    }

    const checkPlayerChoice = (userChoice) => {
        if ((/^[1-9]$/).test(userChoice) && boardModule.getBoard()[userChoice - 1] === "") {
            return true;
        }
        return false;
    }
    const playRound = () => {
        createPlayers();
        while (!isThereMatch && !isGameOver) {
            playerTurn = !playerTurn;
            let choice = prompt(displayCtrl.promptForPlayer(boardModule.getBoard(), playerTurn ? players[0] : players[1]));
            //Safe word to stop the game immediately
            if (choice === "goal") {
                return;
            };
            while (!checkPlayerChoice(choice)) {
                choice = prompt(`You must choose a valid and available option from 1 to 9\n${displayCtrl.promptForPlayer(boardModule.getBoard(), playerTurn ? players[0] : players[1])}`);
            }
            boardModule.setMark(choice - 1, playerTurn ? players[0].mark : players[1].mark);
            checkGameBoard(boardModule.getBoard());
        }
        displayCtrl.showGameResults(isThereMatch, gameWinner);
    }
    return { playRound };
})(Player, gameBoard, displayController);

//gameController.playRound();