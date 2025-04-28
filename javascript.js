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
 
function createPlayer(name, mark) {
    return {name, mark}
}

function gameFlow() {
    const playerOne = createPlayer("P1", "X")
    const playerTwo = createPlayer("P2", "O")

    const players = [playerOne, playerTwo]

    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => activePlayer

    const printNewRound = () => {
        gameBoard.printBoard()
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    let moveCount = 0

    const playRound = (row, column) => {
        const board = gameBoard.getBoard()

        if (["X", "O"].includes(board[row][column].getSquare())) {
            return
        }
        gameBoard.fillCell(row, column, getActivePlayer().mark)

        moveCount++;

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
            if (row + column === 2) {
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
            console.log(`Game over! ${getActivePlayer().name} wins!`)
        } else if (moveCount === 9) {
            console.log("Game over! It's a tie!")
        } else {
            switchPlayerTurn()
            printNewRound()
        }
    }

    printNewRound()

    return {playRound, getActivePlayer}
}

function displayController() {
    const game = gameFlow()
    const turnDiv = document.querySelector(".turn")
    const boardDiv = document.querySelector(".board")

    function updateScreen() {
        boardDiv.textContent = ""

        const activePlayer = game.getActivePlayer()
        const board = gameBoard.getBoard()
        turnDiv.textContent = `${activePlayer.name}'s turn.`
        
        board.forEach((row, rowIndex) => {
            row.forEach((square, columnIndex) => {
                const tile = document.createElement("button")
                tile.textContent = square.getSquare()
                tile.dataset.row = rowIndex
                tile.dataset.col = columnIndex
                boardDiv.appendChild(tile)
            })
        })
    }

    function clickHandler(e) {
        const row = e.target.dataset.row
        const col = e.target.dataset.col

        game.playRound(row, col)
        updateScreen()
    }
    boardDiv.addEventListener("click", clickHandler)

    updateScreen()
}

displayController()
