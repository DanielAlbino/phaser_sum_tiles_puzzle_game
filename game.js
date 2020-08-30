var game;
window.onload = () => {
  var gameConfig = {
    width: 800,
    height: 800,
    backgroundColor: 0x9bf6ff,
    scene: [bootGame, playGame],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
};

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }
  preload() {
    this.load.image("emptytile", "Assets/emptyTile.png");
  }
  create() {
    this.scene.start("PlayGame");
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  create() {
    this.add.image(100, 100, "emptytile");
  }
}

const resizeGame = () => {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
};
