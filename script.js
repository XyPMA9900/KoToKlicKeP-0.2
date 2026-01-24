const $ = id => document.getElementById(id);

let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentUser = localStorage.getItem("currentUser");

let score = 0;
let clickPower = 1;
let autoClickers = 0;
let critChance = 0;
let passiveMultiplier = 1;

const items = [
  {id:"click", name:"➕ Клик", cost:10, desc:"+1 к клику", buy:()=>clickPower++},
  {id:"auto", name:"🤖 Авто", cost:50, desc:"+1 авто", buy:()=>autoClickers++},
  {id:"crit", name:"💥 Крит", cost:1000, desc:"Шанс x5", buy:()=>critChance+=0.05},
  {id:"boost", name:"⚡ Буст", cost:500, desc:"x2 на 15 сек", buy:()=>boost()},
  {id:"mega", name:"🔥 Мега", cost:4000, desc:"x2 клики", buy:()=>clickPower*=2}
];

function save(){
  localStorage.setItem("save_"+currentUser, JSON.stringify({
    score, clickPower, autoClickers, critChance, passiveMultiplier
  }));
}

function load(){
  let d = JSON.parse(localStorage.getItem("save_"+currentUser));
  if(d){
    score=d.score;
    clickPower=d.clickPower;
    autoClickers=d.autoClickers;
    critChance=d.critChance;
    passiveMultiplier=d.passiveMultiplier;
  }
}

function update(){
  $("score").textContent = score;
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

$("cat").onclick = ()=>{
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
  $("cat").classList.add("active");
  setTimeout(()=>$("cat").classList.remove("active"),100);
  save(); update();
};

setInterval(()=>{
  score+=autoClickers*passiveMultiplier;
  save(); update();
},1000);

$("resetGame").onclick=()=>{
  if(confirm("Точно сбросить прогресс?")){
    score=0; clickPower=1; autoClickers=0; critChance=0;
    save(); update();
  }
};

$("deleteAccountBtn").onclick=()=>{
  if(confirm("Удалить аккаунт навсегда?")){
    delete accounts[currentUser];
    localStorage.removeItem("save_"+currentUser);
    localStorage.setItem("accounts",JSON.stringify(accounts));
    localStorage.removeItem("currentUser");
    location.reload();
  }
};

$("loginBtn").onclick=()=>{
  const n=$("loginName").value;
  const p=$("loginPass").value;
  if(!accounts[n]) accounts[n]={password:p};
  if(accounts[n].password!==p){
    $("loginMsg").textContent="Неверный пароль";
    return;
  }
  currentUser=n;
  localStorage.setItem("accounts",JSON.stringify(accounts));
  localStorage.setItem("currentUser",n);
  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=n;
};

if(currentUser){
  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=currentUser;
}

$("openShop").onclick=()=>$("shop").classList.add("show");
$("closeShop").onclick=()=>$("shop").classList.remove("show");
$("openSettings").onclick=()=>$("settings").classList.add("show");
$("closeSettings").onclick=()=>$("settings").classList.remove("show");

$("checkDev").onclick=()=>{
  if($("devPass").value==="8923"){
    $("devPanel").style.display="block";
  }
};

$("giveMillion").onclick=()=>{
  score+=1000000;
  save(); update();
};