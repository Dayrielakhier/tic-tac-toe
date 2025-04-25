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

    const fillCell = (row, column, choice) => {
        if (["X", "O"].includes(board[row][column].getSquare())) {
            return
        } else {
            board[row][column].fillSquare(choice)
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((square) => square.getSquare()))
        console.log(boardWithCellValues)
    }

    return {getBoard, fillCell, printBoard}
})();

function cell() {
    let value = 0

    const fillSquare = (choice) => value = choice

    const getSquare = () => value

    return {fillSquare, getSquare}
}
 
function createPlayer(name, choice) {
    return {name, choice}
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

    const playRound = (row, column) => {
        gameBoard.fillCell(row, column, getActivePlayer().choice)
        switchPlayerTurn()
        printNewRound()
    }

    printNewRound()

    return {playRound}
}

const game = gameFlow()