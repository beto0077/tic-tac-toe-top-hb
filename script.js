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
const boxGame = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let playerTurn = true;
let isThereMatch = false;

function updateGameBoard() {
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

function compareCurrentGameData(currentTablePatterns, patternToWin) {
    for (const currentPattern of currentTablePatterns) {
        console.log(`${currentPattern} === ${patternToWin} => ${currentPattern === patternToWin}`);
        if (currentPattern === patternToWin) {
            console.log(`There's a pattern match!`);
            return true;
        }
    }
    return false;
}

function checkMatch() {
    const patternX = "XXX";
    const patternO = "OOO";
    const matches = {
        verticalMatches: [
            `${boxGame[0]}${boxGame[1]}${boxGame[2]}`,
            `${boxGame[3]}${boxGame[4]}${boxGame[5]}`,
            `${boxGame[6]}${boxGame[7]}${boxGame[8]}`,
        ],
        horizontalMatches: [
            `${boxGame[0]}${boxGame[3]}${boxGame[6]}`,
            `${boxGame[1]}${boxGame[4]}${boxGame[7]}`,
            `${boxGame[2]}${boxGame[5]}${boxGame[8]}`,
        ],
        diagonalMatches: [
            `${boxGame[0]}${boxGame[4]}${boxGame[8]}`,
            `${boxGame[2]}${boxGame[4]}${boxGame[6]}`,
        ],
    }

    for (const patternGroup of Object.values(matches)) {
        if (compareCurrentGameData(patternGroup, patternX)) {
            return true;
        }
    }
    for (const patternGroup of Object.values(matches)) {
        if (compareCurrentGameData(patternGroup, patternO)) {
            return true;
        }
    }
    return false;
}

function playRound() {
    while (!isThereMatch) {
        const markType = playerTurn ? "X" : "O";
        const choice = prompt(`Indicate the position number where you want to mark ${markType}\n
            ${boxGame[0]} | ${boxGame[1]} | ${boxGame[2]}\n
            ${boxGame[3]} | ${boxGame[4]} | ${boxGame[5]}\n
            ${boxGame[6]} | ${boxGame[7]} | ${boxGame[8]}`);
        if (choice === "arroz") {
            return;
        };
        boxGame[choice - 1] = markType;
        playerTurn = !playerTurn;
        isThereMatch = checkMatch();
        updateGameBoard();
        console.log(isThereMatch);
    }
}

updateGameBoard();
playRound();