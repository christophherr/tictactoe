/* global $*/
/* global swal*/
// Uses Stujo's Tic Tac Toe API for Computer moves.
// https://github.com/stujo/tictactoe-api

'use strict';

// Symbol the player plays.
var playerSymbol = '',
    // Symbol the computer plays.
    computerSymbol = '',
    // Outputs the API response to the board.
    computerMoveField,
    // Base URL parameter pattern recording the moves.
    urlParameters = ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
    // URL parameter for API request.
    strippedUrlParameters,
    // Keep track of moves.
    moves = 0,
    // Selection of Game fields
    gameFields = document.getElementsByClassName('tic-tac-toe-field');

// Setup game depending on Player's symbol choice
document.getElementById('playerO').onclick = function() {
    playerSymbol = 'O';
    computerSymbol = 'X';
    startGame();
};

document.getElementById('playerX').onclick = function() {
    playerSymbol = 'X';
    computerSymbol = 'O';
    startGame();
};

// Start with a fresh board, count and URL parameter.
function startGame() {
    for (var i = 0; i < gameFields.length; i++) {
        gameFields[i].classList.remove('O', 'X');
        gameFields[i].innerHTML = '';
    }
    moves = 0;
    urlParameters = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
}

// Additional resets to re-start the game without reload.
function resetGame() {
    playerSymbol = '';
    computerSymbol = '';
    // startGame();
}

// Winning logic.
function checkWinner(symbol) {
    if (
        ($('#0').hasClass(symbol) &&
            $('#1').hasClass(symbol) &&
            $('#2').hasClass(symbol)) ||
        ($('#3').hasClass(symbol) &&
            $('#4').hasClass(symbol) &&
            $('#5').hasClass(symbol)) ||
        ($('#6').hasClass(symbol) &&
            $('#7').hasClass(symbol) &&
            $('#8').hasClass(symbol)) ||
        ($('#0').hasClass(symbol) &&
            $('#4').hasClass(symbol) &&
            $('#8').hasClass(symbol)) ||
        ($('#2').hasClass(symbol) &&
            $('#4').hasClass(symbol) &&
            $('#6').hasClass(symbol)) ||
        ($('#0').hasClass(symbol) &&
            $('#3').hasClass(symbol) &&
            $('#6').hasClass(symbol)) ||
        ($('#1').hasClass(symbol) &&
            $('#4').hasClass(symbol) &&
            $('#7').hasClass(symbol)) ||
        ($('#2').hasClass(symbol) &&
            $('#5').hasClass(symbol) &&
            $('#8').hasClass(symbol))
    ) {
        $('.tic-tac-toe-field').off();

        if (symbol === playerSymbol) {
            swal(
                'Congratulations. You won!',
                'Please select a symbol to start a new game.',
                'success'
            );
            resetGame();
        }

        if (symbol === computerSymbol) {
            swal(
                'Oh no... The computer won...',
                'Please select a symbol to start a new game.',
                'error'
            );
            resetGame();
        }
    }
}

// Check for a draw.
function draw() {
    if (moves === 9) {
        setTimeout(
            function() {
                swal(
                    "It's a draw. Nobody wins.",
                    'Please select a symbol to start a new game.',
                    'info'
                );
                resetGame();
            },
            200
        );
    }
}

// Game logic.
function addMove(id) {
    // Make sure the Player has chosen a symbol.
    if (!playerSymbol) {
        return swal({
            title: 'Please choose a symbol to start playing.',
            type: 'error'
        });
    }

    // Create an ID from the click event.
    var field = '#' + id;

    // Make sure the field is empty,
    // prevent accidentally clicking the same field twice.
    if ($(field).html().length > 0) {
        return swal(
            'This field has already been played.',
            'Please select a different field.',
            'error'
        );
    }

    // Output Player's turn and class on the board.
    $(field).html(playerSymbol).addClass(playerSymbol);

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

    // Prevent API call after draw.
    if (!computerSymbol) {
        return null;
    }

    // Player's move is recorded in the URL parameter.
    urlParameters[id] = playerSymbol;

    // URL parameter is prepared for API call
    strippedUrlParameters = urlParameters.toString().replace(/,/g, '');

    // Create the URL for API call.
    var tictactoeapiUrl = 'https://tttapi.herokuapp.com/api/v1/' +
        strippedUrlParameters +
        '/' +
        computerSymbol;

    // Make the API call and turn the response into the Computer move.
    $.getJSON(tictactoeapiUrl, function(data) {
        // Retrieve Computer move.
        computerMoveField = data.recommendation;

        // Create the ID for outputting the Computer move.
        var computerMove = '#' + computerMoveField;

        // Output the Computer move and class to the board.
        $(computerMove).html(computerSymbol).addClass(computerSymbol);

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
