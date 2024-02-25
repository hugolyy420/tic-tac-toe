const gameboardDisplay = () => {
    
    const gameboardDisplay = document.querySelector('.game-board');

    function createGameboard (rows, columns) {
        for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = i;
                    cell.dataset.column = j;
                    gameboardDisplay.appendChild(cell);
                }
            } 
            
            gameboardDisplay.addEventListener('click', handleCellClick);
    }

    
   

    function handleCellClick(event) {
        const cell = event.target;
        if (cell.classList.contains('cell')) {
            const row = parseInt(cell.dataset.row);
            const column = parseInt(cell.dataset.column);
            // Call your playRound function with the clicked cell coordinates
            game.playRound(row, column);
            // Update the cell display based on the game state
        }
    }

    function updateCellDisplay(row, column, board) {
        const cell = document.querySelector(`[data-row="${row}"][data-column="${column}"]`);
        const value = board[row][column].getValue();
        if (value !== '') {
            cell.textContent = value; // Update cell text with player symbol
        }
    }

    return {createGameboard, updateCellDisplay};
}

function Gameboard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const addValue = (row, column, player) => {
        let targetCell = board[row][column];
           targetCell.addValue(player); 
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    const resetBoard = () => {
        board.map((row) => row.map((cell) => cell.resetValue()));
        console.log("Board reset.");
    }

    return {getBoard, addValue, printBoard, resetBoard};

};

function Cell() {
    let value = '';

    const addValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    const resetValue = () => {
        value = '';
    }

    return {
        addValue,
        getValue,
        resetValue
    };
}


// factory functions for creating players(done)
//store their name, value
//function for adding their symbol

function GameController(playerOneName = "Player One",
playerTwoName = "PLayer Two") {

    const gameboardInstance = Gameboard();
    const board = gameboardInstance.getBoard();
    const displayBoard = gameboardDisplay();
    displayBoard.createGameboard(3,3);

    const players = [
        {
            name: playerOneName,
            value: 'O'
        },
        {
            name: playerTwoName,
            value: 'X'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameboardInstance.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
      };

    const checkWin = () => {

        for (let row = 0; row < 3; row++) {
            if (board[row][0].getValue() === board[row][1].getValue() &&
                board[row][1].getValue() === board[row][2].getValue() &&
                board[row][0].getValue() !== '') {
                return board[row][0].getValue();
            }
        }
    
        // Check columns
        for (let column = 0; column < 3; column++) {
            if (board[0][column].getValue() === board[1][column].getValue() &&
                board[1][column].getValue() === board[2][column].getValue() &&
                board[0][column].getValue() !== '') {
                return board[0][column].getValue();
            }
        }
    
        // Check diagonals
        if (board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue() &&
            board[0][0].getValue() !== '') {
            return board[0][0].getValue();
        }
        if (board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue() &&
            board[0][2].getValue() !== '') {
            return board[0][2].getValue();
        }

        return null;
    }

    const checkTie = () => {

        // Iterate through the board
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                // Check if any cell is empty
                if (board[row][column].getValue() === '') {
                    return false; // Game is not yet a tie
                }
            }
        }
    
        // If all cells are filled and there's no winner, it's a tie
        return true; // Game is a tie
    }

    const playRound = (row, column) => {
        
        const selectedCell = board[row][column];
        if (selectedCell.getValue() !== '') {
        console.log('Oops... That cell is already occupied.');
        printNewRound();
        return; // Exit the function early
    }
        
        gameboardInstance.addValue(row, column, getActivePlayer().value);

        //check win logic here
        let winnerValue = checkWin();
        const winningPlayer = players.find(player => player.value === winnerValue);
        if (winningPlayer) {
            console.log(`${winningPlayer.name} wins!`)
            gameboardInstance.printBoard();
            gameboardInstance.resetBoard();
            printNewRound();
            return; 
        }

        let tieResult = checkTie();
        if (tieResult) {
            console.log(`It's a tie...`);
            gameboardInstance.resetBoard();
            printNewRound();
            return; 
        }

        switchPlayerTurn();
        printNewRound();
        displayBoard.updateCellDisplay(row, column, board);
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();
