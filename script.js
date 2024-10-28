const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');

let grid = [];
let score = 0;

function startGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    score = 0;
    scoreDisplay.innerText = score;
    addTile();
    addTile();
    updateGrid();
}

function addTile() {
    const emptyTiles = [];
    grid.forEach((row, rIndex) => {
        row.forEach((tile, cIndex) => {
            if (tile === 0) {
                emptyTiles.push({ rIndex, cIndex });
            }
        });
    });
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    if (randomTile) {
        grid[randomTile.rIndex][randomTile.cIndex] = Math.random() < 0.5 ? 2 : 4;
    }
}

function updateGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile tile-' + tile;
            tileElement.innerText = tile !== 0 ? tile : '';
            gridContainer.appendChild(tileElement);
        });
    });
}

function move(direction) {
    let moved = false;
    switch (direction) {
        case 'up':
            for (let c = 0; c < 4; c++) {
                const column = grid.map(row => row[c]).filter(num => num);
                moved = slideTiles(column, c, true) || moved;
            }
            break;
        case 'down':
            for (let c = 0; c < 4; c++) {
                const column = grid.map(row => row[c]).filter(num => num);
                moved = slideTiles(column.reverse(), c, false) || moved;
            }
            break;
        case 'left':
            grid.forEach((row, rIndex) => {
                const newRow = row.filter(num => num);
                moved = slideTiles(newRow, rIndex) || moved;
            });
            break;
        case 'right':
            grid.forEach((row, rIndex) => {
                const newRow = row.filter(num => num).reverse();
                moved = slideTiles(newRow, rIndex, false) || moved;
            });
            break;
    }
    if (moved) {
        addTile();
        updateGrid();
    }
}

function slideTiles(tiles, index, isColumn = false) {
    let moved = false;
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] === tiles[i + 1]) {
            tiles[i] *= 2;
            score += tiles[i];
            tiles.splice(i + 1, 1);
            moved = true;
        }
    }
    while (tiles.length < 4) tiles.push(0);
    if (isColumn) {
        tiles.forEach((value, rIndex) => {
            grid[rIndex][index] = value;
        });
    } else {
        grid[index] = tiles;
    }
    scoreDisplay.innerText = score;
    return moved;
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
});

// Start the game
startGame();
