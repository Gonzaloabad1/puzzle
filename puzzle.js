// --- LÓGICA DEL JUEGO ---
const board = document.getElementById('puzzle-board');
const victoryScreen = document.getElementById('victory-screen');
const shuffleBtn = document.getElementById('shuffle-btn');

const rows = 3;
const cols = 3;
const totalTiles = rows * cols;

let correctOrder = [];
let currentOrder = [];
let firstSelected = null;

// 1. Calcular los recortes automáticos de la imagen (posiciones de fondo)
for (let i = 0; i < totalTiles; i++) {
    let r = Math.floor(i / cols);
    let c = i % cols;
    let posX = -(c * 133);
    let posY = -(r * 177);
    correctOrder.push({ id: i, posX: posX, posY: posY });
}

currentOrder = [...correctOrder];

// 2. Pintar las piezas en la pantalla
function createBoard() {
    board.innerHTML = '';
    currentOrder.forEach((tileData, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.backgroundPosition = `${tileData.posX}px ${tileData.posY}px`;
        tile.addEventListener('click', () => selectTile(index));
        board.appendChild(tile);
    });
}

// 3. Intercambiar piezas al hacer clic
function selectTile(index) {
    if (firstSelected === null) {
        firstSelected = index;
        board.children[index].style.outline = "4px solid #ffcc00";
        board.children[index].style.boxShadow = "0 0 15px #ffcc00";
    } else {
        let secondSelected = index;
        board.children[firstSelected].style.outline = "none";
        board.children[firstSelected].style.boxShadow = "none";
        
        let temp = currentOrder[firstSelected];
        currentOrder[firstSelected] = currentOrder[secondSelected];
        currentOrder[secondSelected] = temp;
        
        firstSelected = null;
        createBoard();
        checkWin();
    }
}

// 4. Desordenar de forma aleatoria
function shuffleTiles() {
    for (let i = currentOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentOrder[i], currentOrder[j]] = [currentOrder[j], currentOrder[i]];
    }
    createBoard();
    removeConfetti();
    victoryScreen.classList.add('hidden');
}

// 5. Comprobar si el puzzle está resuelto
function checkWin() {
    const isWin = currentOrder.every((tile, index) => tile.id === correctOrder[index].id);
    if (isWin) {
        // Un brevísimo retraso para apreciar la última pieza encajada antes del cartel
        setTimeout(triggerVictory, 200);
    }
}

// 6. Activar la victoria (Cartel + Confeti al unísono)
function triggerVictory() {
    victoryScreen.classList.remove('hidden');
    createConfetti();
}

// 7. Generador de la animación de confeti nativo
function createConfetti() {
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6', '#00eeee'];
    
    // Generamos 100 partículas con comportamientos aleatorios
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'; // Velocidad entre 2 y 4s
        confetti.style.animationDelay = (Math.random() * 2) + 's'; // Retrasos escalonados
        
        const size = Math.random() * 8 + 8 + 'px'; // Tamaños variados
        confetti.style.width = size;
        confetti.style.height = size;

        victoryScreen.appendChild(confetti);
    }
}

// Limpiar el confeti viejo al reiniciar
function removeConfetti() {
    const pieces = document.querySelectorAll('.confetti-piece');
    pieces.forEach(p => p.remove());
}

function restartGame() {
    shuffleTiles();
}

// Iniciar mezclado automáticamente al abrir la página
shuffleTiles();