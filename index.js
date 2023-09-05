const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1500;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const player = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Fighter({
  position: {
    x: 1000,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

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
decreaseTimer();
document.querySelector(".btn").addEventListener("click", () => {
  window.location.reload();
});
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //Player moves
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //Enemy moves
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //Detect for attack/crash each other (collision)
  if (rectangularCollision(player, enemy) && player.isAttacking) {
    console.log("Player attacked");
    player.isAttacking = false;
    enemy.health -= 20;
    document.getElementById("enemyHealth").style.width = enemy.health + "%";
  }
  if (rectangularCollision(enemy, player) && enemy.isAttacking) {
    console.log("enemy attacked");
    enemy.isAttacking = false;
    player.health -= 20;
    document.getElementById("playerHealth").style.width = player.health + "%";
  }

  //end Game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner(player, enemy, timerId);
  }
}

animate();

window.addEventListener("keydown", (e) => {
  //console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      if (player.health > 0 && enemy.health > 0) {
        player.attack();
      }
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "Control":
      if (player.health > 0 && enemy.health > 0) {
        enemy.attack();
      }
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;

    default:
      break;
  }
});
window.addEventListener("keyup", (e) => {
  //console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //enemy keys
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
