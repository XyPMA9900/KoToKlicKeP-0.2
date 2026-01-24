const $ = id => document.getElementById(id);
let ONLINE = navigator.onLine;

if(!ONLINE){
  alert("Ошибка подключения к интернету, запущена оффлайн версия игры (ошибка 1)");
}

/* аккаунты */
let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentUser = localStorage.getItem("currentUser");

/* элементы */
const loginScreen = $("loginScreen");
const loginName = $("loginName");
const loginPass = $("loginPass");
const loginBtn = $("loginBtn");
const loginMsg = $("loginMsg");
const playerNameEl = $("playerName");

const scoreEl = $("score");
const cat = $("cat");

const openShopBtn = $("openShop");
const closeShopBtn = $("closeShop");
const shop = $("shop");

const openSettingsBtn = $("openSettings");
const closeSettingsBtn = $("closeSettings");
const settings = $("settings");

const resetGameBtn = $("resetGame");
const logoutBtn = $("logoutBtn");
const deleteAccountBtn = $("deleteAccountBtn");

const devPass = $("devPass");
const checkDev = $("checkDev");
const devMsg = $("devMsg");
const devPanel = $("devPanel");
const giveMillion = $("giveMillion");

/* кнопки */
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

/* данные */
let score = 0;
let clickPower = 1;
let autoClickers = 0;
let critChance = 0;
let passiveMultiplier = 1;
let boostActive = false;

/* firebase/local */
function saveData(key, data){
  if(ONLINE){
    db.ref("users/"+currentUser+"/"+key).set(data);
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

async function loadData(key, def){
  if(ONLINE){
    const snap = await db.ref("users/"+currentUser+"/"+key).once("value");
    return snap.val() ?? def;
  } else {
    return JSON.parse(localStorage.getItem(key)) ?? def;
  }
}

/* login */
loginBtn.onclick = async () => {
  const name = loginName.value;
  const pass = loginPass.value;

  if(!accounts[name]){
    accounts[name] = {password: pass};
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  if(accounts[name].password !== pass){
    loginMsg.textContent = "Неверный пароль";
    return;
  }

  currentUser = name;
  localStorage.setItem("currentUser", name);
  await loadGame();
  loginScreen.classList.remove("show");
  playerNameEl.textContent = name;
};

/* загрузка */
async function loadGame(){
  score = await loadData("score",0);
  clickPower = await loadData("clickPower",1);
  autoClickers = await loadData("autoClickers",0);
  critChance = await loadData("critChance",0);
  passiveMultiplier = await loadData("passiveMultiplier",1);
  updateUI();
}

/* сохранение */
function saveGame(){
  saveData("score",score);
  saveData("clickPower",clickPower);
  saveData("autoClickers",autoClickers);
  saveData("critChance",critChance);
  saveData("passiveMultiplier",passiveMultiplier);
}

/* UI */
function updateUI(){
  scoreEl.textContent = `Рыбки: ${score} 🐟`;
  upgradeBtn.textContent = `➕ Клик +1 (${10*clickPower})`;
  autoBtn.textContent = `🤖 Авто (${50*(autoClickers+1)})`;
  critBtn.textContent = `💥 Крит`;
  boostBtn.textContent = `⚡ Буст`;
  superCatBtn.textContent = `😼 Супер кот`;
  doubleAutoBtn.textContent = `🤖 x2 авто`;
  goldFishBtn.textContent = `🐠 Золото`;
  megaClickBtn.textContent = `🔥 Мега`;
  passiveBoostBtn.textContent = `🌱 Пассив`;
  devFishBtn.textContent = `🧪 Разраб`;
}

/* клик */
cat.onclick = ()=>{
  let gain = clickPower;
  if(Math.random()<critChance) gain*=5;
  if(boostActive) gain*=2;
  score+=gain;
  saveGame();
  updateUI();

  cat.classList.add("active");
  cat.textContent="😹";
  setTimeout(()=>{
    cat.textContent="🐱";
    cat.classList.remove("active");
  },200);
};

/* модалки */
openShopBtn.onclick = ()=>shop.classList.add("show");
closeShopBtn.onclick = ()=>shop.classList.remove("show");
openSettingsBtn.onclick = ()=>settings.classList.add("show");
closeSettingsBtn.onclick = ()=>settings.classList.remove("show");

/* покупки */
function buy(cost,fn){
  if(score>=cost){
    score-=cost;
    fn();
    saveGame();
    updateUI();
  }
}

upgradeBtn.onclick = ()=>buy(10*clickPower,()=>clickPower++);
autoBtn.onclick = ()=>buy(50*(autoClickers+1),()=>autoClickers++);
critBtn.onclick = ()=>buy(1000,()=>critChance+=0.05);
boostBtn.onclick = ()=>buy(500,()=>{
  boostActive=true;
  setTimeout(()=>boostActive=false,15000);
});
superCatBtn.onclick = ()=>buy(2000,()=>clickPower+=5);
doubleAutoBtn.onclick = ()=>buy(1500,()=>autoClickers*=2);
goldFishBtn.onclick = ()=>buy(3000,()=>score+=5000);
megaClickBtn.onclick = ()=>buy(4000,()=>clickPower*=2);
passiveBoostBtn.onclick = ()=>buy(2500,()=>passiveMultiplier*=2);
devFishBtn.onclick = ()=>buy(9999,()=>score+=100000);

/* пассив */
setInterval(()=>{
  score+=autoClickers*passiveMultiplier;
  saveGame();
  updateUI();
},1000);

/* dev */
checkDev.onclick = ()=>{
  if(devPass.value==="8923"){
    devPanel.style.display="block";
    devMsg.textContent="Доступ разрешён 😈";
  } else {
    devMsg.textContent="Неверный пароль";
  }
};

giveMillion.onclick = ()=>{
  score+=1_000_000;
  saveGame();
  updateUI();
};

/* выход */
logoutBtn.onclick = ()=>{
  localStorage.removeItem("currentUser");
  location.reload();
};

deleteAccountBtn.onclick = ()=>{
  delete accounts[currentUser];
  localStorage.setItem("accounts",JSON.stringify(accounts));
  localStorage.removeItem("currentUser");
  location.reload();
};

/* старт */
if(currentUser){
  loadGame();
  loginScreen.classList.remove("show");
  playerNameEl.textContent=currentUser;
}