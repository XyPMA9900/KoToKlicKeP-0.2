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
    score, clickPower, autoClickers
  }));
}

function updateUI() {
  scoreEl.textContent = score;
  clickLevelEl.textContent = clickPower;
  autoCountEl.textContent = autoClickers;
}

catBtn.onclick = () => {
  score += clickPower;
  updateUI();
  saveGame();
};

openShopBtn.onclick = () => {
  shopDiv.classList.add("show");
};

closeShopBtn.onclick = () => {
  shopDiv.classList.remove("show");
};

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

setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    updateUI();
    saveGame();
  }
}, 1000);

resetBtn.onclick = () => {
  if (confirm("Точно сбросить прогресс?")) {
    score = 0;
    clickPower = 1;
    autoClickers = 0;
    updateUI();
    saveGame();
  }
};

document.addEventListener("dblclick", e => e.preventDefault());
