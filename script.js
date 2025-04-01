const bird = document.getElementById('bird');
const ground = document.getElementById('ground');
const gameContainer = document.querySelector('.game-container');
const startBtn = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');

let birdY = 250; 
let gravity = 0.23; 
let velocity = 0; 
let isGameOver = false;
let pipes = [];
let pipeInterval;
let pipeWidth = 50; 
let pipeGap = 250; 
let pipeIntervalTime = 1500; 
let score = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isGameOver) {
        velocity = -7; 
    }
});
document.addEventListener("click", () => {
    if(!isGameOver) {
        velocity = -7;
    }
});

function moveBird() {
    if (!isGameOver) {
        velocity += gravity; 
        birdY += velocity; 

        if (birdY < 0) birdY = 0; 
        if (birdY > gameContainer.clientHeight - 60) {
            birdY = gameContainer.clientHeight - 60;
            gameOver(); 
        }

        bird.style.top = birdY + 'px'; 
    }
}


function generatePipes() {
    if (isGameOver) return; 

    const pipeHeight = Math.floor(Math.random() * (gameContainer.clientHeight - pipeGap));
    const bottomPipeHeight = gameContainer.clientHeight - pipeHeight - pipeGap;

    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe');
    topPipe.style.width = pipeWidth + 'px';
    topPipe.style.height = pipeHeight + 'px';
    topPipe.style.top = 0;
    topPipe.style.left = gameContainer.clientWidth + 'px'; 
    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.width = pipeWidth + 'px';
    bottomPipe.style.height = bottomPipeHeight + 'px';
    bottomPipe.style.bottom = 0;
    bottomPipe.style.left = gameContainer.clientWidth + 'px'; 

    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);

    pipes.push({ topPipe, bottomPipe });
}

function movePipes() {
    pipes.forEach(pipe => {
        const pipeLeft = parseInt(pipe.topPipe.style.left, 10);
        pipe.topPipe.style.left = pipeLeft - 2 + 'px';
        pipe.bottomPipe.style.left = pipeLeft - 2 + 'px';

        const birdRect = bird.getBoundingClientRect(); // Pega a posição real do pássaro

    pipes.forEach(pipe => {
        const topPipeRect = pipe.topPipe.getBoundingClientRect();
        const bottomPipeRect = pipe.bottomPipe.getBoundingClientRect();

        if (
            (birdRect.right > topPipeRect.left && birdRect.left < topPipeRect.right && birdRect.top < topPipeRect.bottom) ||
            (birdRect.right > bottomPipeRect.left && birdRect.left < bottomPipeRect.right && birdRect.bottom > bottomPipeRect.top)
        ) {
            gameOver();
        }

        if (pipeLeft + pipeWidth < 60 && !pipe.passed) {
            score++; 
            pipe.passed = true; 
            scoreDisplay.textContent = score; 
        }
});


        if (pipeLeft + pipeWidth < 60 && !pipe.passed) {
            score++; 
            pipe.passed = true; 
            scoreDisplay.textContent = score; 
        }

        if (pipeLeft < -pipeWidth) {
            gameContainer.removeChild(pipe.topPipe);
            gameContainer.removeChild(pipe.bottomPipe);
            pipes = pipes.filter(p => p !== pipe); 
        }
    });
}


function gameOver() {
    isGameOver = true; 
    pipes.forEach(pipe => {
        gameContainer.removeChild(pipe.topPipe);
        gameContainer.removeChild(pipe.bottomPipe);
    });
    pipes = []; 
    clearInterval(pipeInterval); 
    alert('Game Over! Pontuação final: ' + score);
    startBtn.style.display = 'block'; 
}

function gameLoop() {
    moveBird();
    movePipes();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop); 
    }
}

function startGame() {
    birdY = 250; 
    velocity = 0; 
    isGameOver = false; 
    pipes = []; 
    score = 0; 
    scoreDisplay.textContent = score; 
    startBtn.style.display = 'none'; 
    
    gameLoop();

    if (pipeInterval) {
        clearInterval(pipeInterval);
    }
    pipeInterval = setInterval(generatePipes, pipeIntervalTime); 
}

startBtn.addEventListener('click', startGame);
