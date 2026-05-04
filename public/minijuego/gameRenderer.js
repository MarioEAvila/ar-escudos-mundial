import { aimConfig, goal, phases, target } from "./gameConfig.js";

export function createAssets() {
  return {
    ball: loadImage("assets/balon.png"),
    goal: loadImage("assets/goal.png"),
    field: loadImage("assets/field.png"),
  };
}

export function renderGame(ctx, canvas, state, assets) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground(ctx, canvas, assets.field);
  drawGoalGrounding(ctx);
  drawGoal(ctx, assets.goal);
  drawGuide(ctx, state);
  drawBall(ctx, state, assets.ball);
  drawFeedback(ctx, canvas, state);
}

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function drawBackground(ctx, canvas, fieldImg) {
  if (fieldImg.complete && fieldImg.naturalWidth > 0) {
    ctx.drawImage(fieldImg, 0, 0, canvas.width, canvas.height);
  } else {
    drawFieldFallback(ctx, canvas);
  }

  const shade = ctx.createLinearGradient(0, 0, 0, canvas.height);
  shade.addColorStop(0, "rgba(0, 0, 0, 0.16)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.46)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFieldFallback(ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0f7a3f");
  gradient.addColorStop(1, "#063f24");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.58);
  ctx.lineTo(canvas.width, canvas.height * 0.58);
  ctx.stroke();
}

function drawGoal(ctx, goalImg) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;

  if (goalImg.complete && goalImg.naturalWidth > 0) {
    ctx.drawImage(goalImg, goal.x, goal.y, goal.width, goal.height);
  } else {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);
  }

  ctx.restore();
}

function drawGoalGrounding(ctx) {
  const baseY = goal.y + goal.height - 4;
  const centerX = goal.x + goal.width / 2;

  ctx.save();

  const shadowGradient = ctx.createRadialGradient(
    centerX,
    baseY,
    12,
    centerX,
    baseY,
    goal.width * 0.58
  );
  shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.42)");
  shadowGradient.addColorStop(0.55, "rgba(0, 0, 0, 0.24)");
  shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = shadowGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, baseY + 6, goal.width * 0.55, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(goal.x - 24, baseY);
  ctx.lineTo(goal.x + goal.width + 24, baseY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0, 230, 118, 0.16)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(goal.x - 18, baseY + 7);
  ctx.lineTo(goal.x + goal.width + 18, baseY + 7);
  ctx.stroke();

  ctx.restore();
}

function drawGuide(ctx, state) {
  if (state.phase === phases.SHOOTING || state.phase === phases.GAME_OVER) {
    return;
  }

  ctx.save();
  ctx.strokeStyle =
    state.phase === phases.POWER
      ? "rgba(0, 230, 118, 0.9)"
      : "rgba(255, 255, 255, 0.58)";
  ctx.lineWidth = state.phase === phases.POWER ? 4 : 2;
  ctx.setLineDash(state.phase === phases.POWER ? [] : [8, 8]);
  ctx.beginPath();
  ctx.moveTo(aimConfig.origin.x, aimConfig.origin.y);
  ctx.lineTo(state.aim.x, state.aim.y);
  ctx.stroke();

  ctx.fillStyle = "rgba(0, 230, 118, 0.95)";
  ctx.shadowBlur = 16;
  ctx.shadowColor = "rgba(0, 230, 118, 0.85)";
  ctx.beginPath();
  ctx.arc(state.aim.x, state.aim.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawGoalCenter(ctx);
}

function drawGoalCenter(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(0, 230, 118, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(target.x, target.y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBall(ctx, state, ballImg) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.58)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 9;

  if (ballImg.complete && ballImg.naturalWidth > 0) {
    ctx.drawImage(
      ballImg,
      state.ball.x - state.ball.radius,
      state.ball.y - state.ball.radius,
      state.ball.radius * 2,
      state.ball.radius * 2
    );
  } else {
    ctx.fillStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFeedback(ctx, canvas, state) {
  if (!state.shotFeedback || state.shotFeedbackTimer <= 0) return;

  ctx.save();
  ctx.globalAlpha = Math.min(1, state.shotFeedbackTimer / 35);
  ctx.font = "32px Impact, Arial Black, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillStyle = state.shotFeedback.includes("+") ? "#00e676" : "#ff6b6b";
  ctx.strokeText(state.shotFeedback, canvas.width / 2, 44);
  ctx.fillText(state.shotFeedback, canvas.width / 2, 44);
  ctx.restore();
}
