const playBtn = document.querySelector(".btn-play");
const alertMsg = document.querySelector(".alert-danger");

function allLetter(inputtxt) {
  let regex = /^[A-Za-z]+$/;
  if (regex.test(inputtxt)) {
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
  } 
  else if (!allLetter(playerName)) {
    alertMsg.textContent = "Player name can only have alphabets - No spaces.";
    alertMsg.removeAttribute("hidden");}
  else {
    alertMsg.setAttribute("hidden", true);
    localStorage.setItem("currentPlayer", playerName);
    window.open("/game", "_self");
    //registerPlayer(playerName);
  }
});
