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
    const playersInfo = document.querySelectorAll('.player-info');
    const player1Info = document.querySelector('div[data-player="1"]');
    const player2Info = document.querySelector('div[data-player="2"]');
    const boardContainer = document.querySelector('.grid-background');
    const boardCells = document.querySelectorAll('.board-cell');
    const playerForm = document.querySelector('.player-form');
    const gameMessageScreen = document.querySelector('.game-message-screen');
    //const markerOptions = document.querySelectorAll('marker-option');
    const markerOptions = document.querySelectorAll('input[type="radio"]');
    const startButton = document.querySelector('.start-button');
    const restartButton = document.querySelector('.restart-button');
    const loaderCircle = document.querySelector('.loader-container');

    let onStart = null;
    let onRestart = null;
    let onFormSubmit = null;
    let onClickCell = null;

    const updatePlayerInfo = (playerIndex, player) => {
        playersInfo[playerIndex].children[0].classList.add(player.mark);
        playersInfo[playerIndex].children[1].textContent = player.name;
    }

    // const promptCreatePlayer = (playerNumber) => {
    //     return `Enter the name of player number ${playerNumber} to continue, if you want to play without a name, press enter to continue:`;
    // };

    // const promptForPlayer = (currentBoard, player) => {
    //     return `${player.name}, indicate the position number where you want to mark ${player.mark}\n
    //     | ${currentBoard[0] || "1"} | ${currentBoard[1] || "2"} | ${currentBoard[2] || "3"} |\n
    //     | ${currentBoard[3] || "4"} | ${currentBoard[4] || "5"} | ${currentBoard[5] || "6"} |\n
    //     | ${currentBoard[6] || "7"} | ${currentBoard[7] || "8"} | ${currentBoard[8] || "9"} |\n`
    // };

    const showPlayerForm = () => {
        gameMessageScreen.style.display = "none";
        startButton.style.display = "none";
        playerForm.style.display = "block";
        loaderCircle.style.display = "flex";
    };

    const showGameBoard = () => {
        playerForm.style.display = "none";
        loaderCircle.style.display = "none";
        boardContainer.style.display = "block";
        restartButton.style.display = "block";
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(playerForm);
        const playerData = {
            name: formData.get("name"),
            mark: formData.get("marker"),
        }
        event.target.reset();
        if (onFormSubmit) onFormSubmit(playerData);
    };

    const handlePlayerChoice = (event) => {
        if (onClickCell) onClickCell(event.target.dataset.index);
    };

    const showGameResults = (isThereMatch, gameWinner) => {
        if (isThereMatch) {
            const winnerMessage = `${gameWinner.name} has won the game.\nCongratulations!`;
            console.log(winnerMessage);
            // alert(winnerMessage);
            gameMessageScreen.children[0].textContent = winnerMessage;
        } else {
            const tieMessage = `The game ended in a tie, no one won.\nBetter luck next time.`;
            console.log(tieMessage);
            // alert(tieMessage);
            gameMessageScreen.children[0].textContent = tieMessage;
        }
        gameMessageScreen.style.display = "block";
    }

    // startButton.addEventListener("click", () => {
    //     showPlayerForm();
    //     if (onStart) onStart();
    // });
    startButton.addEventListener("click", showPlayerForm);
    restartButton.addEventListener("click", () => {
        alert("Work in progress... please refresh the page to play again, thanks for your patience!");
        if (onRestart) onRestart();
    });

    playerForm.addEventListener("submit", handleFormSubmit);

    boardCells.forEach(cell => {
        cell.addEventListener("click", handlePlayerChoice);
    });

    const disableMarkerOption = (marker) => {
        const btn = [...markerOptions].find(b => b.value === marker);
        if (btn) btn.disabled = true;
    };
    const updateGameBoard = (cellIndex, mark) => {
        const cell = [...boardCells].find(cell => cell.dataset.index === cellIndex);
        //if (cell) console.log(`I found the cell bro => ${cell.dataset.index} => mark:${mark}`);
        if (cell) cell.classList.add(mark);
    }
    const bindStart = (callback) => {
        onStart = callback;
    };
    const bindRestart = (callback) => {
        onRestart = callback;
    };
    const bindFormSubmit = (callback) => {
        onFormSubmit = callback;
    };
    const bindClickCell = (callback) => {
        onClickCell = callback;
    };
    return { updatePlayerInfo, showGameBoard, showGameResults, disableMarkerOption, updateGameBoard, bindStart, bindRestart, bindFormSubmit, binClickCell: bindClickCell };
})();

const gameController = (function (playerFactory, boardModule, displayCtrl) {
    let players = [];
    const randomMarks = ["arrow", "crow", "dog", "eagle", "square", "splatter", "paw", "star1", "star2", "wolf"];
    let playerTurn = true;
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

    const generateRandomMark = () => {
        if (players.length > 0) {
            const filteredList = randomMarks.filter(mark => mark !== players[players.length - 1].mark);
            return filteredList[Math.floor(Math.random() * filteredList.length)];
        } else {
            return randomMarks[Math.floor(Math.random() * randomMarks.length)];
        }
    };

    const handleFormSubmit = (playerData) => {
        players.push(playerFactory(playerData.name, playerData.mark === "random" ? generateRandomMark() : playerData.mark));
        displayCtrl.updatePlayerInfo(players.length - 1, players[players.length - 1]);
        // console.log(players);
        // console.log(players.length);
        if (players[players.length - 1].mark === "cross" || players[players.length - 1].mark === "circle") {
            displayCtrl.disableMarkerOption(players[players.length - 1].mark);
        }
        if (players.length === 2) {
            displayCtrl.showGameBoard();
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
        const player1WinningPattern = (players[0].mark).repeat(3);
        const player2WinningPattern = (players[1].mark).repeat(3);
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
                if (compareCurrentBoardData(patternGroup, player1WinningPattern)) {
                    gameWinner = players[0];
                    return true;
                }
            }
        } else {
            for (const patternGroup of Object.values(matches)) {
                if (compareCurrentBoardData(patternGroup, player2WinningPattern)) {
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
    }

    const checkPlayerChoice = (userChoice) => {
        if ((/^[0-8]$/).test(userChoice) && boardModule.getBoard()[userChoice] === "") {
            return true;
        }
        return false;
    }

    const playRound = (cellNumber) => {
        if (checkPlayerChoice(cellNumber)) {
            boardModule.setMark(cellNumber, playerTurn ? players[0].mark : players[1].mark);
            console.log(`Cell: ${cellNumber}, occupied!`);
            displayCtrl.updateGameBoard(cellNumber, playerTurn ? players[0].mark : players[1].mark);
            checkGameBoard(boardModule.getBoard());
            if (isThereMatch || isGameOver) {
                displayCtrl.showGameResults(isThereMatch, gameWinner);
            }
            playerTurn = !playerTurn;
        } else {
            console.log("Pick another cell bro...");
        }
    };

    displayCtrl.bindFormSubmit(handleFormSubmit);
    displayCtrl.binClickCell(playRound);
    // const playRound = () => {
    //     createPlayers();
    //     while (!isThereMatch && !isGameOver) {
    //         playerTurn = !playerTurn;
    //         let choice = prompt(displayCtrl.promptForPlayer(boardModule.getBoard(), playerTurn ? players[0] : players[1]));
    //         //Safe word to stop the game immediately
    //         if (choice === "goal") {
    //             return;
    //         };
    //         while (!checkPlayerChoice(choice)) {
    //             choice = prompt(`You must choose a valid and available option from 1 to 9\n${displayCtrl.promptForPlayer(boardModule.getBoard(), playerTurn ? players[0] : players[1])}`);
    //         }
    //         boardModule.setMark(choice - 1, playerTurn ? players[0].mark : players[1].mark);
    //         checkGameBoard(boardModule.getBoard());
    //     }
    //     displayCtrl.showGameResults(isThereMatch, gameWinner);
    // }

    //displayCtrl.bindStart(playRound);

    return { playRound };
})(Player, gameBoard, displayController);

//gameController.playRound();