window.onload = () => {

const $ = id => document.getElementById(id);

/* ===== GAME ===== */
let score = 0;
let clickPower = 1;

/* ===== SAVE ===== */
function save(){
  localStorage.setItem("save", JSON.stringify({score, clickPower}));
}

function load(){
  let d = JSON.parse(localStorage.getItem("save"));
  if(d){
    score = d.score;
    clickPower = d.clickPower;
  }
}

/* ===== UI ===== */
function update(){
  $("score").textContent = score + " 🐟";
}

/* ===== CAT ===== */
$("cat").onclick = () => {
  score += clickPower;
  update();
  save();
};

/* ===== SHOP (пока пусто) ===== */
function renderShop(){
  $("shopItems").innerHTML = "Тут будут товары";
}

/* ===== MODALS ===== */
$("openShop").onclick = () => {
  renderShop();
  $("shop").classList.add("show");
};

$("closeShop").onclick = () => {
  $("shop").classList.remove("show");
};

$("openSettings").onclick = () => {
  $("settings").classList.add("show");
};

$("closeSettings").onclick = () => {
  $("settings").classList.remove("show");
};

$("resetGame").onclick = () => {
  score = 0;
  clickPower = 1;
  update();
  save();
};

/* ===== START ===== */
load();
update();

};