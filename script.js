let score = 0;

let scoreText = document.getElementById("score");
let cat = document.getElementById("cat");

cat.onclick = () => {
  score += 1;
  scoreText.textContent = score + " 🐟";
};