var game;
var gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 4,
  },
  tweenSpeed: 1000,
};
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

window.onload = () => {
  var gameConfig = {
    width:
      gameOptions.boardSize.cols *
        (gameOptions.tileSize + gameOptions.tileSpacing) +
      gameOptions.tileSpacing,
    height:
      gameOptions.boardSize.rows *
        (gameOptions.tileSize + gameOptions.tileSpacing) +
      gameOptions.tileSpacing,
    backgroundColor: 0x9bf6ff,
    scene: [bootGame, playGame],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
}; // function

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }
  preload() {
    this.load.image("emptytile", "Assets/emptyTile.png");
    this.load.spritesheet("tiles", "Assets/tiles_sprite.png", {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize,
    });
  } //preload
  create() {
    this.scene.start("PlayGame");
  } //create
} //class

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
    this.canMove = false;
    this.boardArray = [];
    this.input.keyboard.on("keydown", this.handleKey, this);
    this.input.on("pointerup", this.handleSwipe, this);

    for (var i = 0; i < 4; i++) {
      this.boardArray[i] = [];
      for (var j = 0; j < 4; j++) {
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
        var tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
        tile.visible = false;
        this.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile,
        };
      }
    }
    this.addTile();
    this.addTile();
  } //create

  handleKey(e) {
    if (this.canMove) {
      switch (e.code) {
        case "keyA":
        case "ArrowLeft":
          this.makeMove(LEFT);
          break;
        case "keyD":
        case "ArrowRight":
          this.makeMove(RIGHT);
          break;
        case "keyW":
        case "ArrowUp":
          this.makeMove(UP);
          break;
        case "KeyS":
        case "ArrowDown":
          this.makeMove(DOWN);
          break;
      }
    }
  }

  makeMove(direction) {
    console.log("About to Move " + direction);
  }

  handleSwipe(e) {
    var swipeTime = e.upTime - e.downTime;
    var swipe = new Phaser.Geom.Point(e.upX - e.downX - e.downY);
    console.log("Movement Time:" + swipeTime + "ms");
    console.log("Horiontal distance:" + swipe.x + "pixels");
    console.log("Vertical distance:" + swipe.y + "pixels");
  }

  getTilePosition(row, col) {
    var posX =
      gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
    var posY =
      gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }

  addTile() {
    var emptyTiles = [];
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        if (this.boardArray[i][j].tileValue == 0) {
          emptyTiles.push({
            row: i,
            col: j,
          });
        }
      }
    }
    if (emptyTiles.length > 0) {
      var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
      this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
      this.tweens.add({
        targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
        alpha: 1,
        duration: gameOptions.tweenSpeed,
        callbackScope: this,
        onComplete: function () {
          console.log("tween completed");
          this.canMove = true;
        },
      });
    }
  }
} //class

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
}; //function
