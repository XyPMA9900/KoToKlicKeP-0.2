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
  const n=$("loginName").value;
  const p=$("loginPass").value;

  if(!accounts[n]){
    if(confirm("Аккаунта нет. Создать новый?")){
      accounts[n]={password:p};
      localStorage.setItem("accounts",JSON.stringify(accounts));
    } else {
      return;
    }
  }

  if(accounts[n].password!==p){
    $("loginMsg").textContent="❌ Неверный пароль";
    return;
  }

  currentUser=n;
  localStorage.setItem("currentUser",n);
  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=n;
};
  currentUser=n;
  localStorage.setItem("accounts",JSON.stringify(accounts));
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

/* УДАЛЕНИЕ */
$("deleteAccountBtn").onclick=()=>{
  if(confirm("Удалить аккаунт НАВСЕГДА?")){
    
    // удалить аккаунт
    delete accounts[currentUser];
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // удалить сохранение ИГРЫ
    localStorage.removeItem("save_" + currentUser);

    // выйти
    localStorage.removeItem("currentUser");

    alert("Аккаунт полностью удалён 😿");
    location.reload();
  }
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
    $("devMsg").textContent="Доступ открыт";
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
} else {
  $("loginScreen").classList.add("show");
}