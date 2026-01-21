const scoreEl = document.getElementById("score");
const catBtn = document.getElementById("cat");
const resetBtn = document.getElementById("reset");

const openShopBtn = document.getElementById("openShop");
const closeShopBtn = document.getElementById("closeShop");
const shopDiv = document.getElementById("shop");

const upgradeBtn = document.getElementById("upgradeClick");
const autoBtn = document.getElementById("autoClick");
const boostBtn = document.getElementById("boostBtn");
const critBtn = document.getElementById("critBtn");

const clickLevelEl = document.getElementById("clickLevel");
const autoCountEl = document.getElementById("autoCount");
const boostPriceEl = document.getElementById("boostPrice");
const critStatusEl = document.getElementById("critStatus");

const SAVE_KEY = "kotokliker_save";

// ===== ЗАГРУЗКА =====
let save = JSON.parse(localStorage.getItem(SAVE_KEY)) || {};

let score = Number(save.score) || 0;
let clickPower = Number(save.clickPower) || 1;
let autoClickers = Number(save.autoClickers) || 0;
let boostPrice = Number(save.boostPrice) || 100;
let critBought = Boolean(save.critBought);
let boostActive = Boolean(save.boostActive);

updateUI();

// ===== СОХРАНЕНИЕ =====
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    score,
    clickPower,
    autoClickers,
    boostPrice,
    critBought,
    boostActive
  }));
}

// ===== ОБНОВЛЕНИЕ UI =====
function updateUI() {
  scoreEl.textContent = score;
  clickLevelEl.textContent = clickPower;
  autoCountEl.textContent = autoClickers;
  boostPriceEl.textContent = boostPrice;
  critStatusEl.textContent = critBought ? "Куплен" : "Не куплен";

  // цена клика: 10 * уровень²
  const clickCost = 10 * clickPower * clickPower;
  upgradeBtn.textContent = `➕ +1 за клик (${clickCost} 🐟)`;

  // цена автокликера: 50 * (кол-во+1)²
  const autoCost = 50 * (autoClickers + 1) * (autoClickers + 1);
  autoBtn.textContent = `🤖 Автокликер (${autoCost} 🐟)`;

  // цена буста
  boostBtn.textContent = `⚡ Буст x2 (${boostPrice} 🐟)`;
}

// ===== КЛИК ПО КОТУ =====
catBtn.onclick = () => {
  let power = clickPower;

  if (boostActive) power *= 2;
  if (critBought && Math.random() < 0.02) power *= 12;

  score += power;
  updateUI();
  saveGame();
};

// ===== МАГАЗИН =====
openShopBtn.onclick = () => shopDiv.classList.add("show");
closeShopBtn.onclick = () => shopDiv.classList.remove("show");

// ===== АПГРЕЙД КЛИКА =====
upgradeBtn.onclick = () => {
  const cost = 10 * clickPower * clickPower;
  if (score >= cost) {
    score -= cost;
    clickPower++;
    updateUI();
    saveGame();
  } else alert("Не хватает рыб!");
};

// ===== АВТОКЛИКЕР (КАК КЛИК) =====
autoBtn.onclick = () => {
  const cost = 50 * (autoClickers + 1) * (autoClickers + 1);
  if (score >= cost) {
    score -= cost;
    autoClickers++;
    updateUI();
    saveGame();
  } else alert("Не хватает рыб!");
};

// ===== БУСТ =====
boostBtn.onclick = () => {
  if (score >= boostPrice) {
    score -= boostPrice;
    boostActive = true;

    boostPrice = Math.round(boostPrice * 2.25);

    updateUI();
    saveGame();

    setTimeout(() => {
      boostActive = false;
      saveGame();
    }, 30000);
  } else alert("Не хватает рыб!");
};

// ===== КРИТ =====
critBtn.onclick = () => {
  if (critBought) return alert("Уже куплено!");
  if (score >= 2000) {
    score -= 2000;
    critBought = true;
    updateUI();
    saveGame();
  } else alert("Не хватает рыб!");
};

// ===== АВТОКЛИК ДОХОД =====
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    updateUI();
    saveGame();
  }
}, 1000);

// ===== СБРОС =====
resetBtn.onclick = () => {
  if (confirm("Точно сбросить прогресс?")) {
    score = 0;
    clickPower = 1;
    autoClickers = 0;
    boostPrice = 100;
    critBought = false;
    boostActive = false;
    updateUI();
    saveGame();
  }
};

document.addEventListener("dblclick", e => e.preventDefault());
