/* === БЛОКИРОВКА СКРОЛЛА === */
document.addEventListener("touchmove", e => e.preventDefault(), { passive:false });
window.addEventListener("scroll", () => window.scrollTo(0,0));

/* === ЭЛЕМЕНТЫ === */
const scoreEl = document.getElementById("score");
const cat = document.getElementById("cat");
const upgradeBtn = document.getElementById("upgradeClick");
const autoBtn = document.getElementById("autoClick");

/* === ЗАГРУЗКА СОХРАНЕНИЙ === */
let score = Number(localStorage.getItem("score")) || 0;
let clickPower = Number(localStorage.getItem("clickPower")) || 1;
let autoClickers = Number(localStorage.getItem("autoClickers")) || 0;

/* === СОХРАНИТЬ === */
function saveGame(){
  localStorage.setItem("score", score);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("autoClickers", autoClickers);
}

/* === ОБНОВИТЬ UI === */
function updateUI(){
  scoreEl.textContent = `Рыбки: ${score} 🐟`;
  upgradeBtn.textContent = `➕ +1 за клик (${10 * clickPower} 🐟)`;
  autoBtn.textContent = `🤖 Автокликер (${50 * (autoClickers + 1)} 🐟)`;
}

/* === КЛИК ПО КОТУ === */
cat.addEventListener("click", () => {
  score += clickPower;
  updateUI();
  saveGame();

  // анимация
  cat.textContent = "😹";
  cat.classList.add("active");
  setTimeout(() => {
    cat.textContent = "🐱";
    cat.classList.remove("active");
  }, 300);
});

/* === АПГРЕЙД КЛИКА === */
upgradeBtn.addEventListener("click", () => {
  const cost = 10 * clickPower;
  if(score >= cost){
    score -= cost;
    clickPower++;
    updateUI();
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
});

/* === АВТОКЛИКЕР === */
autoBtn.addEventListener("click", () => {
  const cost = 50 * (autoClickers + 1);
  if(score >= cost){
    score -= cost;
    autoClickers++;
    updateUI();
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
});

/* === ПАССИВНЫЙ ДОХОД === */
setInterval(() => {
  if(autoClickers > 0){
    score += autoClickers;
    updateUI();
    saveGame();
  }
}, 1000);

/* === ПЕРВЫЙ ЗАПУСК === */
updateUI();