const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player properties
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: 'blue',
  speed: 6,
  dx: 0
};

// Bullet properties
const bullets = [];
const bulletSpeed = 8;

// Enemy properties
const enemies = [];
const enemySpeed = 2;

// Game state
let score = 0;

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
  bullets.forEach((bullet, index) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.y -= bulletSpeed;

    // Remove off-screen bullets
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Draw enemies
function drawEnemies() {
  enemies.forEach((enemy, index) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemySpeed;

    // End game if enemy reaches bottom
    if (enemy.y > canvas.height) {
      alert('Game Over! Your score: ' + score);
      document.location.reload();
    }
  });
}

// Spawn enemies at random positions
function spawnEnemy() {
  const x = Math.random() * (canvas.width - 50);
  enemies.push({ x: x, y: 0, width: 50, height: 50 });
}

// Detect collisions
function detectCollisions() {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Remove bullet and enemy
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);

        // Increase score
        score += 10;
      }
    });
  });
}

// Update player position
function updatePlayerPosition() {
  player.x += player.dx;

  // Prevent player from going out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw score
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Update game
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();
  detectCollisions();
  drawScore();

  updatePlayerPosition();

  requestAnimationFrame(update);
}

// Move player
function movePlayer(e) {
  if (e.key === 'ArrowRight') player.dx = player.speed;
  if (e.key === 'ArrowLeft') player.dx = -player.speed;
}

// Stop player
function stopPlayer(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
}

// Shoot bullet
function shootBullet(e) {
  if (e.key === ' ') {
    bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20 });
  }
}

// Add event listeners
document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);
document.addEventListener('keydown', shootBullet);

// Spawn enemies at intervals
setInterval(spawnEnemy, 1000);

// Start the game
update();
