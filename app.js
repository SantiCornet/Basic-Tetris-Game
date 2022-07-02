//ARRAYS AND VARIABLES

const grid = document.querySelector(".grid");

//First we create an Array with all the divs. We will call it "squares"

let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");

// this is the width of the grid. Each row is made up of 10 divs. We
// have 20 rows of 10 divs each
const width = 10;

/* hello = function (){
    return 'Hello World'
}

hello = () => 'Hello World' */

//Then we will create an array for each tetrominio shape and position. Each shape has four positions.
// each shape is made up of divs, and you determine the divs by their index in the array squares
// the shape ltetromino[0] is made up of the following divs: 1, 11, 21, 2.

let nextRandom = 0
let timerId
let score = 0

const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2 + 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetraminoes = [lTetromino, zTetromino,tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
// this is the position of the first div of the current tetromino.
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetraminoes.length);
//we want to pick a shape randomly. We have to pick a number btw 0 and 4. Math.random does that, and math.floor rounds up to the lowest integer.

//Math.Floor. Remember the lenght is 5, since it will always round up to the lowest integer, you will never get 5. You can get from 0 to 4.

/*The Math.random() function returns a floating-point, pseudo-random number in the range 0 to less than 1 (inclusive of 0, but not 1) 
with approximately uniform distribution over that range — which you can then scale to your desired range. The implementation selects 
the initial seed to the random number generation algorithm; it cannot be chosen or reset by the user.*/

let current = theTetraminoes[random][0];
// this is the current tetromino, which is one of the shapes of the theTetrominoes array,  and the first shape index [0]

// in order to move the random tetromino, first shape - index [random][0] of array theTetrominoes -  to the array index 4 - current position- , you have to add to each element of the first shape
// of the array ltetromino - theTetrominoes [0] [0]-

//timerId = setInterval(moveDown, 500);

document.addEventListener("keyup", control);

//START BUTTON

startBtn.addEventListener('click', () => {
  if(timerId) {clearInterval(timerId); timerId = null}
  else{draw(); timerId = setInterval(moveDown, 500); nextRandom = Math.floor(Math.random()*theTetraminoes.length); displayShape()}
})

//MINI GRID

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0


const upNextTetrominoes = [
  [1,displayWidth+1, displayWidth*2+1,2],
  [0, displayWidth, displayWidth+1, displayWidth*2+1],
  [1, displayWidth, displayWidth+1, displayWidth +2],
  [0, 1, displayWidth, displayWidth+1],
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
]


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCTIONS DRAW AND UNDRAW

function draw() {
  current.forEach((index) => {squares[currentPosition + index].classList.add("tetromino")});
}

function undraw() {
  current.forEach((index) => {squares[currentPosition + index].classList.remove("tetromino");});
}

//FUNCTION CONTROL

function control(e) {
  if (e.keyCode === 37) {moveLeft();}
  else if (e.keyCode === 38) {rotate()} 
  else if (e.keyCode === 39) {moveRight()} 
  else if (e.keyCode === 40) {moveDown();}
}

/*The keydown and keyup events provide a code indicating which key is pressed, while keypress indicates which character was entered. 
For example, a lowercase "a" will be reported as 65 by keydown and keyup, but as 97 by keypress. An uppercase "A" is reported as 65 by all events.*/

//FUNCTION MOVEDOWN

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//FUNCTION FREEZE

function freeze() {
  if (current.some((index) => squares[currentPosition + index + width].classList.contains("taken"))) 
  {current.forEach((index) => squares[currentPosition + index].classList.add("taken"));
  //start a new tetromino falling
  random = nextRandom
  nextRandom = Math.floor(Math.random() * theTetraminoes.length);
  current = theTetraminoes[random][currentRotation];
  currentPosition = 4;
  draw()
  displayShape()
  addScore()
  gameOver()
}
}

// move the tetromino left, unless is at the edge or there is blockage

//FUNCTION MOVELEFT

function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

  //we are checking if any of the tetromino squares is in a index such that divided by ten, the remainder is 0. It will gives a boolean answer

  if (!isAtLeftEdge) {currentPosition -= 1;}
  else if (current.some((index) =>squares[currentPosition + index].classList.contains("taken"))) {currentPosition += 1;}
  
  draw();
}

//FUNCTION MOVERIGHT

function moveRight() {
  undraw();
  const isAtRightEdge = current.some((index) => (currentPosition + index) % width === 9);
  if (!isAtRightEdge) {currentPosition += 1;}
  else if (current.some((index) =>squares[currentPosition + index].classList.contains("taken"))) {currentPosition -= 1;}
  draw();
}


//FUNCTION ROTATE

function rotate(){
  undraw()
  currentRotation ++
  if (currentRotation === current.length){currentRotation=0}
  current = theTetraminoes[random][currentRotation]
  draw()
}


//FUNCTION DISPLAYSHAPE

function displayShape(){
  displaySquares.forEach(square => {square.classList.remove('tetromino')})
  upNextTetrominoes[nextRandom].forEach(index => {displaySquares[displayIndex + index].classList.add('tetromino')})
}



//itemArray.splice(startIndex, deletecount)

//FUNCTION ADDSCORE

function addScore() {
  for(let i=0; i < 199; i += width){
    const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
    if(row.every(index => squares[index].classList.contains('taken'))){score +=10; scoreDisplay.innerHTML = score; row.forEach(index => {squares[index].classList.remove('taken'); squares[index].classList.remove('tetromino')})
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach (cell => grid.appendChild(cell))
   }
  }
}

//FUNCTION GAMEOVER

function gameOver(){
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    scoreDisplay.innerHTML = 'end'
    clearInterval(timerId)
  }
}