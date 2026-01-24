alert("JS ЗАГРУЗИЛСЯ");

const $ = id => document.getElementById(id);

window.onload = () => {

/* ===== АККАУНТЫ ===== */
let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentUser = localStorage.getItem("currentUser");

/* ===== ИГРА ===== */
let score = 0;
let clickPower = 1;
let autoClickers = 0;
let critChance = 0;
let boostActive = false;

/* ===== МАГАЗИН ===== */
const items = [
  {name:"➕ Клик", cost:10, desc:"+1 к клику", buy:()=>clickPower++},
  {name:"🤖 Авто", cost:50, desc:"+1 авто", buy:()=>autoClickers++},
  {name:"💥 Крит", cost:1000, desc:"Шанс x5", buy:()=>critChance+=0.05},
  {name:"⚡ Буст", cost:500, desc:"x2 на 15 сек", buy:()=>{
    boostActive=true;
    setTimeout(()=>boostActive=false,15000);
  }},
  {name:"🔥 Мега", cost:4000, desc:"x2 клики", buy:()=>clickPower*=2}
];

/* ===== СОХРАНЕНИЕ ===== */
function save(){
  if(!currentUser) return;
  localStorage.setItem("save_"+currentUser, JSON.stringify({
    score, clickPower, autoClickers, critChance
  }));
}

function load(){
  if(!currentUser) return;
  let d = JSON.parse(localStorage.getItem("save_"+currentUser));
  if(d){
    score=d.score;
    clickPower=d.clickPower;
    autoClickers=d.autoClickers;
    critChance=d.critChance;
  }
}

/* ===== UI ===== */
function update(){
  $("score").textContent = score+" 🐟";
}

/* ===== КОТ ===== */
$("cat").onclick = ()=>{
  let gain = clickPower;
  if(Math.random()<critChance) gain*=5;
  if(boostActive) gain*=2;
  score+=gain;
  save(); update();
};

/* ===== ПАССИВ ===== */
setInterval(()=>{
  score+=autoClickers;
  save(); update();
},1000);

/* ===== ЛОГИН ===== */
$("loginBtn").onclick=()=>{
  alert("КНОПКА НАЖАЛАСЬ");

  const n=$("loginName").value.trim();
  const p=$("loginPass").value.trim();

  if(!n || !p){
    $("loginMsg").textContent="Заполни всё";
    return;
  }

  if(!accounts[n]){
    accounts[n]={password:p};
  } else if(accounts[n].password!==p){
    $("loginMsg").textContent="❌ Неверный пароль";
    return;
  }

  localStorage.setItem("accounts",JSON.stringify(accounts));
  currentUser=n;
  localStorage.setItem("currentUser",n);

  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=n;
};

/* ===== ВЫХОД ===== */
$("logoutBtn").onclick=()=>{
  localStorage.removeItem("currentUser");
  location.reload();
};

/* ===== АВТОСТАРТ ===== */
if(currentUser && accounts[currentUser]){
  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=currentUser;
}

/* ===== KAZINO ===== */

const kazino = {
  modes: [
    {name:"ULTRAHARDER", chance:0.000001, mult:1000000},
    {name:"ULTRAHARD", chance:0.0001, mult:1000},
    {name:"HARD", chance:0.01, mult:500},
    {name:"RISK&RICH", chance:0.05, mult:200},
    {name:"RISK", chance:0.15, mult:180},
    {name:"NORMALLY+", chance:0.20, mult:150},
    {name:"PASHALKO", chance:0.67, mult:14, x2chance:0.88},
    {name:"EZ WIN", chance:0.65, mult:2},
    {name:"NORMALLY", chance:0.50, mult:3},
    {name:"PROBNIK", chance:0.50, mult:1, test:true}
  ]
};

const kazinoInput = $("kazinoBet");
const kazinoResult = $("kazinoResult");
const kazinoButtons = document.querySelectorAll("[data-kazino]");

kazinoButtons.forEach(btn=>{
  btn.onclick = ()=>{
    const mode = kazino.modes[btn.dataset.kazino];
    const bet = Number(kazinoInput.value);

    if(!bet || bet<=0){
      kazinoResult.textContent = "Введите ставку!";
      return;
    }

    if(score < bet){
      kazinoResult.textContent = "Не хватает рыб 🐟";
      return;
    }

    if(mode.test){
      kazinoResult.textContent = Math.random()<0.5
        ? "✔️ ПРОБНИК"
        : "❌ ПРОБНИК";
      return;
    }

    score -= bet;

    if(Math.random() < mode.chance){
      let win = bet * mode.mult;
      if(mode.x2chance && Math.random() < mode.x2chance) win *= 2;
      score += win;
      kazinoResult.textContent = "✔️ +" + win;
    } else {
      kazinoResult.textContent = "❌ -" + bet;
    }

    save(); update();
  };
};

$("openKazino").onclick = ()=> $("kazino").classList.add("show");
$("closeKazino").onclick = ()=> $("kazino").classList.remove("show");

};