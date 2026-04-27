const ballImg = new Image();
ballImg.src = "assets/balon.png";

const goalImg = new Image();
goalImg.src = "assets/goal.png";

const fieldImg = new Image();
fieldImg.src = "assets/field.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;

// Pelota
const ball = {
    x: canvas.width / 2,
    y: 320,
    radius: 20,
    moving: false,
    targetX: 0,
    targetY: 0
};

// Portería
const goal = {
    x: 200,
    y: 75,
    width: 200,
    height: 150
};

// Centro
const target = {
    x: goal.x + goal.width / 2,
    y: goal.y + goal.height / 2
};

// Círculo de precisión animado
let precision = {
    radius: 60,
    min: 10,
    max: 60,
    speed: 1.2,
    shrinking: true
};

// Apuntado
let aim = { x: target.x, y: target.y };

// Dibujar
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Portería
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
   ctx.drawImage(goalImg, goal.x, goal.y, goal.width, goal.height);

   //Fondo
   ctx.drawImage(fieldImg, 0, 0, canvas.width, canvas.height);

    // Círculo de precisión
   ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";
ctx.lineWidth = 4;
ctx.shadowBlur = 10;
ctx.shadowColor = "yellow";

    // Línea de apuntado
    if (!ball.moving) {
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(aim.x, aim.y);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.stroke();
    }

    // Pelota
   ctx.drawImage(
    ballImg,
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius * 2,
    ball.radius * 2
);

}

// Animación del círculo
function updatePrecision() {
    if (precision.shrinking) {
        precision.radius -= precision.speed;
        if (precision.radius <= precision.min) {
            precision.shrinking = false;
        }
    } else {
        precision.radius += precision.speed;
        if (precision.radius >= precision.max) {
            precision.shrinking = true;
        }
    }
}

// Movimiento de pelota
function updateBall() {
    if (!ball.moving) return;

    let dx = (ball.targetX - ball.x) * 0.1;
    let dy = (ball.targetY - ball.y) * 0.1;

    ball.x += dx;
    ball.y += dy;

    // Llegó al destino
    if (Math.abs(ball.x - ball.targetX) < 1 && Math.abs(ball.y - ball.targetY) < 1) {
        ball.moving = false;
        checkShot();
        resetBall();
    }
}

// Reset pelota
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = 320;
}

// Calcular distancia
function getDistance(x, y) {
    return Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
}

// Sistema de puntos con precisión dinámica
function getPoints(distance) {
    let precisionFactor = 1 - (precision.radius / precision.max);
    let baseScore = Math.max(0, 100 - distance);

    return Math.floor(baseScore * precisionFactor);
}

// Evaluar tiro
function checkShot() {
    if (
        ball.targetX >= goal.x &&
        ball.targetX <= goal.x + goal.width &&
        ball.targetY >= goal.y &&
        ball.targetY <= goal.y + goal.height
    ) {
        const distance = getDistance(ball.targetX, ball.targetY);
        const points = getPoints(distance);

        if (points > 10) {
            score += points;
        } else {
            lives--;
        }
    } else {
        lives--;
    }

    updateUI();

if (lives <= 0) {
    showGameOver();
}
}

// UI
function updateUI() {
    document.getElementById("score").innerText = "Puntos: " + score;
    document.getElementById("lives").innerText = "Vidas: " + lives;
}

// Apuntar
canvas.addEventListener("mousemove", (e) => {
    if (ball.moving) return;

    const rect = canvas.getBoundingClientRect();
    aim.x = e.clientX - rect.left;
    aim.y = e.clientY - rect.top;
});

// Disparo
canvas.addEventListener("click", () => {
    if (ball.moving || lives <= 0) return;

    ball.targetX = aim.x;
    ball.targetY = aim.y;
    ball.moving = true;
});

// Loop
function gameLoop() {
    updatePrecision();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
function showGameOver() {
    gameOver = true;

    document.getElementById("finalScore").innerText =
        "Puntaje final: " + score;

    document.getElementById("gameOverModal").classList.remove("hidden");
}

function restartGame() {
    score = 0;
    lives = 3;
    gameOver = false;

    resetBall(); // importante si tienes animación
    updateUI();

    document.getElementById("gameOverModal").classList.add("hidden");
}

function exitGame() {
    location.reload(); // puedes cambiarlo por redirección si quieres
}