// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set up game variables
let playerSpeed = 5;
let playerWidth = 50;
let playerHeight = 50;

// Circle
let playerX = canvas.width / 2;  // Initial X position
let playerY = canvas.height / 2; // Initial Y position
const radius = 12;        // Circle radius


let platformSpeed = 3;
let platformX = 0;
let platformY = 0;
let platformWidth = 100;
let platformHeight = 20;

let score = 0;
let lives = 3;

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

	// Draw platform
	ctx.fillStyle = 'brown';
	ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

	// Draw score and lives
	ctx.fillStyle = 'black';
	ctx.font = '20px Arial';
	ctx.fillText('Score: ' + score, 10, 30);
	ctx.fillText('Lives: ' + lives, 10, 60);
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

    if (keys.up) {
		playerY -= playerSpeed;
	}
	if (keys.down) {
		playerY += playerSpeed;
	}

	// Move platform down
	platformY += platformSpeed;

	// Check for collision between player and enemy
	if (collides(playerX, playerY, playerWidth, playerHeight)) {
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
		alert('Game over!');
		resetGame();
	}

	// Redraw game objects
	draw();
}

// Reset game
function lifeLost() {
	playerX = 50;
	playerY = canvas.height - 100;
	platformX = Math.random() * (canvas.width - platformWidth);
    console.log(platformX)
}

// Reset game
function resetGame() {
	playerX = 50;
	playerY = canvas.height - 100;
	platformX = Math.random() * (canvas.width - platformWidth);
	score = 0;
	lives = 3;
}

// Check for collision between two rectangles
function collides(playerX, playerY, playerWidth, playerHeight, x2, y2, w2, h2) {
  if (playerY < 0 || playerY + playerHeight > canvas.height) {
    console.log('collides');
    return true;
  }
  return false
}

// Handle key press events
const keys = {};
document.addEventListener('keydown', event => {
	if (event.code === 'ArrowLeft') {
		keys.left = true;
	}
	if (event.code === 'ArrowRight') {
		keys.right = true;
	}

    if (event.code === 'ArrowUp') {
		keys.up = true;
	}
	if (event.code === 'ArrowDown') {
		keys.down = true;
	}
});
document.addEventListener('keyup', event => {
	if (event.code === 'ArrowLeft') {
		keys.left = false;
	}
	if (event.code === 'ArrowRight') {
		keys.right = false;
}

if (event.code === 'ArrowUp') {
		keys.up = false;
	}
	if (event.code === 'ArrowDown') {
		keys.down = false;
	}
})


// Start game loop
function gameLoop() {
	update();
	window.requestAnimationFrame(gameLoop);
}

// Start game
resetGame();
gameLoop();