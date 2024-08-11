const playBtn = document.querySelector(".btn-play");
const alertMsg = document.querySelector(".alert-danger");

playBtn.addEventListener("click", () => {
  const playerName = document.querySelector(".name-input").value;
  if (playerName === "") {
    alertMsg.textContent = "Player name cannot be blank.";
    alertMsg.removeAttribute("hidden");
  } else {
    alertMsg.setAttribute("hidden", true);
    localStorage.setItem("currentPlayer", playerName.trim());
    window.open("/game", "_self");
    //registerPlayer(playerName);
  }
});
