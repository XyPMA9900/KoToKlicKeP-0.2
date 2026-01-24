/* Блокировка скролла */
document.addEventListener("touchmove", e => e.preventDefault(), { passive:false });

const $ = id => document.getElementById(id);

const openSettingsBtn = document.getElementById("openSettings");
const closeSettingsBtn = document.getElementById("closeSettings");
const settings = document.getElementById("settings");

const resetGameBtn = document.getElementById("resetGame");
const devPassInput = document.getElementById("devPass");
const checkDevBtn = document.getElementById("checkDev");
const devMsg = document.getElementById("devMsg");
const devPanel = document.getElementById("devPanel");
const giveMillionBtn = document.getElementById("giveMillion");
const scoreEl = $("score");
const cat = $("cat");

const openShopBtn = $("openShop");
const closeShopBtn = $("closeShop");
const shop = $("shop");

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

/* СОХРАНЕНИЯ */
let score = Number(localStorage.getItem("score")) || 0;
let clickPower = Number(localStorage.getItem("clickPower")) || 1;
let autoClickers = Number(localStorage.getItem("autoClickers")) || 0;
let critChance = Number(localStorage.getItem("critChance")) || 0;
let boostActive = false;
let passiveMultiplier = Number(localStorage.getItem("passiveMultiplier")) || 1;

function saveGame(){
  localStorage.setItem("score", score);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("autoClickers", autoClickers);
  localStorage.setItem("critChance", critChance);
  localStorage.setItem("passiveMultiplier", passiveMultiplier);
}

function updateUI(){
  scoreEl.textContent = `Рыбки: ${score} 🐟`;

  upgradeBtn.textContent = `➕ Клик +1 (${10*clickPower})`;
  autoBtn.textContent = `🤖 Автокликер (${50*(autoClickers+1)})`;
  critBtn.textContent = `💥 Крит (${1000})`;
  boostBtn.textContent = `⚡ Буст x2 (${500})`;
  superCatBtn.textContent = `😼 Супер кот (${2000})`;
  doubleAutoBtn.textContent = `🤖 x2 авто (${1500})`;
  goldFishBtn.textContent = `🐠 Золотая рыба (${3000})`;
  megaClickBtn.textContent = `🔥 Мега клик (${4000})`;
  passiveBoostBtn.textContent = `🌱 Пассив x2 (${2500})`;
  devFishBtn.textContent = `🧪 Разраб (${9999})`;
}

/* КЛИК */
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

/* МАГАЗИН */
openShopBtn.onclick = () => shop.classList.add("show");
closeShopBtn.onclick = () => shop.classList.remove("show");

/* ТОВАРЫ */
upgradeBtn.onclick = () => buy(10*clickPower, ()=>clickPower++);
autoBtn.onclick = () => buy(50*(autoClickers+1), ()=>autoClickers++);
critBtn.onclick = () => buy(1000, ()=>critChance+=0.05);
boostBtn.onclick = () => buy(500, ()=>{
  boostActive = true;
  setTimeout(()=>boostActive=false, 15000);
});
superCatBtn.onclick = () => buy(2000, ()=>clickPower+=5);
doubleAutoBtn.onclick = () => buy(1500, ()=>autoClickers*=2);
goldFishBtn.onclick = () => buy(3000, ()=>score+=5000);
megaClickBtn.onclick = () => buy(4000, ()=>clickPower*=2);
passiveBoostBtn.onclick = () => buy(2500, ()=>passiveMultiplier*=2);
devFishBtn.onclick = () => buy(9999, ()=>score+=100000);

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

/* ПАССИВ */
setInterval(()=>{
  score += autoClickers * passiveMultiplier;
  updateUI();
  saveGame();
},1000);

updateUI();