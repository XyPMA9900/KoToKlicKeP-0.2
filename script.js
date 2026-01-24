const $ = id => document.getElementById(id);

let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentUser = localStorage.getItem("currentUser");

let score = 0;
let clickPower = 1;
let autoClickers = 0;
let critChance = 0;
let boostActive = false;

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

function save(){
  localStorage.setItem("save_"+currentUser, JSON.stringify({
    score, clickPower, autoClickers, critChance
  }));
}

function load(){
  let d = JSON.parse(localStorage.getItem("save_"+currentUser));
  if(d){
    score=d.score;
    clickPower=d.clickPower;
    autoClickers=d.autoClickers;
    critChance=d.critChance;
  }
}

function update(){
  $("score").textContent = score+" 🐟";
  renderShop();
}

function renderShop(){
  const box = $("shopItems");
  box.innerHTML="";
  items.forEach(it=>{
    const div=document.createElement("div");
    div.className="shop-item"+(score<it.cost?" locked":"");
    div.innerHTML = `
      <b>${it.name}</b><br>
      ${it.desc}<br>
      Цена: ${it.cost}<br>
      <button ${score<it.cost?"disabled":""}>Купить</button>
    `;
    div.querySelector("button").onclick=()=>{
      if(score>=it.cost){
        score-=it.cost;
        it.buy();
        save(); update();
      }
    };
    box.appendChild(div);
  });
}

/* КОТ */
$("cat").onclick = ()=>{
  let gain = clickPower;
  if(Math.random()<critChance) gain*=5;
  if(boostActive) gain*=2;
  score+=gain;
  save(); update();

  $("cat").classList.add("active");
  $("cat").textContent="😹";
  setTimeout(()=>{
    $("cat").textContent="🐱";
    $("cat").classList.remove("active");
  },200);
};

/* ПАССИВ */
setInterval(()=>{
  score+=autoClickers;
  save(); update();
},1000);

/* ЛОГИН */
$("loginBtn").onclick=()=>{
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

/* ВЫХОД */
$("logoutBtn").onclick=()=>{
  localStorage.removeItem("currentUser");
  location.reload();
};

/* УДАЛЕНИЕ (ФЕЙК) */
$("deleteAccountBtn").onclick=()=>{
  $("deleteModal").classList.add("show");
};

$("closeDeleteModal").onclick=()=>{
  $("deleteModal").classList.remove("show");
};

/* СБРОС */
$("resetGame").onclick=()=>{
  if(confirm("Сбросить прогресс?")){
    score=0; clickPower=1; autoClickers=0; critChance=0;
    save(); update();
  }
};

/* DEV */
$("checkDev").onclick=()=>{
  if($("devPass").value==="8923"){
    $("devPanel").style.display="block";
    $("devMsg").textContent="Доступ открыт 😈";
  } else {
    $("devMsg").textContent="Неверный пароль";
  }
};

$("giveMillion").onclick=()=>{
  score+=1000000;
  save(); update();
};

/* МОДАЛКИ */
$("openShop").onclick=()=>$("shop").classList.add("show");
$("closeShop").onclick=()=>$("shop").classList.remove("show");
$("openSettings").onclick=()=>$("settings").classList.add("show");
$("closeSettings").onclick=()=>$("settings").classList.remove("show");

/* АВТОСТАРТ */
if(currentUser && accounts[currentUser]){
  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=currentUser;
}

/* === KAZINO === */

const kazino = {
  modes: [
    {name:"☠️ ULTRAHARDER ☠️", chance:0.000001, mult:1000000},
    {name:"☠️ ULTRAHARD ☠️",   chance:0.0001,   mult:1000},
    {name:"HARD",            chance:0.01,     mult:500},
    {name:"RISK&RICH",       chance:0.05,     mult:200},
    {name:"RISK",            chance:0.15,     mult:180},
    {name:"NORMALLY+",       chance:0.20,     mult:150},
    {name:"PASHALKO",        chance:0.67,     mult:14, x2chance:0.88},
    {name:"EZ WIN",          chance:0.65,     mult:2},
    {name:"NORMALLY",        chance:0.50,     mult:3},
    {name:"PROBNIK",         chance:0.50,     mult:1, test:true}
  ]
};

// DOM
const kazinoInput = document.getElementById("kazinoBet");
const kazinoResult = document.getElementById("kazinoResult");
const kazinoButtons = document.querySelectorAll("[data-kazino]");

// запуск режима
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

    // PROBNIK
    if(mode.test){
      if(Math.random() < mode.chance){
        kazinoResult.textContent = "✔️ ПРОБНИК: выиграл, но ничего не дали";
      } else {
        kazinoResult.textContent = "❌ ПРОБНИК: проиграл, но ничего не забрали";
      }
      return;
    }

    score -= bet;

    if(Math.random() < mode.chance){
      let win = bet * mode.mult;

      // пасхалко x2
      if(mode.x2chance && Math.random() < mode.x2chance){
        win *= 2;
        kazinoResult.textContent = "✔️ X2 ПАСХАЛКА! +" + win;
      } else {
        kazinoResult.textContent = "✔️ ВЫИГРЫШ +" + win;
      }

      score += win;
    } else {
      kazinoResult.textContent = "❌ ПРОИГРЫШ -"+bet;
    }

    save(); 
    update();
  };
};
/* открыть казик */
document.getElementById("openKazino").onclick = ()=>{
  document.getElementById("kazino").classList.add("show");
};