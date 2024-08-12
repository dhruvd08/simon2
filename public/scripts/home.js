const playBtn = document.querySelector(".btn-play");
const alertMsg = document.querySelector(".alert-danger");

function allLetter(inputtxt) {
  let regexEng = /^[A-Za-z\s]+$/;
  let regexDev = /[\u0900-\u097F]+/;
  if (regexEng.test(inputtxt) || regexDev.test(inputtxt)) {
    return true;
  } else {
    return false;
  }
}

playBtn.addEventListener("click", () => {
  const playerName = document.querySelector(".name-input").value.trim();

  if (playerName === "") {
    alertMsg.textContent = "Player name cannot be blank.";
    alertMsg.removeAttribute("hidden");
  } else if (!allLetter(playerName)) {
    alertMsg.textContent = "Player name cannot have special characters.";
    alertMsg.removeAttribute("hidden");
  } else {
    alertMsg.setAttribute("hidden", true);
    localStorage.setItem("currentPlayer", playerName);
    window.open("/game", "_self");
    //registerPlayer(playerName);
  }
});
