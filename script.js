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