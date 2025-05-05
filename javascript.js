const gameBoard = (function () {
    const row = 3
    const column = 3
    const board = []
    
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(cell())
        }
    }

    const getBoard = () => board

    const fillCell = (row, column, mark) => {
            board[row][column].fillSquare(mark)
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((square) => square.getSquare()))
        console.log(boardWithCellValues)
    }

    return {getBoard, fillCell, printBoard}
})();

function cell() {
    let value = ""

    const fillSquare = (mark) => value = mark

    const getSquare = () => value

    return {fillSquare, getSquare}
}

const players = [
    {
        name: "P1",
        mark: "X"
    },
    {
        name: "P2",
        mark: "O"
    }
]

const gameState = {
    gameActive: true,
    moveCount: 0
}

function gameFlow() {
    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => activePlayer

    const printNewRound = () => {
        gameBoard.printBoard()
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (row, column) => {
        const board = gameBoard.getBoard()

        if (["X", "O"].includes(board[row][column].getSquare()) || !gameState.gameActive) {
            return
        }
        
        gameBoard.fillCell(row, column, getActivePlayer().mark)

        gameState.moveCount++;

        function checkRow() {
            for (let i = 0; i < 3; i++) {
                if (board[row][i].getSquare() !== getActivePlayer().mark) {
                    break
                } else if (i === 2) {
                    return true
                }
            }            
        }

        function checkColumn() {
            for (let i = 0; i < 3; i++) {
                if (board[i][column].getSquare() !== getActivePlayer().mark) {
                    break
                } else if (i === 2) {
                    return true
                }
            }            
        }

        function checkDiag() {
            if (row === column) {
                for (let i = 0; i < 3; i++) {
                    if (board[i][i].getSquare() !== getActivePlayer().mark) {
                        break
                    } else if (i === 2) {
                        return true
                    }
                }
            }            
        }

        function checkAntiDiag() {
            if (Number(row) + Number(column) === 2) {
                for (let i = 0; i < 3; i++) {
                    if (board[i][2 - i].getSquare() !== getActivePlayer().mark) {
                        break
                    } else if (i === 2) {
                        return true
                    }
                }
            }            
        }

        if ((checkRow() || checkColumn() || checkDiag() || checkAntiDiag()) === true) {
            gameBoard.printBoard()
            console.log(`Game over! ${getActivePlayer().name} wins!`)
            gameState.gameActive = false
            return "win"
        } else if (gameState.moveCount === 9) {
            gameBoard.printBoard()
            console.log("Game over! It's a tie!")
            gameState.gameActive = false
            return "tie"
        } else {
            switchPlayerTurn()
            printNewRound()
        }
    }

    printNewRound()

    return {playRound, getActivePlayer}
}

const displayController = (function () {
    const game = gameFlow()
    const annDiv = document.querySelector(".ann")
    const boardDiv = document.querySelector(".board")

    function updateScreen(result) {
        boardDiv.textContent = ""

        const activePlayer = game.getActivePlayer()
        const board = gameBoard.getBoard()

        if (result === "win") {
            annDiv.textContent = `Game over! ${activePlayer.name} wins!`
        } else if (result === "tie") {
            annDiv.textContent = "Game over! It's a tie!"
        } else {
            annDiv.textContent = `${activePlayer.name}'s turn.`
        }
    
        
        board.forEach((row, rowIndex) => {
            row.forEach((square, columnIndex) => {
                const tile = document.createElement("button")
                tile.textContent = square.getSquare()
                tile.classList.add("tile")
                tile.dataset.row = rowIndex
                tile.dataset.col = columnIndex
                boardDiv.appendChild(tile)
            })
        })
    }

    function clickHandler(e) {
        const row = e.target.dataset.row
        const col = e.target.dataset.col

        result = game.playRound(row, col)
        updateScreen(result)
    }
    boardDiv.addEventListener("click", clickHandler)

    const dialog = document.querySelector("dialog")
    const form = document.querySelector("form")
    const restart = document.querySelector(".restart")
    const p1Name = document.querySelector("#p1-name")
    const p2Name = document.querySelector("#p2-name")

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        dialog.close()
        restart.removeAttribute("hidden")
        players[0].name = p1Name.value
        players[1].name = p2Name.value
        updateScreen(null)
    })

    function reset() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameBoard.fillCell(i, j, "")
            }
        }
        updateScreen(null)
        gameState.gameActive = true
        gameState.moveCount = 0
    }
    restart.addEventListener("click", reset)

    dialog.showModal()

})()
