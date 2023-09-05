const rectangularCollision = (rectangle1, rectangle2) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

function determineWinner(player, enemy, tID) {
  clearTimeout(tID);
  document.querySelector("#tie").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#tie p").innerHTML = "No Winner!";
  } else if (player.health > enemy.health) {
    document.querySelector("#tie p").innerHTML = "Player 1 Wins";
  } else {
    document.querySelector("#tie p").innerHTML = "Player 2 Wins";
  }
}

//Timer
let defaultTime = 60;
let timerId;
function decreaseTimer() {
  if (defaultTime > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    defaultTime--;
    document.querySelector("#timer").innerHTML = defaultTime;
  }

  if (defaultTime === 0) {
    determineWinner(player, enemy, timerId);
  }
}
