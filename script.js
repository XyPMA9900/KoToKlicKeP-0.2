const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {

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