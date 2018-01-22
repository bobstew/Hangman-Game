//Hangman Robert Stewart

'use strict';

var wordList =           // Word list
    ["TOKYO", "SEOUL", "CHONGQING", "SHANGHAI", "DELHI", "BEIJING",
"MUMBAI", "LAGOS", "KARACHI", "DHAKA", "ISTANBUL", "MOSCOW", "LAHORE",
"CAIRO", "JAKARTA", "LIMA", "LONDON", "HYDERABAD", "BANGKOK", "TEHRAN",
"BOGOTA", "BAGHDAD", "HANOI" 
       
    ];

//maxTry is number of tries for game
//guessedLetters stores letters that were guessed
//currentWord is the current wods selected
//guessingWord word built to match currnt word
//remaningGuesses is pretty self explnatory
//hasFinished is condition to restart
//wins tracks the players wins

const maxTry = 6;            
var guessedLetters = [];        
var currentWord;           
var guessingWord = [];          
var remainingGuesses = 0;     
var hasFinished = false;       
var wins = 0;                   

// Game sounds

var keySound = new Audio('assets/sounds/klaxon_ahooga.wav');
var winSound = new Audio('assets/sounds/you-win.wav');
var loseSound = new Audio('assets/sounds/you-lose.wav');

// Reset  game-level variables

function resetGame() {
    remainingGuesses = maxTry;

    // picks a random word from wordList array

    currentWord = Math.floor(Math.random() * (wordList.length));

    // Clear out arrays from previous game

    guessedLetters = [];
    guessingWord = [];

    // Clear Image of "hung man"

    document.getElementById("hangmanImage").src = "";

    // Build the guessing word and clear it out

    for (var i = 0; i < wordList[currentWord].length; i++) {
        guessingWord.push("_");
    }   

    // Hide game over and win images/text

    document.getElementById("pressKeyTryAgain").style.cssText= "display: none";
    document.getElementById("gameover-image").style.cssText = "display: none";
    document.getElementById("youwin-image").style.cssText = "display: none";

    // Show display

    updateDisplay();
};

//  Updates the display on the HTML Page


function updateDisplay() {

    document.getElementById("totalWins").innerText = wins;

    // Display how much of the word we've already guessed on screen.
    // Printing the array would add commas (,) - so we concatenate a string from each value in the array.

    var guessingWordText = "";
    for (var i = 0; i < guessingWord.length; i++) {
        guessingWordText += guessingWord[i];
    }

    //
    document.getElementById("currentWord").innerText = guessingWordText;
    document.getElementById("remainingGuesses").innerText = remainingGuesses;
    document.getElementById("guessedLetters").innerText = guessedLetters;
};


// Updates the image depending on how many guesses

function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "assets/images/" + (maxTry - remainingGuesses) + ".png";
};

// takes letter and find all instances in string

function evaluateGuess(letter) {

    // stores position of letter in string

    var positions = [];

    // Loop through word finding all instances of guessed letter, store in an array.

    for (var i = 0; i < wordList[currentWord].length; i++) {
        if(wordList[currentWord][i] === letter) {
            positions.push(i);
        }
    }

    // if there are no indicies, remove a guess and update the hangman image

    if (positions.length <= 0) {
        remainingGuesses--;
        updateHangmanImage();
    } else {

        // Loop through all the indicies and replace the '_' with a letter.

        for(var i = 0; i < positions.length; i++) {
            guessingWord[positions[i]] = letter;
        }
    }
};
// check for win by seeing if any _ remains

function checkWin() {
    if(guessingWord.indexOf("_") === -1) {
        document.getElementById("youwin-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
        wins++;
        winSound.play();
        hasFinished = true;
    }
};


// Checks for a loss

function checkLoss()
{
    if(remainingGuesses <= 0) {
        loseSound.play();
        document.getElementById("gameover-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText = "display:block";
        hasFinished = true;
    }
}

// Makes a guess

function makeGuess(letter) {
    if (remainingGuesses > 0) {

        // Make sure we didn't use this letter yet

        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        }
    }
    
};


// 

document.onkeydown = function(event) {

    // If we finished a game, dump one keystroke and reset.

    if(hasFinished) {
        resetGame();
        hasFinished = false;
    } else {

        // make sure a letter was pressed

        if(event.keyCode >= 65 && event.keyCode <= 90) {
            keySound.play();
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        }
    }
};