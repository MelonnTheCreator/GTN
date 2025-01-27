let levelsUnlocked = localStorage.getItem('levelsUnlocked') ? parseInt(localStorage.getItem('levelsUnlocked')) : 1;
let level = 1, rangeEnd = 10, randomNumber = Math.floor(Math.random() * rangeEnd) + 1, attempts = 0, adminMode = false, guessCount = 0;
let level1000BeatenCount = localStorage.getItem('level1000BeatenCount') ? parseInt(localStorage.getItem('level1000BeatenCount')) : 0;
let levelStartTime, intervalId;

const bgMusic = document.getElementById('bg-music'), correctSound = document.getElementById('correct-sound'), wrongSound = document.getElementById('wrong-sound');
bgMusic.play();

const generateLevelButtons = () => {
    const levelButtonsContainer = document.getElementById('level-buttons');
    levelButtonsContainer.innerHTML = '';
    for (let i = 1; i <= 1000; i++) {
        const button = document.createElement('button');
        button.innerText = 'Level ' + i;
        button.classList.add('level-button');
        button.disabled = i > levelsUnlocked;
        if (i === level) {
            button.classList.add('current-level');
        }
        button.onclick = () => selectLevel(i);
        levelButtonsContainer.appendChild(button);
    }
    document.getElementById('level1000BeatenCount').innerText = `Times Level 1000 Beaten: ${level1000BeatenCount}`;
};

const searchLevels = () => {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const buttons = document.querySelectorAll('.level-button');
    buttons.forEach(button => {
        if (button.innerText.toLowerCase().includes(query)) {
            button.style.display = 'inline-block';
        } else {
            button.style.display = 'none';
        }
    });
};

const selectLevel = (selectedLevel) => {
    level = selectedLevel;
    rangeEnd = level <= 10 ? Math.pow(10, level) : (level - 10) * 1000000000 + Math.pow(10, 10);
    randomNumber = Math.floor(Math.random() * rangeEnd) + 1;
    document.getElementById('rangeEnd').innerText = rangeEnd;
    document.getElementById('level').innerText = level;
    document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
    document.querySelector('.menu-container').classList.remove('active');
    document.querySelector('.game-container').classList.add('active');
    guessCount = 0;
    document.getElementById('guessCount').innerText = guessCount;
    levelStartTime = new Date();
    clearInterval(intervalId);
    intervalId = setInterval(updateTime, 1000);
};

const checkGuess = () => {
    let userGuess = document.getElementById("guessInput").value, result = document.getElementById("result"), lastGuess = document.getElementById("lastGuess");
    lastGuess.innerHTML = `Last Guess: ${userGuess}`;
    attempts++;
    guessCount++;
    document.getElementById('guessCount').innerText = guessCount;
    if (userGuess == randomNumber) {
        correctSound.play();
        if (level < 1000) {
            levelsUnlocked = Math.max(levelsUnlocked, level + 1);
            localStorage.setItem('levelsUnlocked', levelsUnlocked);
            result.innerHTML = `Correct! You have unlocked level ${level + 1}.`;
            result.classList.remove("wrong");
            result.classList.add("correct");
            selectLevel(level + 1); // Automatically go to the next level
        } else {
            result.innerHTML = `Congratulations! You've completed all levels.`;
            level1000BeatenCount++;
            localStorage.setItem('level1000BeatenCount', level1000BeatenCount);
            document.getElementById('level1000BeatenCount').innerText = `Times Level 1000 Beaten: ${level1000BeatenCount}`;
            resetLevels();
            result.classList.remove("wrong");
            result.classList.add("correct");
        }
        clearInput();
    } else {
        wrongSound.play();
        result.innerHTML = userGuess < randomNumber ? "Too low! Try again." : "Too high! Try again.";
        result.classList.remove("correct");
        result.classList.add("wrong");
        clearInput();
    }
};

const clearInput = () => { document.getElementById("guessInput").value = ''; };

const resetLevels = () => {
    levelsUnlocked = 1;
    localStorage.setItem('levelsUnlocked', levelsUnlocked);
    generateLevelButtons();
    exitAdminMode(); // Exit admin mode on reset
};

const showAdminLogin = () => {
    let password = prompt("Enter admin password:");
    if (password === "Kameron Grant") enterAdminMode();
    else alert("Incorrect password.");
};

const enterAdminMode = () => {
    document.getElementById('adminControls').classList.add('active');
    adminMode = true;
    document.getElementById('adminAnswer').innerText = randomNumber;
};

const exitAdminMode = () => {
    document.getElementById('adminControls').classList.remove('active');
    adminMode = false;
};

const setLevel = () => {
    let newLevel = parseInt(document.getElementById('newLevel').value);
    if (newLevel >= 1 && newLevel <= 1000) {
        level = newLevel;
        rangeEnd = level <= 10 ? Math.pow(10, level) : (level - 10) * 1000000000 + Math.pow(10, 10);
        randomNumber = Math.floor(Math.random() * rangeEnd) + 1;
        document.getElementById('rangeEnd').innerText = rangeEnd;
        document.getElementById('level').innerText = level;
        document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
        alert(`Level set to ${newLevel}.`);
    } else {
        alert("Invalid level. Please enter a level between 1 and 1000.");
    }
};

const setCustomAnswer = () => {
    let customAnswer = parseInt(document.getElementById('customAnswer').value);
    if (customAnswer >= 1 && customAnswer <= rangeEnd) {
        randomNumber = customAnswer;
        document.getElementById('adminAnswer').innerText = randomNumber; // Update correct answer in real time
        alert(`Answer set to ${customAnswer}.`);
    } else {
        alert(`Invalid answer. Please enter a number between 1 and ${rangeEnd}.`);
    }
};

const showLevelMenu = () => {
    document.querySelector('.game-container').classList.remove('active');
    document.querySelector('.menu-container').classList.add('active');
    generateLevelButtons(); // Refresh level buttons to highlight the current level
};

const updateTime = () => {
    const now = new Date();
    const elapsedTime = Math.floor((now - levelStartTime) / 1000);
    document.getElementById('timeSpent').innerText = elapsedTime;
};

document.addEventListener('DOMContentLoaded', () => {
    generateLevelButtons(); // Initialize level buttons on page load
    selectLevel(levelsUnlocked); // Automatically go to the level the user is on
});

document.getElementById("guessInput").addEventListener("keypress", (event) => { if (event.key === "Enter") checkGuess(); });
