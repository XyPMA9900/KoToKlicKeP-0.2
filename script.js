<script>
  let score = 0;
  const scoreEl = document.getElementById("score");
  const cat = document.getElementById("cat");

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