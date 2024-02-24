//function to create a board
//function for checking if anyone wins or tie
//function for reprinting the board

const gameboard = (() => {
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

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    return { getBoard, printBoard};

})();

gameboard.printBoard();

//Object for cell
//1. able to get value
//2. able to add value
function Cell() {
    let value = '';

    const addValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addValue,
        getValue
    };
}


//factory functions for creating players
//store their name, value
//function for adding their symbol
//

//1.create a board
//2.decide who starts first
//3.choose one of the box and assigns value to it
//4. loop through the board and update the values 
//4.check to see if anyone wins every time a value to added
//5.switch round if the game hasn't ended
//6. If win/tie, reprint the board and start again
