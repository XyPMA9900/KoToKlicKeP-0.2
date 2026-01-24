alert("JS ЗАГРУЗИЛСЯ");

const btn = document.getElementById("loginBtn");
const text = document.getElementById("text");

btn.onclick = function () {
  alert("КНОПКА НАЖАТА");
  text.textContent = "ВОШЁЛ";
};