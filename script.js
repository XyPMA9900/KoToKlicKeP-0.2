/* Блокировка скролла */
document.addEventListener("touchmove", e => e.preventDefault(), { passive:false });

const $ = id => document.getElementById(id);

/* ================= АККАУНТЫ ================= */

let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentUser = localStorage.getItem("currentUser") || null;

const loginScreen = $("loginScreen");
const loginName = $("loginName");
const loginPass = $("loginPass");
const loginBtn = $("loginBtn");
const loginMsg = $("loginMsg");
const playerNameEl = $("playerName");

function saveAccounts(){
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("currentUser", currentUser);
}

/* ================= ЭЛЕМЕНТЫ ================= */

const scoreEl = $("score");
const cat = $("cat");

const openShopBtn = $("openShop");
const closeShopBtn = $("closeShop");
const shop = $("shop");

const openSettingsBtn = $("openSettings");
const closeSettingsBtn = $("closeSettings");
const settings = $("settings");

const resetGameBtn = $("resetGame");
const devPassInput = $("devPass");
const checkDevBtn = $("checkDev");
const devMsg = $("devMsg");
const devPanel = $("devPanel");
const giveMillionBtn = $("giveMillion");

/* Кнопки магазина */
const upgradeBtn = $("upgradeClick");
const autoBtn = $("autoClick");
const critBtn = $("crit");
const boostBtn = $("boost");
const superCatBtn = $("superCat");
const doubleAutoBtn = $("doubleAuto");
const goldFishBtn = $("goldFish");
const megaClickBtn = $("megaClick");
const passiveBoostBtn = $("passiveBoost");
const devFishBtn = $("devFish");

/* ================= ДАННЫЕ ИГРЫ ================= */

let score = 0;
let clickPower = 1;
let autoClickers = 0;
let critChance = 0;
let passiveMultiplier = 1;
let boostActive = false;

/* ================= АККАУНТ ЛОГИКА ================= */

function loadUser(){
  const u = accounts[currentUser];
  score = u.score;
  clickPower = u.clickPower;
  autoClickers = u.autoClickers;
  critChance = u.critChance;
  passiveMultiplier = u.passiveMultiplier;
  updateUI();
}

loginBtn.onclick = () => {
  const name = loginName.value.trim();
  const pass = loginPass.value.trim();

  if(!name || !pass){
    loginMsg.textContent = "Заполни всё";
    return;
  }

  if(!accounts[name]){
    accounts[name] = {
      password: pass,
      score: 0,
      clickPower: 1,
      autoClickers: 0,
      critChance: 0,
      passiveMultiplier: 1
    };
    loginMsg.textContent = "Аккаунт создан 😎";
  } else {
    if(accounts[name].password !== pass){
      loginMsg.textContent = "Неверный пароль ❌";
      return;
    }
    loginMsg.textContent = "Добро пожаловать 😊";
  }

  currentUser = name;
  saveAccounts();
  loadUser();
  loginScreen.classList.remove("show");
  playerNameEl.textContent = name;
};

/* ================= СОХРАНЕНИЕ ================= */

function saveGame(){
  if(!currentUser) return;
  accounts[currentUser] = {
    password: accounts[currentUser].password,
    score,
    clickPower,
    autoClickers,
    critChance,
    passiveMultiplier
  };
  saveAccounts();
}

/* ================= UI ================= */

function updateUI(){
  scoreEl.textContent = `Рыбки: ${score} 🐟`;

  upgradeBtn.textContent = `➕ Клик +1 (${10 * clickPower})`;
  autoBtn.textContent = `🤖 Авто (${50 * (autoClickers + 1)})`;
  critBtn.textContent = `💥 Крит (1000)`;
  boostBtn.textContent = `⚡ Буст x2 (500)`;
  superCatBtn.textContent = `😼 Супер кот (2000)`;
  doubleAutoBtn.textContent = `🤖 x2 авто (1500)`;
  goldFishBtn.textContent = `🐠 Золотая рыба (3000)`;
  megaClickBtn.textContent = `🔥 Мега клик (4000)`;
  passiveBoostBtn.textContent = `🌱 Пассив x2 (2500)`;
  devFishBtn.textContent = `🧪 Разраб (9999)`;
}

/* ================= КЛИК ================= */

cat.onclick = () => {
  let gain = clickPower;
  if(Math.random() < critChance) gain *= 5;
  if(boostActive) gain *= 2;

  score += gain;
  updateUI();
  saveGame();

  cat.textContent = "😹";
  cat.classList.add("active");
  setTimeout(()=>{
    cat.textContent = "🐱";
    cat.classList.remove("active");
  },200);
};

/* ================= МОДАЛКИ ================= */

openShopBtn.onclick = () => shop.classList.add("show");
closeShopBtn.onclick = () => shop.classList.remove("show");
openSettingsBtn.onclick = () => settings.classList.add("show");
closeSettingsBtn.onclick = () => settings.classList.remove("show");

/* ================= ПОКУПКИ ================= */

function buy(cost, effect){
  if(score >= cost){
    score -= cost;
    effect();
    updateUI();
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
}

upgradeBtn.onclick = () => buy(10 * clickPower, ()=>clickPower++);
autoBtn.onclick = () => buy(50 * (autoClickers + 1), ()=>autoClickers++);
critBtn.onclick = () => buy(1000, ()=>critChance += 0.05);

boostBtn.onclick = () => buy(500, ()=>{
  boostActive = true;
  setTimeout(()=>boostActive=false, 15000);
});

superCatBtn.onclick = () => buy(2000, ()=>clickPower += 5);
doubleAutoBtn.onclick = () => buy(1500, ()=>autoClickers *= 2);
goldFishBtn.onclick = () => buy(3000, ()=>score += 5000);
megaClickBtn.onclick = () => buy(4000, ()=>clickPower *= 2);
passiveBoostBtn.onclick = () => buy(2500, ()=>passiveMultiplier *= 2);
devFishBtn.onclick = () => buy(9999, ()=>score += 100000);

/* ================= ПАССИВ ================= */

setInterval(()=>{
  score += autoClickers * passiveMultiplier;
  updateUI();
  saveGame();
},1000);

/* ================= СБРОС ================= */

resetGameBtn.onclick = () => {
  if(confirm("Точно сбросить всё? 😿")){
    localStorage.removeItem("currentUser");
    location.reload();
  }
};

/* ================= ДЕВ ================= */

checkDevBtn.onclick = () => {
  if(devPassInput.value === "8923"){
    devMsg.textContent = "Доступ разрешён 😈";
    devPanel.style.display = "block";
  } else {
    devMsg.textContent = "❌ Неверный пароль";
  }
};

giveMillionBtn.onclick = () => {
  score += 1_000_000;
  updateUI();
  saveGame();
};

/* ================= СТАРТ ================= */

if(currentUser){
  loadUser();
  loginScreen.classList.remove("show");
  playerNameEl.textContent = currentUser;
}

/* ======= ВЫХОД/УДАЛЕНИЕ АККАУНТА ======== */

const logoutBtn = $("logoutBtn");
const deleteAccountBtn = $("deleteAccountBtn");

/* ВЫЙТИ */
logoutBtn.onclick = () => {
  alert("LOGOUT");
  localStorage.removeItem("currentUser");
  location.reload();
};

/* УДАЛИТЬ АККАУНТ */
deleteAccountBtn.onclick = () => {
  if(confirm("Удалить аккаунт навсегда? 😿")){
    delete accounts[currentUser];
    localStorage.removeItem("currentUser");
    saveAccounts();
    location.reload();
  }
};