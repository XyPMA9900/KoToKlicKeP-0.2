const scoreEl = document.getElementById("score");
const catBtn = document.getElementById("cat");
const upgradeBtn = document.getElementById("upgradeClick");
const autoBtn = document.getElementById("autoClick");
const resetBtn = document.getElementById("reset");

const clickLevelEl = document.getElementById("clickLevel");
const autoCountEl = document.getElementById("autoCount");

const SAVE_KEY = "kotokliker_save";

// загрузка
let save = JSON.parse(localStorage.getItem(SAVE_KEY)) || {
  score: 0,
  clickPower: 1,
  autoClickers: 0
};

let score = save.score;
let clickPower = save.clickPower;
let autoClickers = save.autoClickers;

scoreEl.textContent = score;
clickLevelEl.textContent = clickPower;
autoCountEl.textContent = autoClickers;

// сохранить
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    score,
    clickPower,
    autoClickers
  }));
}

// клик по коту
catBtn.onclick = () => {
  score += clickPower;
  scoreEl.textContent = score;
  saveGame();
};

// апгрейд клика
upgradeBtn.onclick = () => {
  const cost = 10 * clickPower;
  if (score >= cost) {
    score -= cost;
    clickPower++;
    scoreEl.textContent = score;
    clickLevelEl.textContent = clickPower;
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
};

// автокликер
autoBtn.onclick = () => {
  const cost = 50 * (autoClickers + 1);
  if (score >= cost) {
    score -= cost;
    autoClickers++;
    scoreEl.textContent = score;
    autoCountEl.textContent = autoClickers;
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
};

// работает каждую секунду
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    scoreEl.textContent = score;
    saveGame();
  }
}, 1000);

// сброс
resetBtn.onclick = () => {
  if (confirm("Точно сбросить прогресс?")) {
    score = 0;
    clickPower = 1;
    autoClickers = 0;
    scoreEl.textContent = score;
    clickLevelEl.textContent = clickPower;
    autoCountEl.textContent = autoClickers;
    saveGame();
  }
};

// анти-зум
document.addEventListener("dblclick", e => {
  e.preventDefault();
});
