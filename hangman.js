const wordDisplay= document.querySelector(".worddisplay");
const guesstext= document.querySelector(".guess-text i");
const keyboarddiv= document.querySelector(".keyboard");
const hangmanimage= document.querySelector(".hangman-box img");
const gamemodel= document.querySelector(".game-model");
const playagainbtn= document.querySelector(".play-again");
const score= document.querySelector(".Scoreboard");
const best= document.querySelector(".bestscore");

let currentword, correctletters, wrongguesscnt;
let usedword=[];
let bestcnt=0;
let scorecnt=0;
const maxguesscnt=6;

const resetgame=()=>{
    usedword=[];
    correctletters=[];
    wrongguesscnt=0;
    hangmanimage.src= `hangman-game-images/images/hangman-${wrongguesscnt}.svg`;
    guesstext.innerText= `${wrongguesscnt} / ${maxguesscnt}`;
    keyboarddiv.querySelectorAll("button").forEach(btn => btn.disabled=false);
    gamemodel.classList.remove("show");
}

const getRandomword= () =>{
    if (usedword.length === wordlist.length) {
        alert("You've guessed all words! Starting over.");
        usedword = []; // Reset only when all words have been used
    }

    let randomIndex, selectedWord;
    do {
        randomIndex = Math.floor(Math.random() * wordlist.length);
        selectedWord = wordlist[randomIndex].movie;
    } while (usedword.includes(selectedWord));
    usedword.push(selectedWord);

    const {movie, hint}= wordlist[randomIndex];
    // console.log(movie,hint);
    currentword=movie;
    document.querySelector(".hint-text i").innerText= hint;
    wordDisplay.innerHTML = movie.split("").map(letter =>                                  //This splits the movie string into an array of individual characters.
        letter === " " ? `<li class="space"></li>` : `<li class="letter"></li>`            //If the character is a space (" "),Otherwise (any other letter), it returns a list item
    ).join(""); 
    
    resetgame();
}

const gameOver= (isVictory) =>{
    if(isVictory){
        scorecnt+=10;
    }
    else{
        if(scorecnt>bestcnt){
        bestcnt=scorecnt;
        scorecnt=0;
        }
        else{
            bestcnt=bestcnt;
            scorecnt=0;
        }
        
    }
    score.innerText=`Score: ${scorecnt}`;
    best.innerText=`Best: ${bestcnt}`;


    setTimeout(()=>{
        const modaltext= isVictory? `You found the word:` : `The correct word was:`;
        gamemodel.querySelector("img").src=`hangman-game-images/images/${isVictory ? 'victory':'lost'}.gif`;
        gamemodel.querySelector("h4").innerText=`${isVictory ? 'Congrats!' : 'Game over!'}`;
        gamemodel.querySelector("b").innerHTML=`<b>${currentword}</b>`;
        gamemodel.classList.add("show");
        playagainbtn.innerText= isVictory? `Next` : `Play again`;
    },300)
}

const initGame= (button, clickedletter)=>{
    if(currentword.includes(clickedletter)){
        // console.log(`${clickedletter} letter exists in movie`);
        [...currentword].forEach((letter, index)=>{
            if(letter==clickedletter){
                correctletters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText= letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    }
    else{
        // console.log(`${clickedletter} letter does not exist in movie`);
        wrongguesscnt++;
        hangmanimage.src= `hangman-game-images/images/hangman-${wrongguesscnt}.svg`;
    }

    button.disabled= true; //disable button taaki usko waapis click na karpaaye
    guesstext.innerText= `${wrongguesscnt} / ${maxguesscnt}`;

    const totalLetters = currentword.replace(/\s/g, "").length;   //After removing all whitespace, this gets the number of remaining characters
    if(wrongguesscnt === maxguesscnt) return gameOver(false);
    if(correctletters.length === totalLetters){
        return gameOver(true);
    }
}

for(let i=97; i<=122; i++){
    const button = document.createElement("button");
    button.innerText= String.fromCharCode(i);
    keyboarddiv.appendChild(button);
    button.addEventListener("click", e=> initGame(e.target, String.fromCharCode(i)));
}

getRandomword();
playagainbtn.addEventListener("click", getRandomword);