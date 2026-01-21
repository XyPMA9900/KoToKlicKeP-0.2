const scoreEl = document.getElementById("score");
const catBtn = document.getElementById("cat");
const resetBtn = document.getElementById("reset");

const openShopBtn = document.getElementById("openShop");
const closeShopBtn = document.getElementById("closeShop");
const shopDiv = document.getElementById("shop");

const upgradeBtn = document.getElementById("upgradeClick");
const autoBtn = document.getElementById("autoClick");

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

updateUI();

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    score,
    clickPower,
    autoClickers
  }));
}

function updateUI() {
  scoreEl.textContent = score;
  clickLevelEl.textContent = clickPower;
  autoCountEl.textContent = autoClickers;
}

// клик по коту
catBtn.onclick = () => {
  score += clickPower;
  updateUI();
  saveGame();
};

// открыть магазин
openShopBtn.onclick = () => {
  shopDiv.classList.remove("hidden");
  setTimeout(() => shopDiv.classList.add("show"), 10);
};

// закрыть магазин
closeShopBtn.onclick = () => {
  shopDiv.classList.remove("show");
  setTimeout(() => shopDiv.classList.add("hidden"), 300);
};

// апгрейд клика
upgradeBtn.onclick = () => {
  const cost = 10 * clickPower;
  if (score >= cost) {
    score -= cost;
    clickPower++;
    updateUI();
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
    updateUI();
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
};

// автоклик каждую секунду
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    updateUI();
    saveGame();
  }
}, 1000);

// сброс
resetBtn.onclick = () => {
  if (confirm("Точно сбросить прогресс?")) {
    score = 0;
    clickPower = 1;
    autoClickers = 0;
    updateUI();
    saveGame();
  }
};

// анти-зум
document.addEventListener("dblclick", e => {
  e.preventDefault();
});
