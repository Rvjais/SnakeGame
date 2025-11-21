// ============================================
// IMAGE CONFIGURATION - Change images here!
// ============================================
// To use images, set useImages to true and provide image paths
// For circular snake, use a circular image file
const imageConfig = {
    useImages: true,  // Set to true to use images instead of colors

    // Snake head image (circular or any shape)
    snakeHead: 'img/snake.jpg',  // Change this path to your image

    // Snake body image (circular or any shape)
    snakeBody: 'img/snake.jpg',  // Change this path to your image

    // Food image
    food: 'img/food.jpg'  // Change this path to your food image
};
// ============================================

// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
            // Apply image if enabled
            if (imageConfig.useImages && imageConfig.snakeHead) {
                snakeElement.classList.add('with-image');
                snakeElement.style.backgroundImage = `url('${imageConfig.snakeHead}')`;
            }
        }
        else {
            snakeElement.classList.add('snake');
            // Apply image if enabled
            if (imageConfig.useImages && imageConfig.snakeBody) {
                snakeElement.classList.add('with-image');
                snakeElement.style.backgroundImage = `url('${imageConfig.snakeBody}')`;
            }
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    // Apply image if enabled
    if (imageConfig.useImages && imageConfig.food) {
        foodElement.classList.add('with-image');
        foodElement.style.backgroundImage = `url('${imageConfig.food}')`;
    }
    board.appendChild(foodElement);


}


// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 } // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }

});


// Difficulty Buttons
let easyBtn = document.getElementById('easy');
let mediumBtn = document.getElementById('medium');
let hardBtn = document.getElementById('hard');

easyBtn.addEventListener('click', () => {
    speed = 5;
    startGame();
});

mediumBtn.addEventListener('click', () => {
    speed = 10;
    startGame();
});

hardBtn.addEventListener('click', () => {
    speed = 15;
    startGame();
});
let currentDifficulty = document.getElementById('current-difficulty');
function startGame() {
    if (speed === 5) {
        currentDifficulty.textContent = 'Easy';
    } else if (speed === 10) {
        currentDifficulty.textContent = 'Medium';
    } else if (speed === 15) {
        currentDifficulty.textContent = 'Hard';
    }
    alert(`Game started with ${currentDifficulty.textContent} difficulty!`);
}

// ============================================
// Mobile Control Buttons
// ============================================
function handleDirection(x, y) {
    // Prevent reverse direction
    if (inputDir.x === 0 && inputDir.y === 0) {
        // Game not started, allow any direction
        inputDir = { x: x, y: y };
        moveSound.play();
        return;
    }

    // Prevent going opposite direction
    if (x !== 0 && inputDir.x !== -x) {
        inputDir = { x: x, y: 0 };
        moveSound.play();
    } else if (y !== 0 && inputDir.y !== -y) {
        inputDir = { x: 0, y: y };
        moveSound.play();
    }
}

// Get mobile control buttons
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

// Add touch and click events for mobile controls
btnUp.addEventListener('click', () => handleDirection(0, -1));
btnUp.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection(0, -1);
});

btnDown.addEventListener('click', () => handleDirection(0, 1));
btnDown.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection(0, 1);
});

btnLeft.addEventListener('click', () => handleDirection(-1, 0));
btnLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection(-1, 0);
});

btnRight.addEventListener('click', () => handleDirection(1, 0));
btnRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection(1, 0);
});

