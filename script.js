// ===== НАСТРОЙКИ =====
const CLICK_VALUE = 1;

// ===== ЭЛЕМЕНТЫ =====
const clickBtn = document.getElementById("clickBtn");
const coinsText = document.getElementById("coins");

// ===== ЗАГРУЗКА =====
let coins = Number(localStorage.getItem("coins")) || 0;
coinsText.textContent = coins;

// ===== КЛИК =====
clickBtn.addEventListener("click", () => {
  coins += CLICK_VALUE;
  coinsText.textContent = coins;
  localStorage.setItem("coins", coins);
});

// ===== СБРОС (на будущее) =====
function resetGame() {
  coins = 0;
  coinsText.textContent = coins;
  localStorage.setItem("coins", coins);
}