//function to create a board
//function for checking if anyone wins or tie
//  check for same values in one row, one column and 
//function for reprinting the board

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
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].resetValue(); // Reset each cell's value
            }
        }
        console.log("Board reset.");
    }

    return {getBoard, addValue, printBoard, resetBoard};

};

//Object for cell
//1. able to get value
//2. able to add value
function Cell() {
    let value;

    const addValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    const resetValue = () => {
        value = undefined;
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

    const checkWin = (row, column) => {

        for (let row = 0; row < 3; row++) {
            if (board[row][0].getValue() === board[row][1].getValue() &&
                board[row][1].getValue() === board[row][2].getValue() &&
                board[row][0].getValue() !== undefined) {
                return board[row][0].getValue();
            }
        }
    
        // Check columns
        for (let column = 0; column < 3; column++) {
            if (board[0][column].getValue() === board[1][column].getValue() &&
                board[1][column].getValue() === board[2][column].getValue() &&
                board[0][column].getValue() !== undefined) {
                return board[0][column].getValue();
            }
        }
    
        // Check diagonals
        if (board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue() &&
            board[0][0].getValue() !== undefined) {
            return board[0][0].getValue();
        }
        if (board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue() &&
            board[0][2].getValue() !== undefined) {
            return board[0][2].getValue();
        }

        return null;
    }

    const checkTie = (row, column) => {

        // Iterate through the board
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                // Check if any cell is empty
                if (board[row][column].getValue() === undefined) {
                    return false; // Game is not yet a tie
                }
            }
        }
    
        // If all cells are filled and there's no winner, it's a tie
        return true; // Game is a tie
    }

    const playRound = (row, column) => {
        
        const selectedCell = board[row][column];
        if (selectedCell.getValue() !== undefined) {
        console.log('Oops... That cell is already occupied.');
        printNewRound();
        return; // Exit the function early
    }
        
        gameboardInstance.addValue(row, column, getActivePlayer().value);

        //check win logic here
        let winnerValue = checkWin(row, column);
        const winningPlayer = players.find(player => player.value === winnerValue);
        if (winningPlayer) {
            console.log(`${winningPlayer.name} wins!`)
            gameboardInstance.printBoard();
            gameboardInstance.resetBoard();
            printNewRound();
            return; 
        }

        let tieResult = checkTie(row, column);
        if (tieResult) {
            console.log(`It's a tie...`);
            gameboardInstance.resetBoard();
            printNewRound();
            return; 
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();


//1.create a board
//2.decide who starts first
//3.choose one of the box and assigns value to it
//4. loop through the board and update the values 
//4.check to see if anyone wins every time a value to added
//5.switch round if the game hasn't ended
//6. If win/tie, reprint the board and start again

//1. check if the value of the arrays has changed
//2.  