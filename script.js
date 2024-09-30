let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let maxErrors = 0; // 最大失誤次數
let currentErrors = 0; // 當前失誤次數

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('restart-button-fail').addEventListener('click', restartGame);

    // 當選擇普通模式時，顯示說明
    document.querySelectorAll('input[name="difficulty"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.value === 'normal') {
                document.getElementById('normal-mode-description').style.display = 'block';
            } else {
                document.getElementById('normal-mode-description').style.display = 'none';
            }
        });
    });
});

function startGame() {
    cards = [];
    matchedPairs = 0; 
    currentErrors = 0; 
    document.getElementById('congrats-message').classList.add('hidden'); 
    document.getElementById('game-over-message').classList.add('hidden'); 

    document.getElementById('options').style.display = 'none';
    document.getElementById('difficulty-options').style.display = 'none';
    document.getElementById('type-options').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('game-board').style.display = 'grid'; 

    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    if (difficulty === "easy") {
        maxErrors = Infinity; // 簡單模式無限制
    } else {
        maxErrors = 3; // 普通模式限制三次失誤
    }

    const cardType = document.querySelector('input[name="card-type"]:checked').value;
    let images;

    if (cardType === "animals") {
        images = [
            '41241204/1.png', '41241204/1.png',
            '41241204/2.png', '41241204/2.png',
            '41241204/3.jpg', '41241204/3.jpg',
            '41241204/4.png', '41241204/4.png',
            '41241204/5.png', '41241204/5.png',
            '41241204/6.png', '41241204/6.png',
            '41241204/7.png', '41241204/7.png',
            '41241204/8.png', '41241204/8.png'
        ];
    } else {
        images = [
            '41241204/10.png', '41241204/10.png',
            '41241204/11.png', '41241204/11.png',
            '41241204/12.png', '41241204/12.png',
            '41241204/13.png', '41241204/13.png',
            '41241204/14.png', '41241204/14.png',
            '41241204/15.png', '41241204/15.png',
            '41241204/16.png', '41241204/16.png',
            '41241204/17.png', '41241204/17.png'
        ];
    }

    cards = shuffle(images);
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; 

    cards.forEach((image) => {
        const cardElement = createCard(image);
        gameBoard.appendChild(cardElement);
    });

    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flipped'); 
    });

    const displayTime = parseInt(document.querySelector('input[name="display-time"]:checked').value);

    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped'); 
            }
        });
    }, displayTime); 
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner" onclick="flipCard(this)">
            <div class="card-front">
                <img src="41241204/9.png" alt="背面圖片">
            </div>
            <div class="card-back">
                <img src="${image}" alt="正面圖片">
            </div>
        </div>
    `;
    return card;
}

function flipCard(cardInner) {
    if (lockBoard) return;
    const card = cardInner.parentElement;

    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;

        if (firstCard.innerHTML === secondCard.innerHTML) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs++;

            setTimeout(() => {
                firstCard.remove(); // 從 DOM 中移除第一張卡片
                secondCard.remove(); // 從 DOM 中移除第二張卡片
            }, 500); 

            resetBoard();

            if (matchedPairs === 8) { 
                showCongratsMessage();
            }
        } else {
            currentErrors++;
            if (currentErrors >= maxErrors) {
                showGameOverMessage(); 
            } else {
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    resetBoard();
                }, 1000); 
            }
        }
    }
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function showCongratsMessage() {
    document.getElementById('congrats-message').classList.remove('hidden'); 
    document.getElementById('game-board').style.display = 'none'; 
}

function showGameOverMessage() {
    document.getElementById('game-over-message').classList.remove('hidden'); 
    document.getElementById('game-board').style.display = 'none'; 
}

function restartGame() {
    document.getElementById('options').style.display = 'block'; 
    document.getElementById('difficulty-options').style.display = 'block'; 
    document.getElementById('type-options').style.display = 'block'; 
    document.getElementById('start-button').style.display = 'block'; 
    document.getElementById('congrats-message').classList.add('hidden'); 
    document.getElementById('game-over-message').classList.add('hidden'); 
}