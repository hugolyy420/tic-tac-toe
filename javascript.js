const gameIntro = function () {
        const startButton = document.getElementById('start-button');
        const introPage = document.querySelector('#intro-page');
        const gameboardContainer = document.querySelector('.gameboard-container')
        const playerOneNameInput = document.getElementById('player-one-name');
        const playerTwoNameInput = document.getElementById('player-two-name');

        startButton.addEventListener('click', function () {
        const playerOneName = playerOneNameInput.value.trim();
        const playerTwoName = playerTwoNameInput.value.trim();

        introPage.style.display = 'none';

        // Display game board
        gameboardContainer.style.display = 'block';
        
        game.changePlayersName(playerOneName, playerTwoName);
        displayBoard.announce(`${game.getActivePlayer().name}'s turn.`);
    })

};

const gameboardDisplay = () => {

    const gameboardDisplay = document.querySelector('.game-board');
    const announcementDisplayBox = document.querySelector('.announcement');
    const restartButton = document.querySelector('.restart-button');

    createGameboard(3, 3);

    function createGameboard(rows, columns) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.column = j;
                gameboardDisplay.appendChild(cell);
            }
        }

        restartButton.addEventListener('click', resetGameboard);
        gameboardDisplay.addEventListener('click', handleCellClick);
    }

    function resetGameboard () {
        gameboardInstance.resetBoard();
        resetCellDisplay();
        announce(`${game.getActivePlayer().name}'s turn.`);
        game.announceGameStart();
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

    function resetCellDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => cell.textContent = '');
    }

    function announce(message) {
        announcementDisplayBox.textContent = message;
    }



    return { createGameboard, updateCellDisplay, resetCellDisplay, announce };
}

function Gameboard() {
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

    return { getBoard, addValue, printBoard, resetBoard };

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
    playerTwoName = "Player Two") {

    let gameEnded = false;
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

    const changePlayersName = (playerOne, playerTwo) => {
        players[0].name = playerOne;
        players[1].name = playerTwo;
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    // const printNewRound = () => {
    //     gameboardInstance.printBoard();
    //     displayBoard.announce(`${getActivePlayer().name}'s turn.`);
    // };

    const checkWinAndTie = () => {
        // Check rows, columns, and diagonals for a win
        for (let i = 0; i < 3; i++) {
            // Check rows and columns
            if (
                (board[i][0].getValue() === board[i][1].getValue() &&
                    board[i][1].getValue() === board[i][2].getValue() &&
                    board[i][0].getValue() !== '') || // Check rows
                (board[0][i].getValue() === board[1][i].getValue() &&
                    board[1][i].getValue() === board[2][i].getValue() &&
                    board[0][i].getValue() !== '') // Check columns
            ) {
                return board[i][0].getValue(); // Return the winning value
            }
        }

        // Check diagonals
        if (
            (board[0][0].getValue() === board[1][1].getValue() &&
                board[1][1].getValue() === board[2][2].getValue() &&
                board[0][0].getValue() !== '') || // Check diagonal \
            (board[0][2].getValue() === board[1][1].getValue() &&
                board[1][1].getValue() === board[2][0].getValue() &&
                board[0][2].getValue() !== '') // Check diagonal /
        ) {
            return board[1][1].getValue(); // Return the winning value (since the center cell must be part of any winning diagonal)
        }

        // Check for tie
        let isTie = true;
        // Iterate through the board to check for empty cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() === '') {
                    isTie = false; // If there's an empty cell, it's not a tie yet
                    break;
                }
            }
            if (!isTie) break; // If we found an empty cell, no need to continue checking
        }

        // Return 'null' for no win or tie, 'X' or 'O' for a win, and 'tie' for a tie
        return isTie ? 'tie' : null;
    };

    const announceGameEnd = () =>  {
        gameEnded = true;
    }

    const announceGameStart = () =>  {
        gameEnded = false;
    }

    const playRound = (row, column) => {

        if (gameEnded) return;

        const selectedCell = board[row][column];

        if (selectedCell.getValue() !== '') {
            // printNewRound();
            displayBoard.announce(`Oops... That cell is already occupied. ${getActivePlayer().name}'s turn.`);

            return; // Exit the function early
        }

        gameboardInstance.addValue(row, column, getActivePlayer().value);
        displayBoard.updateCellDisplay(row, column, board);


        const result = checkWinAndTie();
        if (result === 'tie') {
            displayBoard.updateCellDisplay(row, column, board);
            displayBoard.announce(`It's a tie...`);
            announceGameEnd();
            return;
        } else if (result !== null) {
            const winningPlayer = players.find(player => player.value === result);
            displayBoard.updateCellDisplay(row, column, board);
            displayBoard.announce(`${winningPlayer.name} wins!`);
            announceGameEnd();
            return;
        } else {
            switchPlayerTurn();
        }

        displayBoard.announce(`${getActivePlayer().name}'s turn.`);
    };

    displayBoard.announce(`${getActivePlayer().name}'s turn.`);

    return {
        playRound,
        getActivePlayer,
        changePlayersName,
        announceGameStart
    };
}

gameIntro();
const displayBoard = gameboardDisplay();
const gameboardInstance = Gameboard();
const game = GameController();




