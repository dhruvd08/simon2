const playBtn = document.querySelector(".btn-play");
const alertMsg = document.querySelector(".alert-danger");
const host = "http://localhost:8080";

async function registerPlayer(playerName) {
  try {
    const response = await fetch(`${host}/register`, {
      method: "POST",
      body: JSON.stringify({ playerName: playerName }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    if (json.errorMsg) {
      alertMsg.textContent = json.errorMsg;
      alertMsg.removeAttribute("hidden");
    } else {
      localStorage.setItem(playerName, 0);
      window.open("/game", "_self");
    }
  } catch (err) {
    alertMsg.textContent = "Technical Error - we're working on it.";
    alertMsg.removeAttribute("hidden");
  }
}

playBtn.addEventListener("click", () => {
  const playerName = document.querySelector(".name-input").value;
  if (playerName === "") {
    alertMsg.textContent = "Player name cannot be blank.";
    alertMsg.removeAttribute("hidden");
  } else {
    alertMsg.setAttribute("hidden", true);
    localStorage.setItem("currentPlayer", playerName);
    window.open("/game", "_self");
    //registerPlayer(playerName);
  }
});
