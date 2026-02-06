// ===== S.S.V KoToClicker Core =====

// --- DOM ---
const $ = (id) => document.getElementById(id);

// --- STATE ---
const state = {
  score: 0,
  clickPower: 1,
  autoPower: 0
};

// --- SAVE / LOAD ---
function save() {
  localStorage.setItem("kotoSave", JSON.stringify(state));
}

function load() {
  const data = JSON.parse(localStorage.getItem("kotoSave"));
  if (!data) return;

  state.score = Number(data.score) || 0;
  state.clickPower = Number(data.clickPower) || 1;
  state.autoPower = Number(data.autoPower) || 0;
}

// --- UPDATE UI ---
function update() {
  $("score").textContent = state.score;
  renderShop();
  renderKazino();
  save();
}

// --- CLICK ---
function clickCat() {
  state.score += state.clickPower;
  update();
}

// --- AUTO ---
setInterval(() => {
  if (state.autoPower > 0) {
    state.score += state.autoPower;
    update();
  }
}, 1000);

// ===== SHOP =====

const shopItems = [
  {
    name: "Улучшить клик",
    desc: "+1 к силе клика",
    price: 50,
    buy() {
      state.clickPower += 1;
      this.price = Math.floor(this.price * 1.5);
    }
  },
  {
    name: "Автоклик",
    desc: "+1 рыба в секунду",
    price: 100,
    buy() {
      state.autoPower += 1;
      this.price = Math.floor(this.price * 1.7);
    }
  }
];

function renderShop() {
  const box = $("shopItems");
  if (!box) return;

  box.innerHTML = "";

  shopItems.forEach((item, i) => {
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
      item.buy();
      update();
    };

    box.appendChild(div);
  });
}

// ===== KAZINO =====

const kazinoModes = [
  { name: "PROBNIK", desc: "50% шанс x2", chance: 0.5, mult: 2 },
  { name: "RISK", desc: "20% шанс x5", chance: 0.2, mult: 5 },
  { name: "ULTRA", desc: "5% шанс x20", chance: 0.05, mult: 20 }
];

function playKazino(index) {
  const bet = 10;

  if (state.score < bet) {
    alert("Недостаточно рыб!");
    return;
  }

  state.score -= bet;

  const mode = kazinoModes[index];

  if (Math.random() < mode.chance) {
    state.score += bet * mode.mult;
    alert("ВЫИГРЫШ x" + mode.mult);
  } else {
    alert("Проигрыш ☠️");
  }

  update();
}

function renderKazino() {
  const box = $("kazinoModes");
  if (!box) return;

  box.innerHTML = "";

  kazinoModes.forEach((mode, i) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <b>${mode.name}</b><br>
      <small>${mode.desc}</small><br>
      <button>Играть (10 🐟)</button>
    `;

    div.querySelector("button").onclick = () => {
      playKazino(i);
    };

    box.appendChild(div);
  });
}

// ===== INIT =====

load();
update();

$("cat")?.addEventListener("click", clickCat);