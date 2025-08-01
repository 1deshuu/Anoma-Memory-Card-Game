class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.startTime = null;
        this.timer = null;
        
        // Kart görselleri - her karttan 2 adet olacak
        this.cardImages = [
            'assets/anoma ateş.png',
            'assets/anoma uçuş.png',
            'assets/anoma top.png',
            'assets/anoma npc.png',
            'assets/anoma yemek.png',
            'assets/anoma elmas.png',
            'assets/anoma bisiklet.png',
            'assets/anoma sihir.png'
        ];
        
        this.cardBackImage = 'assets/anoma kart2.png';
        
        this.init();
    }
    
    init() {
        this.createCards();
        this.shuffleCards();
        this.renderBoard();
        this.bindEvents();
        this.startTimer();
    }
    
    createCards() {
        this.cards = [];
        // Her karttan 2 adet oluştur
        this.cardImages.forEach((image, index) => {
            this.cards.push({
                id: index * 2,
                image: image,
                isFlipped: false,
                isMatched: false
            });
            this.cards.push({
                id: index * 2 + 1,
                image: image,
                isFlipped: false,
                isMatched: false
            });
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            if (card.isFlipped) {
                cardElement.classList.add('flipped');
            }
            if (card.isMatched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.innerHTML = `
                <div class="card-front">
                    <img src="${card.image}" alt="Kart" onerror="this.style.display='none'">
                </div>
                <div class="card-back">
                    <img src="${this.cardBackImage}" alt="Kart Arka" onerror="this.style.display='none'">
                </div>
            `;
            
            gameBoard.appendChild(cardElement);
        });
    }
    
    bindEvents() {
        const gameBoard = document.getElementById('game-board');
        const resetBtn = document.getElementById('reset-btn');
        const playAgainBtn = document.getElementById('play-again-btn');
        
        gameBoard.addEventListener('click', (e) => {
            const cardElement = e.target.closest('.card');
            if (cardElement && !cardElement.classList.contains('flipped') && !cardElement.classList.contains('matched')) {
                this.flipCard(parseInt(cardElement.dataset.index));
            }
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
        
        playAgainBtn.addEventListener('click', () => {
            this.resetGame();
            document.getElementById('win-message').classList.remove('show');
        });
    }
    
    flipCard(index) {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTime = Date.now();
        }
        
        const card = this.cards[index];
        // Eğer kart zaten açık, eşleşmiş veya 2 kart zaten açıksa tıklamayı engelle
        if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) return;
        
        // Kartı çevir
        card.isFlipped = true;
        this.flippedCards.push(index);
        
        // Animasyon için DOM'u güncelle
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        cardElement.classList.add('flipped');
        
        // İki kart açıldığında kontrol et
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        if (card1.image === card2.image) {
            // Eşleşme bulundu
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            // Eşleşen kartları işaretle
            setTimeout(() => {
                document.querySelector(`[data-index="${index1}"]`).classList.add('matched');
                document.querySelector(`[data-index="${index2}"]`).classList.add('matched');
            }, 300);
            
            this.flippedCards = [];
            
            // Oyun bitti mi kontrol et
            if (this.matchedPairs === this.cardImages.length) {
                setTimeout(() => {
                    this.showWinMessage();
                }, 500);
            }
        } else {
            // Eşleşme bulunamadı, kartları geri çevir
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                
                document.querySelector(`[data-index="${index1}"]`).classList.remove('flipped');
                document.querySelector(`[data-index="${index2}"]`).classList.remove('flipped');
                
                this.flippedCards = [];
            }, 750); // Kartların görünme süresi 0.75 saniye
        }
    }
    
    updateDisplay() {
        document.getElementById('moves').textContent = this.moves;
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            if (this.gameStarted) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById('time').textContent = timeString;
            }
        }, 1000);
    }
    
    showWinMessage() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-time').textContent = timeString;
        document.getElementById('win-message').classList.add('show');
    }
    
    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.startTime = null;
        
        this.updateDisplay();
        this.createCards();
        this.shuffleCards();
        this.renderBoard();
    }
}

// Oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
}); 