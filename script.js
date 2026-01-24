window.addEventListener("scroll", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("touchmove", e => {
  e.preventDefault();
}, { passive: false });

document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("gesturechange", e => e.preventDefault());
document.addEventListener("gestureend", e => e.preventDefault());

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