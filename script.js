const $ = id => document.getElementById(id);

/* ===== GAME ===== */
let score = 0;
let clickPower = 1;

/* ===== ITEMS ===== */
const items = [
  {name:"👆 +1 к клику", desc:"+1 сила клика", cost:10, single:false, buy:(n)=>clickPower+=n},
  {name:"💥 +5 к клику", desc:"+5 силы клика", cost:50, single:false, buy:(n)=>clickPower+=5*n},
  {name:"🔥 +10 к клику", desc:"+10 силы клика", cost:150, single:false, buy:(n)=>clickPower+=10*n},
  {name:"🐟 +100 рыб", desc:"Просто халява", cost:80, single:false, buy:(n)=>score+=100*n},
  {name:"🐠 +500 рыб", desc:"Много рыбы", cost:300, single:false, buy:(n)=>score+=500*n},
  {name:"😼 Супер кот", desc:"+20 к клику", cost:500, single:true, buy:()=>clickPower+=20},
  {name:"🏆 Мега кот", desc:"+50 к клику", cost:1000, single:true, buy:()=>clickPower+=50},
  {name:"💎 Алмаз", desc:"+100 к клику", cost:3000, single:true, buy:()=>clickPower+=100},
  {name:"🚀 Ракета", desc:"x2 клики", cost:5000, single:true, buy:()=>clickPower*=2},
  {name:"👑 Бог котов", desc:"x3 клики", cost:15000, single:true, buy:()=>clickPower*=3},
];

/* ===== SAVE ===== */
function save(){
  localStorage.setItem("save", JSON.stringify({score, clickPower}));
}

function load(){
  let d = JSON.parse(localStorage.getItem("save"));
  if(d){
    score=d.score;
    clickPower=d.clickPower;
  }
}

/* ===== UI ===== */
function update(){
  $("score").textContent = score + " 🐟";
  renderShop();
}

/* ===== CAT ===== */
$("cat").onclick = ()=>{
  score += clickPower;
  update(); save();
  $("cat").style.transform="scale(0.9)";
  setTimeout(()=>$("cat").style.transform="scale(1)",100);
};

/* ===== SHOP ===== */
function renderShop(){
  let box = $("shopItems");
  box.innerHTML="";
  items.forEach((it,i)=>{
    let btn = document.createElement("button");
    btn.textContent = it.name + " (" + it.cost + " 🐟)";
    btn.onclick = ()=>openItem(i);
    box.appendChild(btn);
  });
}

/* ===== ITEM MODAL ===== */
let currentItem=null;
let currentCount=1;

function openItem(i){
  currentItem = items[i];
  currentCount = 1;

  $("itemName").textContent = currentItem.name;
  $("itemDesc").textContent = currentItem.desc;
  $("itemPrice").textContent = currentItem.cost;
  $("itemCount").textContent = 1;

  $("countBox").style.display =
    currentItem.single ? "none" : "flex";

  $("itemModal").classList.add("show");
}

$("plus").onclick = ()=>{
  currentCount++;
  $("itemCount").textContent=currentCount;
};

$("minus").onclick = ()=>{
  if(currentCount>1){
    currentCount--;
    $("itemCount").textContent=currentCount;
  }
};

$("buyItem").onclick = ()=>{
  let total = currentItem.cost * currentCount;
  if(score < total) return alert("Не хватает рыбы!");

  score -= total;
  currentItem.buy(currentCount);

  $("itemModal").classList.remove("show");
  update(); save();
};

$("closeItem").onclick = ()=>{
  $("itemModal").classList.remove("show");
};

/* ===== MODALS ===== */
$("openShop").onclick = ()=>$("shop").classList.add("show");
$("closeShop").onclick = ()=>$("shop").classList.remove("show");

/* ===== START ===== */
load();
update();