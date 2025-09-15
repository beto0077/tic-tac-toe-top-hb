const Player = (name, mark) => {
    let roundsWon = 0;

    const increaseRoundsWon = () => roundsWon++;
    const getRoundsWon = () => roundsWon;

    return { name, mark, increaseRoundsWon, getRoundsWon };
};

const gameBoard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setMark = (index, mark) => { board[index] = mark };


    return { getBoard, setMark };
})();

const displayController = (function () {
    // ========================
    // Private state & DOM refs
    // ========================
    const playersInfo = document.querySelectorAll('.player-info');
    const boardContainer = document.querySelector('.grid-background');
    const boardCells = document.querySelectorAll('.board-cell');
    const playerForm = document.querySelector('.player-form');
    const gameMessageScreen = document.querySelector('.game-message-screen');
    const markerOptions = document.querySelectorAll('input[type="radio"]');
    const startButton = document.querySelector('.start-button');
    const restartButton = document.querySelector('.restart-button');
    const gameStats = document.querySelector('.game-stats');
    const loaderCircle = document.querySelector('.loader-container');

    let onRestart = null;
    let onFormSubmit = null;
    let onClickCell = null;

    // ========================
    // Private functions
    // ========================
    const showPlayerForm = () => {
        gameMessageScreen.style.display = "none";
        startButton.style.display = "none";
        playerForm.style.display = "block";
        loaderCircle.style.display = "flex";
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
    const resetGameBoard = () => {
        boardCells.forEach(cell => {
            cell.className = "board-cell";
        });
        gameMessageScreen.children[0].children[0].className = "winner-marker";
        gameMessageScreen.style.display = "none";
        restartButton.style.display = "none";
        if (onRestart) onRestart();
    };

    // ========================
    // Public API (binders)
    // ========================
    const bindFormSubmit = (callback) => {
        onFormSubmit = callback;
    };
    const bindClickCell = (callback) => {
        onClickCell = callback;
    };
    const bindRestart = (callback) => {
        onRestart = callback;
    };

    // ========================
    // Public API (operations)
    // ========================
    const updatePlayerInfo = (playerIndex, player) => {
        playersInfo[playerIndex].children[0].classList.add(player.mark);
        playersInfo[playerIndex].children[1].textContent = player.name;
    };
    const disableMarkerOption = (marker) => {
        const btn = [...markerOptions].find(b => b.value === marker);
        if (btn) btn.disabled = true;
    };
    const showGameBoard = () => {
        playerForm.style.display = "none";
        loaderCircle.style.display = "none";
        boardContainer.style.display = "block";
        gameStats.style.display = "flex";
    };
    const updateGameBoard = (cellIndex, mark) => {
        const cell = [...boardCells].find(cell => cell.dataset.index === cellIndex);
        if (cell) cell.classList.add(mark);
    };
    const updatePlayerTurn = (playerTurn, isThereMatch, isGameOver) => {
        const hasActiveClass = playersInfo[0].classList.contains('player-turn') || playersInfo[1].classList.contains('player-turn');

        if (hasActiveClass) {
            if (isThereMatch || isGameOver) {
                playersInfo[playerTurn ? 0 : 1].classList.toggle('player-turn');
            } else {
                playersInfo[0].classList.toggle('player-turn');
                playersInfo[1].classList.toggle('player-turn');
            }
        } else {
            playersInfo[playerTurn ? 0 : 1].classList.toggle('player-turn');
        }
    };
    const showGameResults = (isThereMatch, gameWinner) => {
        if (isThereMatch) {
            const winnerMessage = `${gameWinner.name} has won the game.\nCongratulations!`;
            gameMessageScreen.children[0].children[0].classList.add(gameWinner.mark);
            gameMessageScreen.children[0].children[1].textContent = winnerMessage;
        } else {
            const tieMessage = `The game ended in a tie, no one won.\nBetter luck next time.`;
            gameMessageScreen.children[0].children[1].textContent = tieMessage;
        }
        gameMessageScreen.style.display = "block";
        restartButton.style.display = "block";
    };
    const updateGameStats = (players, tiedRounds) => {
        gameStats.children[1].textContent = `${players[0].name}: ${players[0].getRoundsWon()}`;
        gameStats.children[2].textContent = `${players[1].name}: ${players[1].getRoundsWon()}`;
        gameStats.children[3].textContent = `Tied rounds: ${tiedRounds}`;
    };

    // ========================
    // Event listeners
    // ========================
    startButton.addEventListener("click", showPlayerForm);
    playerForm.addEventListener("submit", handleFormSubmit);
    boardCells.forEach(cell => {
        cell.addEventListener("click", handlePlayerChoice);
    });
    restartButton.addEventListener("click", resetGameBoard);

    return { bindFormSubmit, bindClickCell, bindRestart, updatePlayerInfo, disableMarkerOption, showGameBoard, updateGameBoard, updatePlayerTurn, showGameResults, updateGameStats };
})();

const gameController = (function (playerFactory, boardModule, displayCtrl) {
    // ========================
    // Private state
    // ========================
    const randomMarks = ["arrow", "crow", "dog", "eagle", "square", "splatter", "paw", "star1", "star2", "wolf"];
    let players = [];
    let playerTurn = true;
    let isThereMatch = false;
    let isGameOver = false;
    let gameWinner = null;
    let tiedRounds = 0;

    // ========================
    // Private functions
    // ========================
    const generateRandomMark = () => {
        if (players.length > 0) {
            const filteredList = randomMarks.filter(mark => mark !== players[players.length - 1].mark);
            return filteredList[Math.floor(Math.random() * filteredList.length)];
        } else {
            return randomMarks[Math.floor(Math.random() * randomMarks.length)];
        }
    };

    const createPlayers = (playerData) => {
        players.push(playerFactory(playerData.name, playerData.mark === "random" ? generateRandomMark() : playerData.mark));
        displayCtrl.updatePlayerInfo(players.length - 1, players[players.length - 1]);
        if (players[players.length - 1].mark === "cross" || players[players.length - 1].mark === "circle") {
            displayCtrl.disableMarkerOption(players[players.length - 1].mark);
        }
        if (players.length === 2) {
            displayCtrl.showGameBoard();
            displayCtrl.updateGameStats(players, tiedRounds);
            displayCtrl.updatePlayerTurn(playerTurn, isThereMatch, isGameOver);
        }
    };

    const compareCurrentBoardData = (currentBoardPatterns, patternToWin) => {
        for (const currentPattern of currentBoardPatterns) {
            if (currentPattern === patternToWin) {
                return true;
            }
        }
        return false;
    };

    const checkMatch = (currentBoard) => {
        let playerWinningPattern = "";
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
            playerWinningPattern = (players[0].mark).repeat(3);
            for (const patternGroup of Object.values(matches)) {
                if (compareCurrentBoardData(patternGroup, playerWinningPattern)) {
                    gameWinner = players[0];
                    players[0].increaseRoundsWon();
                    return true;
                }
            }
        } else {
            playerWinningPattern = (players[1].mark).repeat(3);
            for (const patternGroup of Object.values(matches)) {
                if (compareCurrentBoardData(patternGroup, playerWinningPattern)) {
                    gameWinner = players[1];
                    players[1].increaseRoundsWon();
                    return true;
                }
            }
        }
        return false;
    };

    const checkGameBoard = (currentBoard) => {
        isThereMatch = checkMatch(currentBoard);
        if (!currentBoard.includes("")) {
            isGameOver = true;
            tiedRounds++;
        }
    };

    const checkPlayerChoice = (userChoice) => {
        if ((/^[0-8]$/).test(userChoice) && boardModule.getBoard()[userChoice] === "") {
            return true;
        }
        return false;
    };

    const playRound = (cellNumber) => {
        if (checkPlayerChoice(cellNumber)) {
            boardModule.setMark(cellNumber, playerTurn ? players[0].mark : players[1].mark);
            displayCtrl.updateGameBoard(cellNumber, playerTurn ? players[0].mark : players[1].mark);
            checkGameBoard(boardModule.getBoard());
            if (isThereMatch || isGameOver) {
                displayCtrl.showGameResults(isThereMatch, gameWinner);
                displayCtrl.updateGameStats(players, tiedRounds);
                displayCtrl.updatePlayerTurn(playerTurn, isThereMatch, isGameOver);
                playerTurn = !playerTurn;
                return;
            }
            playerTurn = !playerTurn;
            displayCtrl.updatePlayerTurn(playerTurn, isThereMatch, isGameOver);
        }
    };

    const resetGameData = () => {
        for (let index = 0; index < boardModule.getBoard().length; index++) {
            boardModule.setMark(index, "");
        }
        isThereMatch = false;
        isGameOver = false;
        gameWinner = null;
        displayCtrl.updatePlayerTurn(playerTurn, isThereMatch, isGameOver);
    };

    // ========================
    // Connections with external IIFEs
    // ========================
    displayCtrl.bindFormSubmit(createPlayers);
    displayCtrl.bindClickCell(playRound);
    displayCtrl.bindRestart(resetGameData);

})(Player, gameBoard, displayController);