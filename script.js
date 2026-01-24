document.addEventListener("touchmove", e => {
  e.preventDefault();
}, { passive: false });

window.addEventListener("scroll", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("gesturechange", e => e.preventDefault());
document.addEventListener("gestureend", e => e.preventDefault());

<script>
  let score = 0;
  const scoreEl = document.getElementById("score");
  const cat = document.getElementById("cat");

let clickPower = 1;
let autoClickers = 0;

// апгрейд клика
document.getElementById("upgradeClick").onclick = () => {
  const cost = 10 * clickPower;
  if (score >= cost) {
    score -= cost;
    clickPower++;
    updateUI();
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
};

// автокликер
document.getElementById("autoClick").onclick = () => {
  const cost = 50 * (autoClickers + 1);
  if (score >= cost) {
    score -= cost;
    autoClickers++;
    updateUI();
    saveGame();
  } else {
    alert("Не хватает рыб!");
  }
};

// пассивный доход
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    updateUI();
    saveGame();
  }
}, 1000);

  cat.onclick = () => {
    score++;
    scoreEl.textContent = "Рыбки: " + score + " 🐟";

    // меняем кота
    cat.textContent = "😹";

    setTimeout(() => {
      cat.textContent = "🐱";
    }, 500);
  };
</script>