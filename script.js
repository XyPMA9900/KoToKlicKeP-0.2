alert("SCRIPT LOADED");
document.addEventListener("DOMContentLoaded", () => {

  // ===== УТИЛИТА =====
  const $ = id => document.getElementById(id);

  // ===== ЭЛЕМЕНТЫ =====
  const scoreEl = $("score");
  const catBtn = $("cat");
  const resetBtn = $("reset");

  const openShopBtn = $("openShop");
  const closeShopBtn = $("closeShop");
  const shopDiv = $("shop");

  const openSettingsBtn = $("openSettings");
  const closeSettingsBtn = $("closeSettings");
  const settingsDiv = $("settings");

  const openDevBtn = $("openDev");
  const devDiv = $("dev");
  const devPassInput = $("devPass");
  const devMsg = $("devMsg");
  const devPanel = $("devPanel");
  const giveMillionBtn = $("giveMillion");
  const checkDevBtn = $("checkDev");

  const upgradeBtn = $("upgradeClick");
  const autoBtn = $("autoClick");
  const boostBtn = $("boostBtn");
  const critBtn = $("critBtn");

  const clickLevelEl = $("clickLevel");
  const autoCountEl = $("autoCount");
  const boostPriceEl = $("boostPrice");
  const critStatusEl = $("critStatus");

  // ===== СОХРАНЕНИЕ =====
  const SAVE_KEY = "kotokliker_save";
  let save = JSON.parse(localStorage.getItem(SAVE_KEY)) || {};

  let score = Number(save.score) || 0;
  let clickPower = Number(save.clickPower) || 1;
  let autoClickers = Number(save.autoClickers) || 0;
  let boostPrice = Number(save.boostPrice) || 100;
  let critBought = save.critBought === true;
  let boostActive = save.boostActive === true;

  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      score, clickPower, autoClickers,
      boostPrice, critBought, boostActive
    }));
  }

  function updateUI() {
    scoreEl.textContent = score;
    clickLevelEl.textContent = clickPower;
    autoCountEl.textContent = autoClickers;
    boostPriceEl.textContent = boostPrice;
    critStatusEl.textContent = critBought ? "Куплен" : "Не куплен";

    upgradeBtn.textContent = `➕ +1 (${10 * clickPower ** 2} 🐟)`;
    autoBtn.textContent = `🤖 Авто (${50 * (autoClickers + 1) ** 2} 🐟)`;
    boostBtn.textContent = `⚡ Буст (${boostPrice} 🐟)`;
  }

  updateUI();
  saveGame();

  // ===== ЛОГИКА =====
  catBtn.onclick = () => {
    let power = clickPower;
    if (boostActive) power *= 2;
    if (critBought && Math.random() < 0.02) power *= 12;
    score += power;
    updateUI();
    saveGame();
  };

  upgradeBtn.onclick = () => {
    const cost = 10 * clickPower ** 2;
    if (score >= cost) {
      score -= cost;
      clickPower++;
      updateUI();
      saveGame();
    }
  };

  autoBtn.onclick = () => {
    const cost = 50 * (autoClickers + 1) ** 2;
    if (score >= cost) {
      score -= cost;
      autoClickers++;
      updateUI();
      saveGame();
    }
  };

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
    }
  };

  critBtn.onclick = () => {
    if (!critBought && score >= 2000) {
      score -= 2000;
      critBought = true;
      updateUI();
      saveGame();
    }
  };

  giveMillionBtn.onclick = () => {
    score += 1000000;
    updateUI();
    saveGame();
  };

  checkDevBtn.onclick = () => {
    if (devPassInput.value === "8923") {
      devMsg.textContent = "Доступ разрешён 😈";
      devPanel.style.display = "block";
    } else {
      devMsg.textContent = "Пароль неверный 💀";
    }
  };

  resetBtn.onclick = () => {
    score = 0;
    clickPower = 1;
    autoClickers = 0;
    boostPrice = 100;
    critBought = false;
    boostActive = false;
    updateUI();
    saveGame();
  };

  // ===== ПАССИВ =====
  setInterval(() => {
    if (autoClickers > 0) {
      score += autoClickers;
      updateUI();
      saveGame();
    }
  }, 1000);

  // ===== МОДАЛКИ =====
  function closeAll() {
    shopDiv.style.display = "none";
    settingsDiv.style.display = "none";
    devDiv.style.display = "none";
  }

  function showOnly(div) {
    closeAll();
    div.style.display = "flex";
  }

  openShopBtn.onclick = () => showOnly(shopDiv);
  closeShopBtn.onclick = closeAll;

  openSettingsBtn.onclick = () => showOnly(settingsDiv);
  closeSettingsBtn.onclick = closeAll;

  openDevBtn.onclick = () => showOnly(devDiv);

});
