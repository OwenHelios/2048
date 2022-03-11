import Grid from "./grid.js"
import Tile from "./Tile.js"

const gameBoard = document.getElementById('game-board')

const grid = new Grid(gameBoard)


grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)


setUpInput()

function setUpInput() {
  addEventListener('keydown', handleInput, {once: true})
}

// addEventListener('keydown', handleInput)

async function handleInput(e) {
  switch(e.key) {
    case 'ArrowLeft':
    case 'a':
      if(!canMoveLeft()) {
        setUpInput()
        return
      }
      await moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
      if(!canMoveRight()) {
        setUpInput()
        return
      }
      await moveRight();
      break;
    case 'ArrowDown':
    case 's':
      if(!canMoveDown()) {
        setUpInput()
        return
      }
      await moveDown();
      break;
    case 'ArrowUp':
    case 'w':
      if(!canMoveUp()) {
        setUpInput()
        return
      }
      await moveUp();
      break;
    default:
      setUpInput()
        return
  }

  grid.cells.forEach(cell => cell.mergeTiles())

  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile
  

  if(! (canMoveDown() || canMoveUp() || canMoveLeft() || canMoveRight())){
    newTile.waitForTransition(true).then(() => {
      alert('Game Over')
    })
    return
  }

  setUpInput()
}

function slideTiles(gridArray){
  //**********************
  return Promise.all(
  gridArray.flatMap(group => {
    const promises = []
  //***********************
    for(let i=1; i<group.length; i++){
      const cell = group[i]
      if(cell.tile == null) continue
      let lastValidCell
      for(let j=i-1; j>=0; j--){
        const moveToCell = group[j]
        if(!moveToCell.canAccept(cell.tile)) break
        lastValidCell = moveToCell
      }
      if(lastValidCell) {
//*****************************
        promises.push(cell.tile.waitForTransition())
//*******************************
        if(lastValidCell.tile){
          lastValidCell.mergeTile = cell.tile
        } else {
          lastValidCell.tile = cell.tile
        }
        cell.tile = null
      }
    }
    //**********************
    return promises

  }))
}

function moveUp() {
  slideTiles(grid.cellsByColumn)
}

function moveDown() {
  slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
  slideTiles(grid.cellsByRow)
}

function moveRight() {
  slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(gridArray) {
  return gridArray.some( group => {
    return group.some( (cell, index) => {
      if(index === 0) return false
      if(cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}

function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}


