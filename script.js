const $ = id => document.getElementById(id);

let score = 0;

// КНОПКА ВОЙТИ
$("loginBtn").onclick = () => {
  $("loginScreen").classList.remove("show");
};

// КОТ
$("cat").onclick = () => {
  score++;
  $("score").textContent = score + " 🐟";
};

// МАГАЗИН
$("openShop").onclick = () => {
  $("shop").classList.add("show");
};

$("closeShop").onclick = () => {
  $("shop").classList.remove("show");
};

// НАСТРОЙКИ
$("openSettings").onclick = () => {
  $("settings").classList.add("show");
};

$("closeSettings").onclick = () => {
  $("settings").classList.remove("show");
};