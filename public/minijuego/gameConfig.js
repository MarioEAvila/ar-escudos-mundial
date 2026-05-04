export const canvasSize = {
  width: 600,
  height: 400,
};

export const ballStart = {
  x: canvasSize.width / 2,
  y: 330,
};

export const ballConfig = {
  radius: 18,
  travelEase: 0.13,
};

export const goal = {
  x: 172,
  y: 96,
  width: 256,
  height: 154,
};

export const target = {
  x: goal.x + goal.width / 2,
  y: goal.y + goal.height * 0.46,
};

export const aimConfig = {
  origin: ballStart,
  arcWidth: 180,
  minY: goal.y + 28,
  maxY: goal.y + goal.height - 20,
  speed: 0.035,
};

export const powerConfig = {
  min: 0.18,
  max: 1,
  speed: 0.026,
};

export const scoringConfig = {
  minPowerToScore: 0.3,
  maxDistanceScore: 132,
  centerBonus: 22,
};

export const phases = {
  AIMING: "aiming",
  POWER: "power",
  SHOOTING: "shooting",
  GAME_OVER: "game-over",
};
