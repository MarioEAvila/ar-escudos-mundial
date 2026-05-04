import { phases } from "./gameConfig.js";
import { renderGame, createAssets } from "./gameRenderer.js";
import {
  createInitialState,
  handleAction,
  resetGame,
  updateAimGuide,
  updateBall,
  updateFeedback,
  updatePower,
} from "./gameState.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const powerFillEl = document.getElementById("powerFill");
const powerMarkerEl = document.getElementById("powerMarker");
const powerValueEl = document.getElementById("powerValue");
const phaseLabelEl = document.getElementById("phaseLabel");
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreEl = document.getElementById("finalScore");

const assets = createAssets();
const state = createInitialState();
let lastTouchActionAt = 0;

function updateHud() {
  scoreEl.innerText = String(state.score);
  livesEl.innerText = String(Math.max(0, state.lives));

  const powerPercent = Math.round(state.selectedPower * 100);
  powerFillEl.style.height = `${powerPercent}%`;
  powerMarkerEl.style.bottom = `${powerPercent}%`;
  powerValueEl.innerText = `${powerPercent}%`;

  if (state.phase === phases.AIMING) {
    phaseLabelEl.innerText = "Click para fijar direccion";
  }

  if (state.phase === phases.POWER) {
    phaseLabelEl.innerText = "Click para fijar potencia";
  }

  if (state.phase === phases.SHOOTING) {
    phaseLabelEl.innerText = "Disparo en curso";
  }
}

function performAction(event) {
  event.preventDefault();
  if (state.phase === phases.GAME_OVER) return;

  handleAction(state);
  updateHud();
}

function handleClick(event) {
  if (Date.now() - lastTouchActionAt < 500) return;
  performAction(event);
}

function handleTouchEnd(event) {
  lastTouchActionAt = Date.now();
  performAction(event);
}

function loop() {
  updateAimGuide(state);
  updatePower(state);
  updateBall(state);
  updateFeedback(state);
  updateHud();
  renderGame(ctx, canvas, state, assets);

  if (state.phase === phases.GAME_OVER && gameOverModal.classList.contains("hidden")) {
    finalScoreEl.innerText = `Puntaje final: ${state.score}`;
    gameOverModal.classList.remove("hidden");
  }

  requestAnimationFrame(loop);
}

canvas.addEventListener("click", handleClick);
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

window.restartGame = function restartGame() {
  resetGame(state);
  gameOverModal.classList.add("hidden");
  updateHud();
};

window.exitGame = function exitGame() {
  window.restartGame();
};

updateHud();
loop();
