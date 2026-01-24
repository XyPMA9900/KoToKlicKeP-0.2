alert("JS ЗАГРУЗИЛСЯ");

const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {

/* ===== АККАУНТЫ ===== */
let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentUser = localStorage.getItem("currentUser");

/* ===== ИГРА ===== */
let score = 0;
let clickPower = 1;

/* ===== СОХРАНЕНИЕ ===== */
function save(){
  if(!currentUser) return;
  localStorage.setItem("save_"+currentUser, JSON.stringify({score, clickPower}));
}

function load(){
  if(!currentUser) return;
  let d = JSON.parse(localStorage.getItem("save_"+currentUser));
  if(d){
    score=d.score;
    clickPower=d.clickPower;
  }
}

function update(){
  $("score").textContent = score+" 🐟";
}

/* ===== КОТ ===== */
$("cat").onclick = ()=>{
  score+=clickPower;
  save(); update();
};

/* ===== ЛОГИН ===== */
$("loginBtn").onclick = ()=>{
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

/* ===== АВТОВХОД ===== */
if(currentUser && accounts[currentUser]){
  load(); update();
  $("loginScreen").classList.remove("show");
  $("playerName").textContent=currentUser;
}

/* ===== ВЫХОД ===== */
$("logoutBtn").onclick = ()=>{
  localStorage.removeItem("currentUser");
  location.reload();
};

/* ===== KAZINO ===== */
$("openKazino").onclick = ()=> $("kazino").classList.add("show");
$("closeKazino").onclick = ()=> $("kazino").classList.remove("show");

});