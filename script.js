const $ = id => document.getElementById(id);

let score = 0;

document.addEventListener("DOMContentLoaded", () => {

  $("cat").onclick = () => {
    score++;
    $("score").textContent = score + " 🐟";
  };

  $("loginBtn").onclick = () => {
    $("loginScreen").classList.remove("show");
  };

  $("openShop").onclick = () => {
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

});