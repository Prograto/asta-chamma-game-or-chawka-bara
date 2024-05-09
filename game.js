const safearr = [11, 17, 19, 23, 27, 31, 33, 39,25];
const playerposarr = [4, 28, 46, 22];
const playerReleaseArr = [11, 27, 39, 23];
const winsquare = 25;
const playerposorder = [4, 28, 46, 22];
let currentPlayerPosArr = [];
const p1 = [11,10,9,16,23,30,37,38,39,40,41,34,27,20,13,12,19,26,33,32,31,24,17,18,25];
const p2 = [27,20,13,12,11,10,9,16,23,30,37,38,39,40,41,34,33,32,31,24,17,18,19,26,25];
const p3 = [39,40,41,34,27,20,13,12,11,10,9,16,23,30,37,38,31,24,17,18,19,26,33,32,25];
const p4 = [23,30,37,38,39,40,41,34,27,20,13,12,11,10,9,16,17,18,19,26,33,32,31,24,25];
console.log(p1.length);
let playerPiecePos = {}; 
let playerDetails;
let releasedPiecesCount = [0, 0, 0, 0];
let playerPiecesLocs = {};
const playerDiv = document.querySelector('.playerdisplay');
let gamewonstate ={};
let playercount = 0;

function createGrid(playerDetails) {
    const board = document.getElementById('board');
    // Clear the board
    board.innerHTML = '';

    // Initialize currentPlayerPosArr based on the number of players
    for (let i = 0; i < playerDetails.length; i++) {
        playercount += 1;
        currentPlayerPosArr.push(playerposarr[i]);
        gamewonstate[i+1] = false;
        playerPiecesLocs[i+1] = 0;
        playerPiecePos[i + 1] = eval(`p${i+1}`);
    }

    // Loop through the board squares
    for (let i = 1; i <= 49; i++) {
        let square;

        if (i < 8 || i % 7 === 0 || (i - 1) % 7 === 0 || i > 42) {
            if (currentPlayerPosArr.includes(i)) {
                // Create player square
                square = document.createElement('div');
                square.classList.add('playersquare');
                square.classList.add(`playersquare${i}`);
                square.classList.add(`playersquare${playerposorder[currentPlayerPosArr.indexOf(i)]}`);
                square.textContent = '';

                // border radius for playersquare
                if (i === 4) square.style.borderRadius = '30px 30px 0 0';
                else if (i === 22) square.style.borderRadius = '30px 0 0px 30px';
                else if (i === 28) square.style.borderRadius = '0px 30px 30px 0';
                else square.style.borderRadius = '0px 0 30px 30px';

                addPlayerPieces(square, playerDetails[currentPlayerPosArr.indexOf(i)].color, currentPlayerPosArr.indexOf(i) + 1);
            } else {
            
                square = document.createElement('div');
                square.classList.add('emptysquare');
                square.textContent = '';
            }
        } else {
            square = document.createElement('div');
            square.classList.add('square');
            square.classList.add(`square${i}`);
            square.textContent = '';

            if (safearr.includes(i) || i === winsquare) {
                const crossLine = document.createElement('div');
                crossLine.classList.add('cross-line');
                const verticalLine = document.createElement('div');
                verticalLine.classList.add('vertical-line');
                square.appendChild(verticalLine);
                square.appendChild(crossLine);
            }
            if (i === winsquare) {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                square.appendChild(circle);
            }
        }

        board.appendChild(square);
    }
}

//adding pieces
function addPlayerPieces(square, color, player) {
    for (let i = 0; i < 4; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(`player${player}-piece`);
        piece.style.backgroundColor = color;
        piece.setAttribute('data-moved', 'false'); 

        square.appendChild(piece); 
    }
}


//getting player details
function addPlayerDetails() {
    const numPlayers = document.getElementById('dropdownContent').childElementCount;
    const playerDetails = [];
    for (let i = 0; i < numPlayers; i++) {
        const playerName = prompt(`Enter Player ${i + 1} Name:`);
        const playerColor = prompt(`Enter Player ${i + 1} Color:`);
        playerDetails.push({ name: playerName, color: playerColor, hasWon: false });
    }

    localStorage.setItem('playerDetails', JSON.stringify(playerDetails));

    createGrid(playerDetails);
}

//on start updating values
document.addEventListener('DOMContentLoaded', function() {
    var storedPlayerDetails = localStorage.getItem('playerDetails');
    if (storedPlayerDetails) {
        var playerDetails = JSON.parse(storedPlayerDetails);
        console.log(playerDetails);
        createGrid(playerDetails); 
        playerDiv.textContent = playerDetails[currentPlayer]['name'];
    } else {
        console.error('No player details found in localStorage.');
    }

});

const outcomes = [1, 2, 3, 4, 8];
const playerIcons = document.querySelectorAll('.in1, .in2, .in3, .in4');
const displayDiv = document.querySelector('.display');
const rollButton = document.querySelector('.roll');
let currentPlayer = 0; 
let release21 = false;
let listenersAdded = {};
let move;
let autorelease = {0:true,1:true,2:true,3:true};
let manrelease = {0:false,1:false,2:false,3:false};
let steps;
let againmove = false;
let clickPiece = true;
let anyMovePossible;


//logic for roll value handling and all

//for dice rolling
function rollDice() {
    if (clickPiece) {
        move = false;
        const randomNumber = Math.floor(Math.random() * outcomes.length);
        const useroutcome = outcomes[randomNumber];
        console.log(useroutcome);
        displayDiv.textContent = useroutcome;
        animateRolling(clickPiece);
        clickPiece = false;
        console.log(`released player count:${releasedPiecesCount[currentPlayer-1]}`);
        pieceMove(useroutcome); 
        if (useroutcome == 4 || useroutcome == 8) {
            againmove = true;
        }
    }
}

//handling various senarios and problems
function pieceMove(rollValue) {
    anyMovePossible = false; 

    if (autorelease[currentPlayer - 1]) {
        clickPiece = true;
        if (rollValue == 4) {
            releasePiece(1);
            return;
        } else if (rollValue == 8) {
            releasePiece(2);
            return;
        }
    } else {
        manrelease[currentPlayer - 1] = true;
        move = true;
    }

    if (move) {
        const currentPlayerPieces = document.querySelectorAll(`.player${currentPlayer}-piece`);
        currentPlayerPieces.forEach(piece => {
            let currentSquareNum = parseInt(piece.parentElement.classList[1].replace('square', ''));
            let currentIndex = playerPiecePos[currentPlayer].indexOf(currentSquareNum);
            let newIndex = currentIndex + rollValue;

            // Check if this move is within the bounds and valid
            if (newIndex < playerPiecePos[currentPlayer].length && newIndex >= 0) {
                anyMovePossible = true; // Valid move found
            }
        });

        if (anyMovePossible) {
            addClickListenerToPieces(currentPlayerPieces);
        } else {
            console.log("No moves possible, skipping turn.");
            move = false;
            clickPiece = true;
        }
    } else {
        clickPiece = true;
    }
    if(!(rollValue==4 || rollValue==8)){
        if(releasedPiecesCount[currentPlayer-1]==0){
            clickPiece = true;
        }
    }
}

//detecting piece click and moving
function addClickListenerToPieces(pieces) {
    pieces.forEach(piece => {
        piece.addEventListener('click', function() {
            movePiece(piece);
        });
    });
    listenersAdded[currentPlayer] = true;
}

let animate;
let moveSound = new Audio('./audio/pieceMovement.mp3');
let pieceout = new Audio('./audio/pieceout.mp3');
moveSound.preload = 'auto';
pieceout.preload = 'auto';
let piecewin = new Audio('./audio/piecewin.mp3');
let playerwin = new Audio('./audio/playerwin.mp3');
piecewin.preload = 'auto';
playerwin.preload = 'auto';

function animatePieceMovement(piece, path, startIndex, endIndex) {
    
    let currentIndex = startIndex;
    animate = true;
    const movePieceStep = () => {
        if (currentIndex < endIndex) {
            const nextSquare = document.querySelector(`.square${path[currentIndex + 1]}`);
            nextSquare.appendChild(piece); 
            moveSound.play();
            currentIndex++;
            setTimeout(movePieceStep, 300);
        }
        else{
            animate = false;
        }
    };
    if(animate)
        movePieceStep(); // Start the animation
}

//piece movement logic
function movePiece(piece) {
    steps = parseInt(displayDiv.textContent);
    if (release21) {
        steps = 4;
        release21 = false;
        move = true;
    }
    let playerSquare = piece.parentElement;
    let currentSquareNum = parseInt(playerSquare.classList[1].replace('square', ''));
    let pieceParentClass = playerSquare.classList[0];
    let piecePath = playerPiecePos[currentPlayer];
    
    if (piece.classList.contains(`player${currentPlayer}-piece`)) {
        let currentIndex = piecePath.indexOf(currentSquareNum);
        
        if (currentIndex === -1) { // If the piece is not yet on the path
            if (manrelease[currentPlayer - 1]) {
                clickPiece = true;
                if (steps == 4 || steps == 8) {
                    releasePiece(steps / 4); // Release 1 piece for 4, 2 for 8
                    manrelease[currentPlayer - 1] = false;
                    return;
                }
            }
            return;
        }

        if (!move) {
            return;
        }

        let newIndex = currentIndex + steps;
        if (newIndex >= 25) {
            console.log('Piece cannot move beyond the board end.'); // Notify user or handle accordingly
            return; // Prevent moving beyond the path
        }
        if(newIndex==24)
            piecewin.play();
        if (newIndex >= 0 && newIndex < piecePath.length) {
            let newSquareNum = piecePath[newIndex];
            const newSquare = document.querySelector(`.square${newSquareNum}`);

            if (newSquare) {    
                if(!safearr.includes(newSquareNum)){
                    const opponentPieces = newSquare.querySelectorAll(`.piece:not(.player${currentPlayer}-piece)`);
                    console.log("killing");
                    if (opponentPieces.length > 0) {
                        // Capture all opponent pieces on the square
                        opponentPieces.forEach(opponentPiece => {
                            sendPieceHome(opponentPiece); // Function to send piece back to start
                        });
                    }
                }
                animatePieceMovement(piece, piecePath, currentIndex, newIndex);
                piece.setAttribute('data-moved', 'true');
                move = false;
                manrelease[currentPlayer - 1] = false;
                clickPiece = true;
                if (newSquareNum === winsquare) {
                    checkWinCondition(currentPlayer);
                }
            } else {
                console.error("New square not found.");
            }
        } else {
            console.error('Piece cannot move beyond the board.');
        }
    } else {
        console.error("It's not your turn or this piece is not released yet.");
    }
}

function sendPieceHome(opponentPiece) {
    let opponentPlayerIndex = getPlayerIndexByPiece(opponentPiece);
    const opponentStartingSquare = document.querySelector(`.playersquare${playerposarr[opponentPlayerIndex - 1]}`);
    
    if (opponentStartingSquare) {
        clickPiece = true;
        pieceout.play();
        opponentStartingSquare.appendChild(opponentPiece);
        releasedPiecesCount[opponentPlayerIndex-1]--;
    } else {
        clickPiece = true;
        console.error("Cannot find the starting square for the opponent piece.");
    }
}

//get player number by piece
function getPlayerIndexByPiece(piece) {
    for (let i = 1; i <= playerDetails.length; i++) {
        if (piece.classList.contains(`player${i}-piece`)) {
            return i;
        }
    }
    return -1;
}


//piece releasing logic
function releasePiece(player) {
    const playerSquare = document.querySelector(`.playersquare${playerposarr[currentPlayer-1]}`);
    
    if (playerSquare) {
        const playerPieces = playerSquare.querySelectorAll('.piece');
        if(player == 2){
            if(playerPieces.length==1){
                release21 = true;
                player = 1;
                move = true;
            }
        }
        // Check if there are unreleased pieces
        if (playerPieces.length > 0) {
        
            for (let i = 0; i < player; i++) {
                const piece = playerPieces[i];
                const releaseSquare = document.querySelector(`.square${playerReleaseArr[currentPlayer-1]}`);
                releaseSquare.appendChild(piece);
                moveSound.play();
                releasedPiecesCount[currentPlayer-1]++; 
                autorelease[currentPlayer-1] = false;
                move = false;
            }
        } else {
            move = true;
            console.log("No unreleased pieces for this player.");
        }
    } else {
        console.error("Player square not found.");
    }
}

function updatePickles(value) {
    playerIcons.forEach((icon, index) => {
        if (index < value) {
            if(value==8){
                icon.classList.remove('white');
                icon.classList.add('black');
            }
            else{
                icon.classList.add('black');
                icon.classList.add('white');
            }
        } else {
            icon.classList.remove('white');
            icon.classList.add('black');
        }
    });
}

//for animating pickles which are like dice in asta chamma
function animateRolling(clickPiece) {
    let animationCount = 0;

    playerIcons.forEach((icon, index) => {
        icon.style.animation = 'none'; 
        void icon.offsetWidth; 
    });

    // Apply animation to each pickle separately
    playerIcons.forEach((icon, index) => {
        // Defining keyframes with random positions
        const randomXStart = Math.floor(Math.random() * 300);
        const randomYStart = Math.floor(Math.random() * 500);
        const randomXEnd = Math.floor(Math.random() * 300);
        const randomYEnd = Math.floor(Math.random() * 500);

        const keyframes = `
            @keyframes movePickles${index + 1} {
                0% {
                    left: ${randomXStart}px;
                    top: ${randomYStart}px;
                }
                100% {
                    left: ${randomXEnd}px;
                    top: ${randomYEnd}px;
                }
            }
        `;
        const style = document.createElement('style');
        style.dataset.index = `movePickles${index + 1}`; 
        style.innerHTML = keyframes;
        document.head.appendChild(style);

        icon.style.animation = `movePickles${index + 1} 2s ease-in-out forwards`;
            
        icon.addEventListener('animationend', () => {
            animationCount++;
            if (animationCount === playerIcons.length) {
                playerIcons.forEach((_, index) => {
                    const style = document.head.querySelector(`style[data-index="movePickles${index + 1}"]`);
                    if (style) {
                        document.head.removeChild(style);
                    }
                });
            }
        });
    });

    updatePickles(Number(displayDiv.textContent));
    
    if(againmove){
        againmove = false;
        return;
    }
    if(clickPiece){
        toggleNextPlayer();
    }
}

let wonTrueCount = 0;
function checkWinCondition(player) {
    const piecesOnWinSquare = document.querySelectorAll(`.square${winsquare} .player${player}-piece`);
    if (piecesOnWinSquare.length === 4) {
        console.log(`Player ${player} has won!`);
        gamewonstate[player] = true;
        wonTrueCount += 1;
        checkGameOver();
        // Removing three pieces as a symbol of winning
        for (let i = 0; i < 3; i++) {
            if (piecesOnWinSquare[i]) {
                piecesOnWinSquare[i].remove();
            }
        }
        playerDetails[player - 1].hasWon = true;
        alert(`Congratulations ${playerDetails[player - 1].name}, you have won!`);
    }
}

function checkGameOver() {
    console.log(`won players no:${wonTrueCount}`);
    console.log(`player count :${playercount}`)
    if (wonTrueCount == playercount-1) {
        console.log("Game over!");
        const newGameBtn = document.getElementById('new-game-btn');
        newGameBtn.style.display = 'block'; // Make the button visible
        newGameBtn.addEventListener('click', function() {
            window.location.href = 'menu.html';
        });
    }
}


function toggleNextPlayer() {
    var storedPlayerDetails = localStorage.getItem('playerDetails');
    if (storedPlayerDetails) {
        playerDetails = JSON.parse(storedPlayerDetails);
        console.log(playerDetails);
    } else {
        console.error('No player details found in localStorage.');
    }
    currentPlayer = (currentPlayer % playerDetails.length) + 1;

    if(gamewonstate[currentPlayer]){
        currentPlayer = (currentPlayer % playerDetails.length) + 1;
    }

    // Removing blink class from all player squares
    document.querySelectorAll('.playersquare').forEach(square => {
        square.classList.remove('blink');
    });

    // Adding blink class to the current player's square
    const currentPlayerSquare = document.querySelector(`.playersquare${playerposarr[currentPlayer-1]}`);
    if (currentPlayerSquare) {
        currentPlayerSquare.classList.add('blink');
    }

    // To update the player display
    playerDiv.textContent = playerDetails[currentPlayer-1]['name'];
    console.log(`player${currentPlayer}`);
}

rollButton.addEventListener('click', rollDice);

document.getElementById('exit-icon').addEventListener('click', function() {
    window.location.href = 'index.html';
});


