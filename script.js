window.onload = function(){

const $ = id => document.getElementById(id);

/* ===== STATE ===== */

let state = {
  score: 0,
  clickPower: 1,
  autoPower: 0
};

/* ===== SAVE ===== */

function save(){
  localStorage.setItem("save", JSON.stringify(state));
}

function load(){
  const data = JSON.parse(localStorage.getItem("save"));
  if(data){
    state = data;
  }
}

/* ===== UPDATE ===== */

function update(){
  $("score").textContent = state.score + " 🐟";
  renderShop();
}

/* ===== CAT ===== */

$("cat").onclick = function(){
  state.score += state.clickPower;
  save();
  update();
};

/* ===== AUTO ===== */

setInterval(function(){
  state.score += state.autoPower;
  save();
  update();
},1000);

/* ===== SHOP ===== */

const items = [
{ name:"+1 к клику", desc:"Обычный апгрейд", price:10, buy:()=>state.clickPower+=1 },
{ name:"+5 к клику", desc:"Средний апгрейд", price:50, buy:()=>state.clickPower+=5 },
{ name:"+10 к клику", desc:"Серьёзный апгрейд", price:200, buy:()=>state.clickPower+=10 },
{ name:"Авто +1", desc:"+1 рыба в сек", price:100, buy:()=>state.autoPower+=1 },
{ name:"Авто +5", desc:"+5 рыбы в сек", price:500, buy:()=>state.autoPower+=5 },
{ name:"x2 клики", desc:"Удваивает клик", price:1000, buy:()=>state.clickPower*=2 },
{ name:"x3 клики", desc:"Утроение клика", price:3000, buy:()=>state.clickPower*=3 },
{ name:"Мега буст", desc:"+1000 мгновенно", price:7000, buy:()=>state.score+=1000 },
{ name:"Супер авто", desc:"+20 в сек", price:8000, buy:()=>state.autoPower+=20 },
{ name:"БОГ режим", desc:"+100 к клику", price:20000, buy:()=>state.clickPower+=100 }
];

function renderShop(){
  const box = $("shopItems");
  if(!box) return;

  box.innerHTML = "";

  items.forEach((item,i)=>{
    const div = document.createElement("div");
    div.className = "shop-item";

    const canBuy = state.score >= item.price;

    div.innerHTML = `
      <b>${item.name}</b><br>
      <small>${item.desc}</small><br>
      Цена: ${item.price} 🐟<br>
      <button ${canBuy ? "" : "disabled"}>
        Купить
      </button>
    `;

    div.querySelector("button").onclick = ()=>{
      if(!canBuy) return;

      state.score -= item.price;
      item.buy();

      save();
      update();
    };

    box.appendChild(div);
  });
}

/* ===== MODALS ===== */

$("openShop").onclick = ()=> $("shop").classList.add("show");
$("closeShop").onclick = ()=> $("shop").classList.remove("show");

/* ===== START ===== */

load();
update();

};