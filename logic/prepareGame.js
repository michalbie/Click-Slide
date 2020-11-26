import { updateNextToBlankProperty, trySwapCells } from "./boardManager.js"
import * as randomizator from "./randomizeCells.js"

const prepareElements = (boardCells) => {
    const gridButtons = document.querySelectorAll(".grid-select-btn");
    for (let button of gridButtons) {
        button.addEventListener("mousedown", () => {
            boardCells = clearBoardCellsObject(boardCells);
            clearBoard();
            const gridSize = button.getAttribute("grid");
            initializeBoard(parseInt(gridSize), boardCells);
        })
    }
}

const initializeBoard = (gridSize, boardCells) => {
    const board = document.querySelector(".game-board");
    let initialNeigbors

    const prepareGrid = () => {
        board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    }

    const createCells = () => {
        for (let row = 0; row < gridSize; row++) {
            for (let column = 0; column < gridSize; column++) {
                let cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                board.appendChild(cell)
                cell.style.maxWidth = cell.offsetWidth + "px";
                cell.style.maxHeight = cell.offsetHeight + "px";

                let innerImage = document.createElement("img")
                innerImage.setAttribute("class", "cell-img")
                innerImage.src = document.querySelector(".preview").src
                innerImage.width = cell.clientWidth;
                innerImage.height = cell.clientWidth;
                let nextPosition = { x: (column * cell.offsetWidth), y: (row * cell.offsetHeight) }
                innerImage.style.objectPosition = `-${nextPosition.x}px -${nextPosition.y}px`;
                cell.appendChild(innerImage)

                let index = (row * gridSize) + column;
                boardCells[index] = { div: cell, blank:false, nextToBlank: false, cords: {x: column, y: row} }
                cell.addEventListener("mousedown", () => {
                    trySwapCells(boardCells, cell)
                });

                if(row == gridSize-1 && column == gridSize-1){
                    boardCells[index]["blank"] = true;
                    innerImage.src = "";
                }
            }
        }

        initialNeigbors = updateNextToBlankProperty(boardCells);
    }

    prepareGrid()
    createCells()
    randomizator.shuffleCells(boardCells, boardCells[gridSize * gridSize - 1], initialNeigbors)
}

const clearBoard = () => {
    const board = document.querySelector(".game-board");
    board.innerHTML = "";
}

const clearBoardCellsObject = (boardCells) => {
    boardCells = {};
    return boardCells;
}

export { prepareElements }