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

/* ===== KAZINO RENDER ===== */

const kazinoModes = [
{ name:"☠️ ULTRAHARDER ☠️", chance:0.000001, mult:1000000, desc:"0.0001% шанс ×1 000 000" },
{ name:"☠️ ULTRAHARD ☠️",   chance:0.0001,   mult:1000,     desc:"0.01% шанс ×1000" },
{ name:"HARD",             chance:0.01,     mult:500,      desc:"1% шанс ×500" },
{ name:"RISK&RICH",        chance:0.05,     mult:200,      desc:"5% шанс ×200" },
{ name:"RISK",             chance:0.15,     mult:180,      desc:"15% шанс ×180" },
{ name:"NORMALLY+",        chance:0.20,     mult:150,      desc:"20% шанс ×150" },
{ name:"PASHALKO",         chance:0.67,     mult:14,       x2chance:0.88, desc:"67% шанс ×14 + 88% шанс X2" },
{ name:"EZ WIN",           chance:0.65,     mult:2,        desc:"65% шанс ×2" },
{ name:"NORMALLY",         chance:0.50,     mult:3,        desc:"50% шанс ×3" },
{ name:"PROBNIK",          chance:0.50,     mult:1,        test:true, desc:"Тестовый режим без потерь" }
];

function renderKazino(){
const box = $("kazinoModes");
if(!box) return;

box.innerHTML = "";

kazinoModes.forEach((mode,i)=>{
let btn = document.createElement("button");
btn.className = "kazino-card";

btn.innerHTML = `
<b>${mode.name}</b><br>
<small>${mode.desc}</small>
`;

btn.onclick = ()=> playKazino(i);

box.appendChild(btn);
});
}

function playKazino(i){
const mode = kazinoModes[i];
const bet = Number($("kazinoBet").value);
const result = $("kazinoResult");

if(!bet || bet<=0){
result.textContent = "Введите ставку!";
return;
}

if(score < bet){
result.textContent = "Недостаточно рыбы 🐟";
return;
}

if(mode.test){
if(Math.random() < mode.chance){
result.textContent = "✔️ ПРОБНИК: выигрыш без награды";
}else{
result.textContent = "❌ ПРОБНИК: проигрыш без потерь";
}
return;
}

score -= bet;

if(Math.random() < mode.chance){
let win = bet * mode.mult;

if(mode.x2chance && Math.random() < mode.x2chance){
win *= 2;
result.textContent = "✔️ X2! +" + win;
}else{
result.textContent = "✔️ +" + win;
}

score += win;
}else{
result.textContent = "❌ -" + bet;
}

update();
save();
}

/* открыть / закрыть */
$("openKazino").onclick = ()=> {
$("kazino").classList.add("show");
renderKazino();
};

$("closeKazino").onclick = ()=> {
$("kazino").classList.remove("show");
};