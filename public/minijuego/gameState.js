import {
  aimConfig,
  ballConfig,
  ballStart,
  goal,
  phases,
  powerConfig,
  scoringConfig,
  target,
} from "./gameConfig.js";

export function createInitialState() {
  return {
    score: 0,
    lives: 3,
    phase: phases.AIMING,
    time: 0,
    aimDirection: 1,
    powerDirection: 1,
    selectedPower: 0.5,
    shotFeedback: "",
    shotFeedbackTimer: 0,
    aim: {
      x: target.x,
      y: target.y,
      locked: false,
    },
    ball: {
      x: ballStart.x,
      y: ballStart.y,
      radius: ballConfig.radius,
      moving: false,
      targetX: target.x,
      targetY: target.y,
    },
  };
}

export function resetRound(state) {
  state.phase = phases.AIMING;
  state.aim.locked = false;
  state.ball.x = ballStart.x;
  state.ball.y = ballStart.y;
  state.ball.moving = false;
  state.selectedPower = 0.5;
}

export function resetGame(state) {
  const fresh = createInitialState();
  Object.assign(state, fresh);
}

export function updateAimGuide(state) {
  if (state.phase !== phases.AIMING || state.aim.locked) return;

  state.time += aimConfig.speed * state.aimDirection;

  if (state.time >= 1) {
    state.time = 1;
    state.aimDirection = -1;
  }

  if (state.time <= -1) {
    state.time = -1;
    state.aimDirection = 1;
  }

  const normalized = (state.time + 1) / 2;
  state.aim.x = target.x + state.time * aimConfig.arcWidth;
  state.aim.y =
    aimConfig.minY +
    Math.sin(normalized * Math.PI) * (aimConfig.maxY - aimConfig.minY);
}

export function updatePower(state) {
  if (state.phase !== phases.POWER) return;

  state.selectedPower += powerConfig.speed * state.powerDirection;

  if (state.selectedPower >= powerConfig.max) {
    state.selectedPower = powerConfig.max;
    state.powerDirection = -1;
  }

  if (state.selectedPower <= powerConfig.min) {
    state.selectedPower = powerConfig.min;
    state.powerDirection = 1;
  }
}

export function updateBall(state) {
  if (!state.ball.moving) return;

  const dx = (state.ball.targetX - state.ball.x) * ballConfig.travelEase;
  const dy = (state.ball.targetY - state.ball.y) * ballConfig.travelEase;

  state.ball.x += dx;
  state.ball.y += dy;

  if (
    Math.abs(state.ball.x - state.ball.targetX) < 1 &&
    Math.abs(state.ball.y - state.ball.targetY) < 1
  ) {
    state.ball.moving = false;
    evaluateShot(state);
  }
}

export function updateFeedback(state) {
  if (state.shotFeedbackTimer > 0) {
    state.shotFeedbackTimer -= 1;
  }
}

export function handleAction(state) {
  if (state.phase === phases.AIMING) {
    state.aim.locked = true;
    state.phase = phases.POWER;
    return;
  }

  if (state.phase === phases.POWER) {
    launchShot(state);
  }
}

function launchShot(state) {
  const power = state.selectedPower;
  const vectorX = state.aim.x - ballStart.x;
  const vectorY = state.aim.y - ballStart.y;

  state.ball.targetX = ballStart.x + vectorX * (0.72 + power * 0.55);
  state.ball.targetY = ballStart.y + vectorY * (0.72 + power * 0.55);
  state.ball.moving = true;
  state.phase = phases.SHOOTING;
}

function evaluateShot(state) {
  if (isInsideGoal(state.ball.targetX, state.ball.targetY)) {
    const distance = getDistance(state.ball.targetX, state.ball.targetY);
    const points = getPoints(distance, state.selectedPower);

    if (state.selectedPower >= scoringConfig.minPowerToScore && points > 12) {
      state.score += points;
      showFeedback(state, `+${points}`);
    } else {
      state.lives -= 1;
      showFeedback(state, "Poca potencia");
    }
  } else {
    state.lives -= 1;
    showFeedback(state, "Fuera");
  }

  if (state.lives <= 0) {
    state.phase = phases.GAME_OVER;
    return;
  }

  resetRound(state);
}

function isInsideGoal(x, y) {
  return (
    x >= goal.x &&
    x <= goal.x + goal.width &&
    y >= goal.y &&
    y <= goal.y + goal.height
  );
}

function getDistance(x, y) {
  return Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
}

function getPoints(distance, power) {
  const accuracyScore = Math.max(0, scoringConfig.maxDistanceScore - distance);
  const powerScore = Math.round(power * 70);
  const centerBonus = distance < 24 ? scoringConfig.centerBonus : 0;

  return Math.floor(accuracyScore * 0.48 + powerScore + centerBonus);
}

function showFeedback(state, message) {
  state.shotFeedback = message;
  state.shotFeedbackTimer = 60;
}
