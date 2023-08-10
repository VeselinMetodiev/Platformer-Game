const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;

let playerSpeed = 5;
let playerWidth = 50;
let playerHeight = 50;

// Circle
playerX = canvas.width / 2;
playerY = 0;
const radius = 12;

let platformSpeed = 2;
let platformX = 0;
let platformY = 0;
let platformWidth = 100;
let platformHeight = 20;

// Array to hold the platforms
let platforms = [
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

function drawPlatforms() {
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    if (platform.isSpikes) {
      ctx.fillStyle = "red";
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
      platforms[i].isSpikes = Math.floor(Math.random() * 11) % 5 ? true : false;
      platforms[i].y = 1000;
    }
  }
}

function drawCircle() {
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

  drawCircle();
  drawPlatforms();
  movePlatforms();

  // Draw score and lives
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Lives: " + lives, 10, 60);
}

// Update game objects
function update() {
  // Move player left or right
  if (keys.left) {
    playerX -= playerSpeed;
  }
  if (keys.right) {
    playerX += playerSpeed;
  }

  // Move platform down
  platformY += platformSpeed;

  if (checkCollision({ x: playerX, y: playerY, radius: radius }, platforms)) {
    playerY -= platformSpeed;
  } else {
    playerY += platformSpeed;
  }

  // Check for collision between player and enemy
  if (collides(playerY, radius)) {
    lives--;
    lifeLost();
  }

  // // Check for collision between player and platform
  // if (collides(playerX, playerY, playerWidth, playerHeight, platformX, platformY, platformWidth, platformHeight)) {
  // 	score++;
  // 	resetGame();
  // }

  // Check for game over
  if (lives === 0) {
    alert("Game over!");
    resetGame();
  }

  // Redraw game objects
  draw();
}

// Reset game
function lifeLost() {
  playerX = canvas.width / 2;
  playerY = 0;
  platformX = Math.random() * (canvas.width - platformWidth);
  console.log(platformX);
}

// Reset game
function resetGame() {
  playerX = canvas.width / 2;
  playerY = 0;
  platformX = Math.random() * (canvas.width - platformWidth);
  score = 0;
  lives = 3;
}

// Function to check collision between circle and rectangle
function checkCollision(circle, platforms) {
  for (let i = 0; i < platforms.length; i++) {
    let rectangle = platforms[i];
    let circleDistanceX = Math.abs(
      circle.x - rectangle.x - rectangle.width / 2
    );
    let circleDistanceY = Math.abs(
      circle.y - rectangle.y - rectangle.height / 2
    );

    if (circleDistanceX > rectangle.width / 2 + circle.radius) continue;
    if (circleDistanceY > rectangle.height / 2 + circle.radius) continue;

    if (circleDistanceX <= rectangle.width / 2) return true;
    if (circleDistanceY <= rectangle.height / 2) return true;

    let cornerDistanceSq =
      Math.pow(circleDistanceX - rectangle.width / 2, 2) +
      Math.pow(circleDistanceY - rectangle.height / 2, 2);

    return cornerDistanceSq <= Math.pow(circle.radius, 2);
  }
  return false;
}

// Check if the circle hits the bottom or top
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
  update();
  window.requestAnimationFrame(gameLoop);
}

// Start game
resetGame();
gameLoop();
