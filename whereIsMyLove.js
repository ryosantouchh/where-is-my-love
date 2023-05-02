//  need npm install prompt-sync
const prompt = require("prompt-sync")({ sigint: true });
const clear = require("clear-screen");

const heart = "♡";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(fieldArray) {
    this._field = fieldArray;
    this.y_axis = 0; // column
    this.x_axis = 0; // row
    this.goal;
    this.isHard;
    this.moveCount = 0;
    this.isPlaying = true;
    this.isLose;
  }

  play() {
    // get rows and columns amount using this._field array
    const row = this._field.length;
    const column = this._field[0].length;

    // checking game mode >> set character position
    this.gameMode(row, column);

    // random place "HEART" or goal to field
    this.randomGoal(row, column);

    //  print current field event where user walk on field array
    this.print();

    // play game loop until change this.isPlaying
    while (this.isPlaying) {
      this.move();
      this.moveCount += 1;

      // generate more hole in hard mode
      if (this.isHard) {
        this.moveCount % 2 === 0 && this.moveCount !== 0
          ? this.generateHardModeHole()
          : null;
      }

      this.print();
      console.log(`Moving count : ${this.moveCount}`);

      this.checkWinning();
    }

    this.isLose
      ? console.log("Your heart is gone...........")
      : console.log("Congratulation! You found your heart ♡♡♡♡♡");
  }

  // winning checker focus on change isPlaying value based on isLose variable
  checkWinning() {
    if (this.y_axis === this.goal[0] && this.x_axis === this.goal[1]) {
      this.isPlaying = false;
    } else if (this.isLose) {
      this.isPlaying = false;
    } else {
      this.isPlaying = true;
    }
  }

  move() {
    let path = prompt(
      "Which way you wanna walk - w (UP) s (DOWN) a (LEFT) d (RIGHT) : "
    ).toLowerCase();

    switch (path) {
      case "w":
        this.checkOutOfField("w");
        break;
      case "a":
        this.checkOutOfField("a");
        break;
      case "s":
        this.checkOutOfField("s");
        break;
      case "d":
        this.checkOutOfField("d");
        break;
    }
  }

  checkOutOfField(path) {
    if (path === "w" && this.y_axis !== 0) {
      this.canWalk(-1, 0);
    } else if (path === "a" && this.x_axis !== 0) {
      this.canWalk(0, -1);
    } else if (path === "s" && this.y_axis !== this._field.length - 1) {
      this.canWalk(1, 0);
    } else if (path === "d" && this.x_axis !== this._field[0].length - 1) {
      this.canWalk(0, 1);
    } else {
      this.isPlaying = false;
      this.isLose = true;
    }
  }

  canWalk(y = 0, x = 0) {
    this.checkHole(y, x);
    this._field[(this.y_axis += y)][(this.x_axis += x)] = pathCharacter;
  }

  checkHole(y = 0, x = 0) {
    let nextPosition = [this.y_axis + y, this.x_axis + x];
    if (this._field[nextPosition[0]][nextPosition[1]] === hole) {
      this.isLose = true;
    }
  }

  gameMode(row, column) {
    this.isHard = prompt(
      "type YES to play in hard mode || type ANYTHING to play in relax mode : "
    ).toLowerCase();

    // checking game mode condition : hard or relax mode
    if (this.isHard === "yes") {
      // call method for set new starting point for hard mode
      this.setCharacterPosition(
        Math.floor(Math.random() * row),
        Math.floor(Math.random() * column)
      );
      this._field[this.y_axis][this.x_axis] = pathCharacter;
      this.isHard = true;
      console.log(`${this.y_axis} ${this.x_axis}`);
    } else {
      this._field[this.y_axis][this.x_axis] = pathCharacter;
      console.log(`${this.y_axis} ${this.x_axis}`);
      this.isHard = false;
    }
  }

  setCharacterPosition(y, x) {
    this.y_axis = y;
    this.x_axis = x;
  }

  // generate hole every 2 move in hard mode
  generateHardModeHole() {
    let checkWhile = true;
    while (checkWhile) {
      let y_hole = Math.floor(Math.random() * this._field.length);
      let x_hole = Math.floor(Math.random() * this._field[0].length);
      if (
        this._field[y_hole][x_hole] !== heart &&
        this._field[y_hole][x_hole] !== hole &&
        this._field[y_hole][x_hole] !== pathCharacter
      ) {
        this._field[y_hole][x_hole] = hole;
        checkWhile = false;
      }
    }
  }

  randomGoal(row, column) {
    // set game endpoint
    this.goal = [
      Math.floor(Math.random() * row),
      Math.floor(Math.random() * column),
    ];
    this._field[this.goal[0]][this.goal[1]] = heart;
  }

  print() {
    clear();
    this._field.forEach((e) => console.log(e.join("")));
  }

  static generateField() {
    // declare row , column and hole percentage for the field
    let row = +prompt("enter rows 10-30 : ");
    let column = +prompt("enter columns 10-30 : ");
    let percentage = +prompt("enter hole percentage 10-100 : ");

    while (
      row < 10 ||
      row > 30 ||
      column > 30 ||
      column < 10 ||
      percentage > 100 ||
      percentage < 10
    ) {
      console.log(
        "row and column should be 1-10 and hole percentage should be 10-100"
      );
      row = +prompt("enter rows 10-30 : ");
      column = +prompt("enter columns 10-30 : ");
      percentage = +prompt("enter hole percentage 10-100 : ");
    }

    // set field array
    let resultField = [];
    let tempComponents = [];
    let area = row * column;
    let holeAmount = Math.floor(area * (percentage / 100));

    for (let i = 0; i < row; i++) {
      resultField.push([]);
    }

    for (let i = 0; i < area - holeAmount; i++) {
      tempComponents.push(fieldCharacter);
    }

    for (let i = 0; i < holeAmount; i++) {
      tempComponents.push(hole);
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        // splice return new array
        resultField[i][j] = tempComponents.splice(
          Math.floor(Math.random() * tempComponents.length),
          1
        )[0];
      }
    }

    // console.log(resultField);
    // resultField array
    return resultField;
  }
}

const a = new Field(Field.generateField());
a.play();
