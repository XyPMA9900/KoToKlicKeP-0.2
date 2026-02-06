// =============================
// 🧠 SAFE CORE
// =============================

const $ = (id) => document.getElementById(id);

function safeNum(v, def = 0) {
  v = Number(v);
  return isNaN(v) || !isFinite(v) ? def : v;
}

// =============================
// 📦 STATE
// =============================

const state = {
  score: 0,
  clickPower: 1,
  autoPower: 0
};

// =============================
// 💾 SAVE / LOAD (ANTI-CORRUPT)
// =============================

function save() {
  try {
    localStorage.setItem("kotoSave", JSON.stringify(state));
  } catch (e) {
    console.warn("Save error:", e);
  }
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem("kotoSave"));
    if (!data) return;

    state.score = safeNum(data.score, 0);
    state.clickPower = safeNum(data.clickPower, 1);
    state.autoPower = safeNum(data.autoPower, 0);
  } catch (e) {
    console.warn("Load error:", e);
  }
}

// =============================
// 🔄 UPDATE
// =============================

function update() {
  if ($("score")) {
    $("score").textContent = state.score + " 🐟";
  }

  renderShop();
  renderKazino();
  save();
}

// =============================
// 🐱 CLICK
// =============================

if ($("cat")) {
  $("cat").addEventListener("click", () => {
    state.score += state.clickPower;
    update();
  });
}

// =============================
// 🤖 AUTO
// =============================

setInterval(() => {
  if (state.autoPower > 0) {
    state.score += state.autoPower;
    update();
  }
}, 1000);

// =============================
// 🛒 SHOP
// =============================

const shopItems = [
  {
    name: "Улучшить клик",
    desc: "+1 к силе клика",
    price: 50,
    buy() {
      state.clickPower += 1;
      this.price = Math.floor(this.price * 1.4);
    }
  },
  {
    name: "Автоклик",
    desc: "+1 рыба в секунду",
    price: 100,
    buy() {
      state.autoPower += 1;
      this.price = Math.floor(this.price * 1.6);
    }
  }
];

function renderShop() {
  const box = $("shopItems");
  if (!box) return;

  box.innerHTML = "";

  shopItems.forEach((item) => {
    if (!item || safeNum(item.price) <= 0) return;

    const div = document.createElement("div");
    const canBuy = state.score >= item.price;

    div.innerHTML = `
      <b>${item.name}</b><br>
      <small>${item.desc}</small><br>
      Цена: ${item.price} 🐟<br>
      <button ${canBuy ? "" : "disabled"}>Купить</button>
    `;

    div.querySelector("button").onclick = () => {
      if (!canBuy) return;

      state.score -= item.price;

      try {
        item.buy();
      } catch (e) {
        console.warn("Shop buy error:", e);
      }

      update();
    };

    box.appendChild(div);
  });
}

// =============================
// 🎰 KAZINO
// =============================

const kazinoModes = [
  { name: "PROBNIK", desc: "50% шанс x2", chance: 0.5, mult: 2 },
  { name: "RISK", desc: "20% шанс x5", chance: 0.2, mult: 5 },
  { name: "ULTRA", desc: "5% шанс x20", chance: 0.05, mult: 20 }
];

function playKazino(index) {
  const betInput = $("kazinoBet");
  const result = $("kazinoResult");

  if (!betInput || !result) return;

  const bet = safeNum(betInput.value, 0);

  if (bet <= 0) {
    result.textContent = "Введите нормальную ставку!";
    return;
  }

  if (bet > state.score) {
    result.textContent = "Недостаточно рыб!";
    return;
  }

  const mode = kazinoModes[index];
  if (!mode) return;

  state.score -= bet;

  try {
    if (Math.random() < mode.chance) {
      const win = bet * mode.mult;
      state.score += win;
      result.textContent = `ВЫИГРЫШ x${mode.mult} (+${win})`;
    } else {
      result.textContent = "Проигрыш ☠️";
    }
  } catch (e) {
    console.warn("Kazino error:", e);
  }

  update();
}

function renderKazino() {
  const box = $("kazinoModes");
  if (!box) return;

  box.innerHTML = "";

  kazinoModes.forEach((mode, i) => {
    if (!mode) return;

    const div = document.createElement("div");

    div.innerHTML = `
      <b>${mode.name}</b><br>
      <small>${mode.desc}</small><br>
      <button>Играть</button>
    `;

    div.querySelector("button").onclick = () => {
      playKazino(i);
    };

    box.appendChild(div);
  });
}

// =============================
// 🪟 MODALS (SAFE)
// =============================

function safeOpen(id) {
  if ($(id)) $(id).style.display = "flex";
}

function safeClose(id) {
  if ($(id)) $(id).style.display = "none";
}

$("openShop")?.addEventListener("click", () => safeOpen("shop"));
$("closeShop")?.addEventListener("click", () => safeClose("shop"));

$("openKazino")?.addEventListener("click", () => safeOpen("kazino"));
$("closeKazino")?.addEventListener("click", () => safeClose("kazino"));

// =============================
// 🚀 INIT
// =============================

load();
update();