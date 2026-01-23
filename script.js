alert("VERSION 123");
document.addEventListener("DOMContentLoaded", () => {

  const $ = id => document.getElementById(id);

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

  // === ИГРА ===
  catBtn.addEventListener("click", () => {
    let power = clickPower;
    if (boostActive) power *= 2;
    if (critBought && Math.random() < 0.02) power *= 12;
    score += power;
    updateUI();
    saveGame();
  });

  upgradeBtn.addEventListener("click", () => {
    const cost = 10 * clickPower ** 2;
    if (score >= cost) {
      score -= cost;
      clickPower++;
      updateUI();
      saveGame();
    }
  });

  autoBtn.addEventListener("click", () => {
    const cost = 50 * (autoClickers + 1) ** 2;
    if (score >= cost) {
      score -= cost;
      autoClickers++;
      updateUI();
      saveGame();
    }
  });

  boostBtn.addEventListener("click", () => {
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
  });

  critBtn.addEventListener("click", () => {
    if (!critBought && score >= 2000) {
      score -= 2000;
      critBought = true;
      updateUI();
      saveGame();
    }
  });

  giveMillionBtn.addEventListener("click", () => {
    score += 1_000_000;
    updateUI();
    saveGame();
  });

  checkDevBtn.addEventListener("click", () => {
    if (devPassInput.value === "8923") {
      devMsg.textContent = "Доступ разрешён 😈";
      devPanel.style.display = "block";
    } else {
      devMsg.textContent = "Пароль неверный 💀";
    }
  });

  resetBtn.addEventListener("click", () => {
    score = 0;
    clickPower = 1;
    autoClickers = 0;
    boostPrice = 100;
    critBought = false;
    boostActive = false;
    updateUI();
    saveGame();
  });

  // === ПАССИВ ===
  setInterval(() => {
    if (autoClickers > 0) {
      score += autoClickers;
      updateUI();
      saveGame();
    }
  }, 1000);

  // === МОДАЛКИ (БЕЗ БАГОВ) ===
  function closeAll() {
    shopDiv.classList.remove("show");
    settingsDiv.classList.remove("show");
    devDiv.classList.remove("show");
  }

  function showOnly(div) {
    closeAll();
    div.classList.add("show");
  }

  openShopBtn.addEventListener("click", () => showOnly(shopDiv));
  closeShopBtn.addEventListener("click", closeAll);

  openSettingsBtn.addEventListener("click", () => showOnly(settingsDiv));
  closeSettingsBtn.addEventListener("click", closeAll);

  openDevBtn.addEventListener("click", () => showOnly(devDiv));

});
