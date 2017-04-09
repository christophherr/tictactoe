/* global $, swal, axios*/
// Uses Stujo's Tic Tac Toe API for Computer moves.
// https://github.com/stujo/tictactoe-api

'use strict';

// Symbol the player plays.
var playerSymbol = '',
    // Symbol the computer plays.
    computerSymbol = '',
    // Outputs the API response to the board.
    computerMoveField,
    // Create the ID for outputting the Computer move.
    computerMove,
    // Player plays 'O'
    playerPlaysO = function() {
        playerSymbol = 'O';
        computerSymbol = 'X';
        startGame();
    },
    // Player plays 'X'
    playerPlaysX = function() {
        playerSymbol = 'X';
        computerSymbol = 'O';
        startGame();
    },
    // Base URL parameter pattern recording the moves.
    urlParameters = ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
    // URL parameter for API request.
    strippedUrlParameters,
    // Api Url
    tictactoeapiUrl,
    // Keep track of moves.
    moves = 0,
    // Selection of Game fields
    gameFields = document.getElementsByClassName('tic-tac-toe-field'),
    // Clicked Game fields
    playerMove = document.getElementById('tic-tac-toe-board'),
    // Game helpers
    startGame,
    resetGame,
    // Game moves logic
    addMove,
    // Winning Logic
    checkWinner,
    draw,
    // input fields for checkWinner
    field0 = document.getElementById('0'),
    field1 = document.getElementById('1'),
    field2 = document.getElementById('2'),
    field3 = document.getElementById('3'),
    field4 = document.getElementById('4'),
    field5 = document.getElementById('5'),
    field6 = document.getElementById('6'),
    field7 = document.getElementById('7'),
    field8 = document.getElementById('8');

// Setup game depending on Player's symbol choice
document.getElementById('playerO').onclick = playerPlaysO;

document.getElementById('playerX').onclick = playerPlaysX;

playerMove.addEventListener('click', function(event) {
    addMove(event.target.id);
});

// Start with a fresh board, count and URL parameter.
startGame = function() {
    for (var i = 0; i < gameFields.length; i++) {
        gameFields[i].classList.remove('O', 'X');
        gameFields[i].innerHTML = '';
    }
    moves = 0;
    urlParameters = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
};

// Additional resets to prevent input if modals are dismissed.
resetGame = function() {
    playerSymbol = '';
    computerSymbol = '';
};

// Winning logic.
checkWinner = function(symbol) {
    if (
        (field0.classList.contains(symbol) &&
            field1.classList.contains(symbol) &&
            field2.classList.contains(symbol)) ||
        (field3.classList.contains(symbol) &&
            field4.classList.contains(symbol) &&
            field5.classList.contains(symbol)) ||
        (field6.classList.contains(symbol) &&
            field7.classList.contains(symbol) &&
            field8.classList.contains(symbol)) ||
        (field0.classList.contains(symbol) &&
            field4.classList.contains(symbol) &&
            field8.classList.contains(symbol)) ||
        (field2.classList.contains(symbol) &&
            field4.classList.contains(symbol) &&
            field6.classList.contains(symbol)) ||
        (field0.classList.contains(symbol) &&
            field3.classList.contains(symbol) &&
            field6.classList.contains(symbol)) ||
        (field1.classList.contains(symbol) &&
            field4.classList.contains(symbol) &&
            field7.classList.contains(symbol)) ||
        (field2.classList.contains(symbol) &&
            field5.classList.contains(symbol) &&
            field8.classList.contains(symbol))
    ) {
        if (symbol === playerSymbol) {
            swal({
                title: 'Congratulations. You won!',
                text: 'Please select a symbol to start a new game.',
                type: 'success',
                showCancelButton: true,
                confirmButtonText: "Click here to play 'O'",
                cancelButtonText: "Click here to play 'X'"
            }).then(
                function() {
                    playerPlaysO();
                },
                function(dismiss) {
                    if (dismiss === 'cancel') {
                        playerPlaysX();
                    }
                }
            );
            resetGame();
        }
        if (symbol === computerSymbol) {
            swal({
                title: 'Oh no... The computer won...',
                text: 'Please select a symbol to start a new game.',
                type: 'error',
                showCancelButton: true,
                confirmButtonText: "Click here to play 'O'",
                cancelButtonText: "Click here to play 'X'"
            }).then(
                function() {
                    playerPlaysO();
                },
                function(dismiss) {
                    if (dismiss === 'cancel') {
                        playerPlaysX();
                    }
                }
            );
            resetGame();
        }
    }
};

// Check for a draw.
draw = function() {
    if (moves === 9) {
        setTimeout(
            function() {
                swal({
                    title: "It's a draw. Nobody wins",
                    text: 'Please select a sympbol to start a new game.',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: "Click here to play 'O'",
                    cancelButtonText: "Click here to play 'X'"
                }).then(
                    function() {
                        playerPlaysO();
                    },
                    function(dismiss) {
                        if (dismiss === 'cancel') {
                            playerPlaysX();
                        }
                    }
                );
                resetGame();
            },
            200
        );
    }
};

// Game logic.
addMove = function(id) {
    // Make sure the Player has chosen a symbol.
    if (!playerSymbol) {
        return swal({
            title: 'Please choose a symbol to start playing.',
            type: 'error',
            showCancelButton: true,
            confirmButtonText: "Click here to play 'O'",
            cancelButtonText: "Click here to play 'X'"
        }).then(
            function() {
                playerPlaysO();
            },
            function(dismiss) {
                if (dismiss === 'cancel') {
                    playerPlaysX();
                }
            }
        );
    }

    // Select HTML element from click event.
    var selectField = document.getElementById(id);

    // Make sure the field is empty,
    // prevent accidentally clicking the same field twice.
    if (selectField.innerHTML.length > 0) {
        return swal(
            'This field has already been played.',
            'Please select a different field.',
            'error'
        );
    }

    // Output Player's turn and class on the board.
    selectField.classList.add(playerSymbol);
    selectField.innerHTML = playerSymbol;

    // Check if Player has won.
    setTimeout(
        function() {
            checkWinner(playerSymbol);
        },
        200
    );

    // Increment moves.
    moves++;

    // Check if it´s a draw.
    draw();

    // Player's move is recorded in the URL parameter.
    urlParameters[id] = playerSymbol;

    // URL parameter is prepared for API call
    strippedUrlParameters = urlParameters.toString().replace(/,/g, '');

    // Create the URL for API call.
    tictactoeapiUrl = 'https://tttapi.herokuapp.com/api/v1/' +
        strippedUrlParameters +
        '/' +
        computerSymbol;

    if (moves < 9) {
        // Make the API call and turn the response into the Computer move.
        // $.getJSON(tictactoeapiUrl, function(data) {
        axios.get(tictactoeapiUrl).then(function(response) {
            // Retrieve Computer move.
            computerMoveField = response.data.recommendation;

            computerMove = document.getElementById(computerMoveField);
            computerMove.innerHTML = computerSymbol;
            computerMove.classList.add(computerSymbol);

            moves++;

            // Update the URL parameter with the Computer move.
            urlParameters[computerMoveField] = computerSymbol;

            // Check if Computer has won.
            setTimeout(
                function() {
                    checkWinner(computerSymbol);
                },
                200
            );
        });
    }
};
