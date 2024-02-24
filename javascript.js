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

    return {getBoard, addValue, printBoard};

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

    return {
        addValue,
        getValue
    };
}


// factory functions for creating players(done)
//store their name, value
//function for adding their symbol

function GameController(playerOneName = "Player One",
playerTwoName = "PLayer Two") {
    const board = Gameboard();

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
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
      };

    const playRound = (row, column) => {
         const selectedCell = board.getBoard()[row][column];
        if (selectedCell.getValue() !== undefined) {
        console.log('Oops... That cell is already occupied.');
        printNewRound();
        return; // Exit the function early
    }
        
        board.addValue(row, column, getActivePlayer().value);
        //check win logic here
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