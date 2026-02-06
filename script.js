window.onload = () => {

const $ = id => document.getElementById(id);

/* === CORE STATE === */
let state = {
    score: 0,
    clickPower: 1,
    autoPower: 0,
    items: []
};

/* === SHOP ITEMS === */
const shopData = [
{
name:"+1 к клику",
desc:"Увеличивает силу клика на 1",
baseCost:10,
effect:()=>state.clickPower+=1
},
{
name:"+5 к клику",
desc:"Мощнее удары кота",
baseCost:50,
effect:()=>state.clickPower+=5
},
{
name:"+10 к клику",
desc:"Серьёзный апгрейд клика",
baseCost:200,
effect:()=>state.clickPower+=10
},
{
name:"Авто +1",
desc:"+1 рыба в секунду",
baseCost:100,
effect:()=>state.autoPower+=1
},
{
name:"Авто +5",
desc:"+5 рыбы в секунду",
baseCost:500,
effect:()=>state.autoPower+=5
},
{
name:"x2 клики",
desc:"Удваивает текущий клик",
baseCost:1000,
effect:()=>state.clickPower*=2
},
{
name:"x3 клики",
desc:"Утроение клика",
baseCost:3000,
effect:()=>state.clickPower*=3
},
{
name:"Мега буст",
desc:"Мгновенно +1000 🐟",
baseCost:5000,
effect:()=>state.score+=1000
},
{
name:"Супер авто",
desc:"+20 рыбы в секунду",
baseCost:8000,
effect:()=>state.autoPower+=20
},
{
name:"БОГ режим",
desc:"+100 к силе клика",
baseCost:20000,
effect:()=>state.clickPower+=100
}
];

/* === SAVE / LOAD === */
function save(){
localStorage.setItem("ssv_save", JSON.stringify(state));
}

function load(){
let s = JSON.parse(localStorage.getItem("ssv_save"));
if(s){
state = s;
}
}

/* === UI UPDATE === */
function update(){
$("score").textContent = state.score + " 🐟";
renderShop();
}

/* === CAT === */
$("cat").onclick = ()=>{
state.score += state.clickPower;
$("cat").style.transform="scale(0.9)";
setTimeout(()=> $("cat").style.transform="scale(1)",100);
update();
save();
};

/* === AUTO === */
setInterval(()=>{
if(state.autoPower>0){
state.score += state.autoPower;
update();
save();
}
},1000);

/* === SHOP === */
function getCost(i){
return Math.floor(shopData[i].baseCost * Math.pow(1.4, state.items[i]));
}

function renderShop(){
const box = $("shopItems");
box.innerHTML="";

shopData.forEach((item,i)=>{

let cost = getCost(i);

let div = document.createElement("div");
div.className="shop-card";

div.innerHTML = `
<h3>${item.name}</h3>
<p>${item.desc}</p>
<p>Цена: <b>${cost}</b> 🐟</p>
<p>Куплено: ${state.items[i]}</p>
<button ${state.score<cost?"disabled":""}>Купить</button>
`;

div.querySelector("button").onclick=()=>{
if(state.score>=cost){
state.score-=cost;
state.items[i]++;
item.effect();
update();
save();
}
};

box.appendChild(div);
});
}

/* === KAZINO === */
const kazinoModes = [
{n:"ULTRAHARD", chance:0.001, mult:1000},
{n:"HARD", chance:0.01, mult:500},
{n:"RISK", chance:0.1, mult:200},
{n:"NORMAL", chance:0.5, mult:3}
];

function renderKazino(){
const box=$("kazinoModes");
box.innerHTML="";
kazinoModes.forEach((m,i)=>{
let btn=document.createElement("button");
btn.textContent=m.n;
btn.onclick=()=>playKazino(i);
box.appendChild(btn);
});
}

function playKazino(i){
let bet = Number($("kazinoBet").value);
if(!bet||bet<=0) return $("kazinoResult").textContent="Введите ставку";
if(state.score<bet) return $("kazinoResult").textContent="Мало рыб";

state.score-=bet;

if(Math.random()<kazinoModes[i].chance){
let win=bet*kazinoModes[i].mult;
state.score+=win;
$("kazinoResult").textContent="✔️ +" + win;
}else{
$("kazinoResult").textContent="❌ -" + bet;
}

update();
save();
}

/* === MODALS === */
$("openShop").onclick=()=>$("shop").classList.add("show");
$("closeShop").onclick=()=>$("shop").classList.remove("show");

$("openKazino").onclick=()=>$("kazino").classList.add("show");
$("closeKazino").onclick=()=>$("kazino").classList.remove("show");

/* === START === */
load();
renderKazino();
update();

};