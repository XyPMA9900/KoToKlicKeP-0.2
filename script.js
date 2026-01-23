// ===== ЭЛЕМЕНТЫ =====
const scoreEl = document.getElementById("score");
const catBtn = document.getElementById("cat");
const resetBtn = document.getElementById("reset");

const openShopBtn = document.getElementById("openShop");
const closeShopBtn = document.getElementById("closeShop");
const shopDiv = document.getElementById("shop");

const openSettingsBtn = document.getElementById("openSettings");
const settingsDiv = document.getElementById("settings");
const closeSettingsBtn = document.getElementById("closeSettings");

const openDevBtn = document.getElementById("openDev");
const devDiv = document.getElementById("dev");
const devPassInput = document.getElementById("devPass");
const devMsg = document.getElementById("devMsg");
const devPanel = document.getElementById("devPanel");
const giveMillionBtn = document.getElementById("giveMillion");

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

let score = Number(save.score);
if (!isFinite(score)) score = 0;

let clickPower = Number(save.clickPower);
if (!isFinite(clickPower) || clickPower < 1) clickPower = 1;

let autoClickers = Number(save.autoClickers);
if (!isFinite(autoClickers) || autoClickers < 0) autoClickers = 0;

let boostPrice = Number(save.boostPrice);
if (!isFinite(boostPrice) || boostPrice < 100) boostPrice = 100;

let critBought = save.critBought === true;
let boostActive = save.boostActive === true;

updateUI();
saveGame();

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

// ===== UI =====
function updateUI() {
  scoreEl.textContent = score;
  clickLevelEl.textContent = clickPower;
  autoCountEl.textContent = autoClickers;
  boostPriceEl.textContent = boostPrice;
  critStatusEl.textContent = critBought ? "Куплен" : "Не куплен";

  const clickCost = 10 * clickPower * clickPower;
  upgradeBtn.textContent = `➕ +1 за клик (${clickCost} 🐟)`;

  const autoCost = 50 * (autoClickers + 1) * (autoClickers + 1);
  autoBtn.textContent = `🤖 Автокликер (${autoCost} 🐟)`;

  boostBtn.textContent = `⚡ Буст x2 (${boostPrice} 🐟)`;
}

// ===== КЛИК =====
catBtn.onclick = () => {
  let power = clickPower;
  if (boostActive) power *= 2;
  if (critBought && Math.random() < 0.02) power *= 12;
  score += power;
  updateUI();
  saveGame();
};

// ===== МАГАЗИН =====
openShopBtn.onclick = () => showOnly(shopDiv);
closeShopBtn.onclick = closeAll;

// ===== НАСТРОЙКИ =====
openSettingsBtn.onclick = () => showOnly(settingsDiv);
closeSettingsBtn.onclick = closeAll;

// ===== DEV =====
openDevBtn.onclick = () => showOnly(devDiv);

checkDev.onclick = () => {
  if (devPassInput.value === "8923") {
    devMsg.textContent = "Доступ разрешён 😈";
    devPanel.style.display = "block";
  } else {
    devMsg.textContent = "пароль неверный💔😡☠️❌";
  }
};

giveMillionBtn.onclick = () => {
  score += 1000000;
  updateUI();
  saveGame();
};

// ===== АПГРЕЙД =====
upgradeBtn.onclick = () => {
  const cost = 10 * clickPower * clickPower;
  if (score >= cost) {
    score -= cost;
    clickPower++;
    updateUI();
    saveGame();
  } else alert("Не хватает рыб!");
};

// ===== АВТОКЛИКЕР =====
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

// ===== ПАССИВ =====
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

// ===== УТИЛИТЫ =====
function closeAll() {
  shopDiv.style.display = "none";
  settingsDiv.style.display = "none";
  devDiv.style.display = "none";
}

function showOnly(div) {
  closeAll();
  div.style.display = "flex";
  div.style.pointerEvents = "auto";
}

// анти-зум
