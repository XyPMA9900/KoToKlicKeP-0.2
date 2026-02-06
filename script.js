window.onload = () => {

const $ = id => document.getElementById(id);

/* ================= STATE ================= */

let state = {
  score: 0,
  clickPower: 1,
  autoPower: 0
};

/* ================= SAVE / LOAD ================= */

function save(){
  localStorage.setItem("save", JSON.stringify(state));
}

function load(){
  let data = JSON.parse(localStorage.getItem("save"));
  if(!data) return;
  state = data;
}

/* ================= UPDATE UI ================= */

function update(){
  $("score").textContent = state.score + " 🐟";
  renderShop();
}

/* ================= CAT ================= */

$("cat").onclick = () => {
  state.score += state.clickPower;
  $("cat").style.transform = "scale(0.9)";
  setTimeout(()=> $("cat").style.transform="scale(1)",100);
  save();
  update();
};

/* ================= AUTO ================= */

setInterval(()=>{
  if(state.autoPower > 0){
    state.score += state.autoPower;
    save();
    update();
  }
},1000);

/* ================= SHOP ================= */

const items = [

{ name:"+1 к клику", desc:"Обычный апгрейд", price:10,
  buy:()=> state.clickPower += 1 },

{ name:"+5 к клику", desc:"Средний апгрейд", price:50,
  buy:()=> state.clickPower += 5 },

{ name:"+10 к клику", desc:"Серьёзный апгрейд", price:200,
  buy:()=> state.clickPower += 10 },

{ name:"Авто +1", desc:"+1 рыба в секунду", price:100,
  buy:()=> state.autoPower += 1 },

{ name:"Авто +5", desc:"+5 рыбы в секунду", price:500,
  buy:()=> state.autoPower += 5 },

{ name:"x2 клики", desc:"Удваивает клик", price:1000,
  buy:()=> state.clickPower *= 2 },

{ name:"x3 клики", desc:"Утроение клика", price:3000,
  buy:()=> state.clickPower *= 3 },

{ name:"Мега буст", desc:"Мгновенно +1000", price:7000,
  buy:()=> state.score += 1000 },

{ name:"Супер авто", desc:"+20 в секунду", price:8000,
  buy:()=> state.autoPower += 20 },

{ name:"БОГ режим", desc:"+100 к клику", price:20000,
  buy:()=> state.clickPower += 100 }

];

function renderShop(){
  const box = $("shopItems");
  box.innerHTML = "";

  items.forEach((item,i)=>{
    const div = document.createElement("div");
    div.className = "shop-item";

    div.innerHTML = `
      <b>${item.name}</b><br>
      ${item.desc}<br>
      Цена: ${item.price} 🐟<br>
      <button ${state.score < item.price ? "disabled":""}>
        Купить
      </button>
    `;

    div.querySelector("button").onclick = ()=>{
      if(state.score < item.price) return;
      state.score -= item.price;
      item.buy();
      save();
      update();
    };

    box.appendChild(div);
  });
}

/* ================= KAZINO ================= */

const kazinoModes = [

{ name:"☠️ ULTRAHARDER", chance:0.000001, mult:1000000 },
{ name:"☠️ ULTRAHARD", chance:0.0001, mult:1000 },
{ name:"HARD", chance:0.01, mult:500 },
{ name:"RISK&RICH", chance:0.05, mult:200 },
{ name:"RISK", chance:0.15, mult:180 },
{ name:"NORMALLY+", chance:0.20, mult:150 },
{ name:"PASHALKO", chance:0.67, mult:14, x2:0.88 },
{ name:"EZ WIN", chance:0.65, mult:2 },
{ name:"NORMALLY", chance:0.50, mult:3 },
{ name:"PROBNIK", chance:0.50, test:true }

];

function renderKazino(){
  const box = $("kazinoModes");
  if(!box) return;

  box.innerHTML = "";

  kazinoModes.forEach((mode,i)=>{
    const btn = document.createElement("button");
    btn.textContent = mode.name;
    btn.onclick = ()=> playKazino(i);
    box.appendChild(btn);
  });
}

function playKazino(i){

  const bet = Number($("kazinoBet").value);
  const result = $("kazinoResult");
  const mode = kazinoModes[i];

  if(!bet || bet <= 0){
    result.textContent = "Введите ставку";
    return;
  }

  if(state.score < bet){
    result.textContent = "Недостаточно 🐟";
    return;
  }

  if(mode.test){
    if(Math.random() < mode.chance){
      result.textContent = "✔️ ПРОБНИК выигрыш (0)";
    } else {
      result.textContent = "❌ ПРОБНИК проигрыш (0)";
    }
    return;
  }

  state.score -= bet;

  if(Math.random() < mode.chance){
    let win = bet * mode.mult;

    if(mode.x2 && Math.random() < mode.x2){
      win *= 2;
      result.textContent = "✔️ X2 ПАСХАЛКА +" + win;
    } else {
      result.textContent = "✔️ +" + win;
    }

    state.score += win;
  } else {
    result.textContent = "❌ -" + bet;
  }

  save();
  update();
}

/* ================= MODALS ================= */

$("openShop").onclick = ()=> $("shop").classList.add("show");
$("closeShop").onclick = ()=> $("shop").classList.remove("show");

$("openKazino").onclick = ()=> $("kazino").classList.add("show");
$("closeKazino").onclick = ()=> $("kazino").classList.remove("show");

/* ================= START ================= */

load();
renderKazino();
update();

};