// Store possible choices in an array
const choices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Store scores in an object
const score = {
    player: 0,
    computer: 0
};

// Game settings
const winningScore = 3;
let computerChoice;
let roundFinished = false;
let gameFinished = false;

// Get HTML elements
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const resetBtn = document.getElementById("reset-btn");
const nextRoundBtn = document.getElementById("next-round-btn");

const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
const highScoreDisplay = document.getElementById("high-score");

const resultMessage = document.getElementById("result-message");
const turnMessage = document.getElementById("turn-message");
const roundMessage = document.getElementById("round-message");

const winnerScreen = document.getElementById("winner-screen");
const winnerTitle = document.getElementById("winner-title");
const winnerMessage = document.getElementById("winner-message");
const playAgainBtn = document.getElementById("play-again-btn");

// Load high score from localStorage
let highScore = Number(localStorage.getItem("guessGameHighScore")) || 0;

highScoreDisplay.textContent = highScore;


// Generate a random number
function generateNumber() {

    return choices[
        Math.floor(Math.random() * choices.length)
    ];

}


// Start a new round
function startRound() {

    computerChoice = generateNumber();

    roundFinished = false;

    guessInput.value = "";

    resultMessage.textContent = "Good luck! 🍀";

    turnMessage.textContent = "Your turn! Make a guess.";

    roundMessage.textContent =
        `Best of 5 — First to ${winningScore} wins!`;

    guessBtn.disabled = false;

    nextRoundBtn.hidden = true;

}


// Sound effects using Web Audio API
function playSound(type) {

    const audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    if (type === "win") {

        oscillator.frequency.value = 700;

    } else {

        oscillator.frequency.value = 200;

    }

    oscillator.type = "sine";

    gain.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4
    );

    oscillator.start();

    oscillator.stop(audioContext.currentTime + 0.4);

}


// Update high score
function updateHighScore() {

    // Save total player points across matches
    if (score.player > highScore) {

        highScore = score.player;

        localStorage.setItem(
            "guessGameHighScore",
            highScore
        );

        highScoreDisplay.textContent = highScore;

    }

}


// Update the scoreboard
function updateScore() {

    playerScore.textContent = score.player;

    computerScore.textContent = score.computer;

}


// Check if the match has a winner
function checkWinner() {

    if (score.player === winningScore) {

        gameFinished = true;

        winnerTitle.textContent = "🏆 You Won!";

        winnerMessage.textContent =
            "Amazing! You defeated the computer!";

        winnerScreen.classList.add("show");

    } else if (score.computer === winningScore) {

        gameFinished = true;

        winnerTitle.textContent = "🤖 Computer Wins!";

        winnerMessage.textContent =
            "Good game! The computer won this match.";

        winnerScreen.classList.add("show");

    }

}


// Handle player guess
guessBtn.addEventListener("click", function () {

    const playerGuess = Number(guessInput.value);

    // Validate input
    if (
        guessInput.value.trim() === "" ||
        !choices.includes(playerGuess)
    ) {

        resultMessage.textContent =
            "Please enter a number between 1 and 10!";

        return;

    }

    if (roundFinished || gameFinished) {
        return;
    }

    // Decide the round winner
    if (playerGuess === computerChoice) {

        score.player++;

        resultMessage.textContent =
            "🎉 Correct! You win this round!";

        playSound("win");

        updateHighScore();

    } else {

        score.computer++;

        if (playerGuess > computerChoice) {

            resultMessage.textContent =
                "📉 Too high! Computer wins this round.";

        } else {

            resultMessage.textContent =
                "📈 Too low! Computer wins this round.";

        }

        playSound("lose");

    }

    // Update scores
    updateScore();

    // Finish current round
    roundFinished = true;

    guessBtn.disabled = true;

    turnMessage.textContent = "Round finished!";

    // Check match winner
    checkWinner();

    // Show next round button if match continues
    if (!gameFinished) {

        nextRoundBtn.hidden = false;

        roundMessage.textContent =
            `Score: ${score.player} - ${score.computer}`;

    }

});


// Start next round
nextRoundBtn.addEventListener("click", function () {

    if (!gameFinished) {

        startRound();

    }

});


// Reset the current match
function resetGame() {

    score.player = 0;

    score.computer = 0;

    gameFinished = false;

    winnerScreen.classList.remove("show");

    updateScore();

    startRound();

}


// Reset button
resetBtn.addEventListener("click", resetGame);


// Play again after match finishes
playAgainBtn.addEventListener("click", resetGame);


// Start the game
startRound();
