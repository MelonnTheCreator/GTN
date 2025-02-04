const levelDisplay = document.getElementById('level-display');
const rangeDisplay = document.getElementById('range-display');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const messageDisplay = document.getElementById('message');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginButton = document.getElementById('admin-login');
const adminCloseButton = document.getElementById("admin-close");
const adminControlsDiv = document.getElementById('admin-controls');
const levelMenuDiv = document.getElementById('level-menu');
const title = document.getElementById('title');
const adminSecretDisplay = document.getElementById("admin-secret-display");
const secretNumberValue = document.getElementById("secret-number-value");
const levelMenuButton = document.getElementById("level-menu-button");
const levelMenuContainer = document.getElementById("level-menu-container");
const level100Counter = document.getElementById("level-100-count");
const lastGuessDisplay = document.getElementById("last-guess-display");
const leaderboardArea = document.getElementById("leaderboard-area");
const leaderboardList = document.getElementById("leaderboard-list");
const adminMenuButton = document.getElementById("admin-menu-button");
const adminMenuContainer = document.getElementById("admin-menu-container");
const resetButton = document.getElementById("reset-button");
const resetDataButton = document.getElementById("reset-data-button");


let currentLevel = 1;
let secretNumber;
let maxNumber;
let unlockedLevels = 1;
let level100Count = 0;
let lastGuess = "None";
const adminPassword = "Kameron Grant";
let adminModeActive = false;


function calculateMaxNumber() {
    if (currentLevel <= 10) {
        return 10 * (10 ** (currentLevel - 1));
    } else {
        return 10 * (10**9) +  ((currentLevel - 10) * (10 ** 9));
    }
}

function startNewLevel() {
    maxNumber = calculateMaxNumber();
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    rangeDisplay.textContent = `Guess between 1 and ${maxNumber}`;
    levelDisplay.textContent = `Level: ${currentLevel}`;
    guessInput.value = '';
    guessInput.focus();
    messageDisplay.textContent = '';
     if (adminModeActive){
        adminSecretDisplay.classList.remove("hidden");
         secretNumberValue.textContent = secretNumber;
     }
       level100Counter.classList.remove("hidden");
      level100Counter.textContent = `Level 100 Completions: ${level100Count}`;


         lastGuess = "None";
         lastGuessDisplay.textContent = `Last Guess: ${lastGuess}`;

}


function checkGuess() {
    const guess = parseInt(guessInput.value);
     lastGuess = guess;
    lastGuessDisplay.textContent = `Last Guess: ${lastGuess}`;

    if(isNaN(guess)){
        messageDisplay.textContent = "Invalid input. Please enter a number."
         guessInput.value = "";
        return
    }


    if (guess === secretNumber) {
        messageDisplay.textContent = `Congratulations! You guessed the number ${secretNumber} correctly!`;
        unlockedLevels = Math.max(unlockedLevels, currentLevel + 1);

         if(currentLevel === 100){
            level100Count++;
         }


        if (currentLevel < 100) {
             currentLevel++;
        }
      
        saveGameData();
         setTimeout(startNewLevel, 1000);
         guessInput.value = "";
       

    } else if (guess < secretNumber) {
        messageDisplay.textContent = 'Too low! Try again.';
        guessInput.value = "";

    } else {
        messageDisplay.textContent = 'Too high! Try again.';
        guessInput.value = "";
    }
}



function setupLevelMenu(){
    levelMenuDiv.innerHTML = "";
    for(let i = 1; i <= 100; i++){
        const levelItem = document.createElement("div");
        levelItem.textContent = `Level ${i}`;
        levelItem.classList.add("level-item");

        levelItem.classList.add(i <= unlockedLevels || adminModeActive ? "unlocked" : "locked")
        levelItem.addEventListener('click', () => {
             if(i <= unlockedLevels || adminModeActive){
                  currentLevel = i;
                 startNewLevel();
                 updateLevelMenu();
                 toggleLevelMenu();
             }
            
        });
         if(i === currentLevel) {
             levelItem.classList.add("current");
         }

         levelMenuDiv.appendChild(levelItem)
    }
}

function updateLevelMenu() {
       setupLevelMenu();
}


function toggleAdminMode() {
     adminModeActive = !adminModeActive;
        if(adminModeActive){
           adminControlsDiv.classList.remove("hidden");
             adminSecretDisplay.classList.remove("hidden");
              adminCloseButton.classList.remove("hidden");
              resetDataButton.classList.remove("hidden")
            secretNumberValue.textContent = secretNumber;
             title.textContent = "Admin mode"
              leaderboardArea.classList.remove("hidden");
               updateLeaderboard();
        } else{
            adminControlsDiv.classList.add("hidden");
            adminSecretDisplay.classList.add("hidden");
               adminCloseButton.classList.add("hidden");
                resetDataButton.classList.add("hidden")
            title.textContent = "Guess the Number"
             leaderboardArea.classList.add("hidden");

        }
     
}
function updateLeaderboard(){
      leaderboardList.innerHTML = "";
    const sortedUsers = Object.entries(userScores).sort(([,a],[,b]) =>(b?.level100Count || 0) - (a?.level100Count || 0));
        sortedUsers.forEach(([user, score]) =>{
            const leaderboardItem = document.createElement("div");
            leaderboardItem.textContent = `${user}: ${score?.level100Count || 0}`
            leaderboardList.appendChild(leaderboardItem);
        })
}
function loadGameData(){
    const savedData = localStorage.getItem("guessTheNumberGame");
    if(savedData){
        const parsedData = JSON.parse(savedData);
        currentLevel = parsedData.level;
        unlockedLevels = parsedData.unlockedLevels;
         level100Count = parsedData.level100Count || 0;
    }
}
function saveGameData(){
    const data = {
        level: currentLevel,
        unlockedLevels: unlockedLevels,
           level100Count: level100Count,
    }
    localStorage.setItem("guessTheNumberGame", JSON.stringify(data));
}
function closeAdminMode(){
    adminModeActive = false
    adminControlsDiv.classList.add("hidden");
    adminSecretDisplay.classList.add("hidden");
      adminCloseButton.classList.add("hidden");
      resetDataButton.classList.add("hidden")
      title.textContent = "Guess the Number"
        updateLevelMenu();
        leaderboardArea.classList.add("hidden")
}
function toggleLevelMenu(){
    levelMenuDiv.classList.toggle("active");
}

function toggleAdminMenu(){
      adminControlsDiv.classList.toggle("active")
}
function resetGame(){
     currentLevel = 1;
       unlockedLevels = 1;
      saveGameData();
     startNewLevel();
     updateLevelMenu();
}
function resetData(){
   localStorage.removeItem("guessTheNumberGame");
    currentLevel = 1;
    unlockedLevels = 1;
    level100Count = 0;
    startNewLevel();
     updateLevelMenu();

}

adminMenuButton.addEventListener("click", toggleAdminMenu)
adminCloseButton.addEventListener("click", closeAdminMode)
guessButton.addEventListener('click', checkGuess);
adminLoginButton.addEventListener('click', () => {
     const enteredPassword = adminPasswordInput.value;
    if(enteredPassword === adminPassword){
        toggleAdminMode()
    } else {
        alert("incorrect password")
    }
});
levelMenuButton.addEventListener("click", toggleLevelMenu);
resetButton.addEventListener("click", resetGame)
resetDataButton.addEventListener("click", resetData)
window.addEventListener("click", (event)=>{
    if(!event.target.closest("#level-menu-container")){
          levelMenuDiv.classList.remove("active")
    }
    if(!event.target.closest("#admin-menu-container")){
         adminControlsDiv.classList.remove("active")
    }
})
guessInput.addEventListener("keyup", function(event){
    if(event.key === "Enter"){
        checkGuess()
    }
})
loadGameData();
updateLevelMenu();