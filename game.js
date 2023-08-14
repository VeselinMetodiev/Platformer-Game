const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;

let playerSpeed = 5;
let playerWidth = 50;
let playerHeight = 50;

// ball
playerX = canvas.width / 2;
playerY = 0;
const radius = 12;

let platformSpeed = 2;
let platformX = 0;
let platformY = 0;
let platformWidth = 100;
let platformHeight = 20;
let platforms = initializePlatforms();
// Array to hold the platforms
function initializePlatforms() {
  return [
    {
      x: Math.random() * (canvas.width - platformWidth),
      y: 600,
      width: platformWidth,
      height: platformHeight,
      isSpikes: false
    },
    {
      x: Math.random() * (canvas.width - platformWidth),
      y: 800,
      width: platformWidth,
      height: platformHeight,
      isSpikes: false
    },
    {
      x: Math.random() * (canvas.width - platformWidth),
      y: 1000,
      width: platformWidth,
      height: platformHeight,
      isSpikes: false
    },
    {
      x: Math.random() * (canvas.width - platformWidth),
      y: 1200,
      width: platformWidth,
      height: platformHeight,
      isSpikes: false
    },
    {
      x: Math.random() * (canvas.width - platformWidth),
      y: 1400,
      width: platformWidth,
      height: platformHeight,
      isSpikes: false
    },
    {
      x: Math.random() * (canvas.width - platformWidth),
      y: 1600,
      width: platformWidth,
      height: platformHeight,
      isSpikes: false
    },
  ];
}

const spikes = [
  { x: 50, y: canvas.height - 20, width: 20, height: 20 },
  { x: 100, y: canvas.height - 20, width: 20, height: 20 },
  // Add more spike objects here
];

function drawSpike(x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - height);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fillStyle = 'red';
  ctx.fill();
}

function drawPlatforms() {
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    if (platform.isSpikes) {
      ctx.fillStyle = "red";
      for (let j = 0; j < 7; j++) {
        drawSpike(platform.x + 15 * j, platform.y, 10, 10);
      }
    } else {
      ctx.fillStyle = "brown";
    }
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
}

// move the platforms down
function movePlatforms() {
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].y -= platformSpeed;
    if (platforms[i].y < -50) {
      let randomNum = Math.floor(Math.random() * 11);
      console.log(randomNum);
      platforms[i].isSpikes = randomNum % 5 === 0 ? true : false;
      platforms[i].y = 1000;
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(playerX, playerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

// Draw game objects
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPlatforms();
  movePlatforms();


  // Draw score and lives
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Lives: " + lives, 10, 60);
}

// updateBall game objects
function updateBall() {
  // Move player left or right
  if (keys.left && playerX > 0) {
    playerX -= playerSpeed;
  }
  if (keys.right && playerX < canvas.width) {
    playerX += playerSpeed;
  }

  // Move platform down
  platformY += platformSpeed;

  if (checkPlatformCollision({ x: playerX, y: playerY, radius: radius }, platforms)) {
    playerY -= platformSpeed;
  } else {
    playerY += platformSpeed;
  }

  // Check for collision between player and enemy
  if (collides(playerY, radius)) {
    lives--;
    lifeLost();
  }

  // Check for game over
  if (lives === 0) {
    alert("Game over!");
    resetGame();
  }

  // Redraw game objects
  draw();
}

// Life lost
function lifeLost() {
  playerX = canvas.width / 2;
  playerY = 0;
  platformX = Math.random() * (canvas.width - platformWidth);
}

// Reset game
function resetGame() {
  playerX = canvas.width / 2;
  playerY = 0;
  platforms = initializePlatforms();
  score = 0;
  lives = 3;
}

// Function to check collision between ball and platform
function checkPlatformCollision(ball, platforms) {
  for (const platform of platforms) {
    const ballDistanceX = Math.abs(ball.x - platform.x - platform.width / 2);
    const ballDistanceY = Math.abs(ball.y - platform.y - platform.height / 2);

    if (ballDistanceX > platform.width / 2 + ball.radius) continue;
    if (ballDistanceY > platform.height / 2 + ball.radius) continue;

    const cornerDistanceSq =
      Math.pow(ballDistanceX - platform.width / 2, 2) +
      Math.pow(ballDistanceY - platform.height / 2, 2);

    if (
      (ballDistanceX <= platform.width / 2) ||
      (ballDistanceY <= platform.height / 2) ||
      (cornerDistanceSq <= Math.pow(ball.radius, 2))
    ) {
      if (platform.isSpikes) {
        lifeLost();
      }
      return true;
    }
  }

  return false;
}


// Check if the ball hits the bottom or top
function collides(playerY, radius) {
  if (playerY < 0 || playerY + radius > canvas.height) {
    return true;
  }
  return false;
}

// Handle key press events
const keys = {};
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    keys.left = true;
  }
  if (event.code === "ArrowRight") {
    keys.right = true;
  }
});
document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    keys.left = false;
  }
  if (event.code === "ArrowRight") {
    keys.right = false;
  }
});

// Start game loop
function gameLoop() {
  updateBall();
  window.requestAnimationFrame(gameLoop);
}

// Start game
resetGame();
gameLoop();
