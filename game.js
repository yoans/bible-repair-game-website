// Bible Repair Game - Browser Version
// Ported from the original Svelte app logic

class BibleRepairGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentVerseIndex = 0;
        this.currentVerse = null;
        this.originalWords = [];
        this.wordObjects = [];
        this.constructedVerse = [];
        this.placedWordCount = 0;
        this.currentWordToPlace = null;
        this.completionPercentage = 0;
        this.gameState = 'loading'; // 'loading', 'showing', 'playing', 'completed'
        this.countdown = 5;
        this.sneakPeekCount = 0;
        this.isShowingVerse = false;
        this.countdownInterval = null;
        this.feedbackTimeout = null;
        
        // Sample verses from the original game
        this.versesData = {
            verses: [
                {
                    id: 1,
                    reference: "John 3:16",
                    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
                },
                {
                    id: 2,
                    reference: "Psalm 23:1",
                    text: "The LORD is my shepherd; I shall not want."
                },
                {
                    id: 3,
                    reference: "Philippians 4:13",
                    text: "I can do all things through Christ who strengthens me."
                },
                {
                    id: 4,
                    reference: "Romans 8:28",
                    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
                },
                {
                    id: 5,
                    reference: "Genesis 1:1",
                    text: "In the beginning God created the heavens and the earth."
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupVerse(0);
        this.render();
    }
    
    setupVerse(index) {
        if (!this.versesData.verses || this.versesData.verses.length === 0) return;
        
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
        
        this.currentVerseIndex = index % this.versesData.verses.length;
        this.currentVerse = this.versesData.verses[this.currentVerseIndex];
        if (!this.currentVerse) return;
        
        // Split words and create Word objects
        this.originalWords = this.currentVerse.text.split(/\s+/).reduce((acc, word) => {
            const punctuationMatch = word.match(/[.,!?;:"]+$/);
            if (punctuationMatch) {
                const punctuation = punctuationMatch[0];
                const cleanWord = word.slice(0, -punctuation.length);
                acc.push(cleanWord + punctuation);
            } else {
                acc.push(word);
            }
            return acc;
        }, []);
        
        this.wordObjects = this.originalWords.map((text, i) => ({
            id: `word-${i}`,
            text: text,
            originalIndex: i,
            used: false
        }));
        
        this.constructedVerse = this.originalWords.map(() => ({ 
            word: null, 
            isCorrect: null, 
            isIncorrectFlash: false 
        }));
        
        this.placedWordCount = 0;
        this.completionPercentage = 0;
        this.countdown = 5;
        this.sneakPeekCount = 0;
        this.isShowingVerse = false;
        this.gameState = 'showing';
        this.currentWordToPlace = null;
        
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                if (this.countdownInterval) clearInterval(this.countdownInterval);
                this.gameState = 'playing';
                this.selectNextWordToPlace();
            }
            this.render();
        }, 1000);
        
        this.render();
    }
    
    selectNextWordToPlace() {
        const unusedWords = this.wordObjects.filter(w => !w.used);
        if (unusedWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * unusedWords.length);
            this.currentWordToPlace = unusedWords[randomIndex];
        } else {
            this.currentWordToPlace = null;
            if (this.placedWordCount === this.originalWords.length && this.gameState !== 'completed') {
                this.gameState = 'completed';
            }
        }
        this.render();
    }
    
    handleSlotClick(tappedSlotIndex) {
        if (this.gameState !== 'playing' || this.isShowingVerse || !this.currentWordToPlace || this.constructedVerse[tappedSlotIndex]?.word) return;
        
        if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
        this.constructedVerse = this.constructedVerse.map(slot => ({ ...slot, isIncorrectFlash: false }));
        
        if (tappedSlotIndex === this.currentWordToPlace.originalIndex) {
            // Correct slot tapped
            this.wordObjects = this.wordObjects.map(w =>
                w.id === this.currentWordToPlace.id ? { ...w, used: true } : w
            );
            
            this.constructedVerse[tappedSlotIndex] = { 
                word: this.currentWordToPlace, 
                isCorrect: true, 
                isIncorrectFlash: false 
            };
            this.placedWordCount++;
            this.updateCompletionPercentage();
            this.selectNextWordToPlace();
        } else {
            // Incorrect slot tapped
            this.constructedVerse[tappedSlotIndex].isIncorrectFlash = true;
            
            this.feedbackTimeout = setTimeout(() => {
                if (this.constructedVerse[tappedSlotIndex]) {
                    this.constructedVerse[tappedSlotIndex].isIncorrectFlash = false;
                    this.render();
                }
            }, 500);
        }
        
        this.render();
    }
    
    updateCompletionPercentage() {
        this.completionPercentage = this.originalWords.length > 0
            ? Math.round((this.placedWordCount / this.originalWords.length) * 100)
            : 0;
    }
    
    skipVerse() {
        this.setupVerse(this.currentVerseIndex + 1);
    }
    
    resetVerse() {
        this.setupVerse(this.currentVerseIndex);
    }
    
    toggleSneakPeek() {
        if (this.gameState !== 'playing') return;
        this.isShowingVerse = !this.isShowingVerse;
        if (this.isShowingVerse) {
            this.sneakPeekCount++;
        }
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        let html = '';
        
        if (this.gameState === 'loading') {
            html = '<p>Loading verses...</p>';
        } else if (!this.currentVerse) {
            html = '<p>No verse loaded.</p>';
        } else {
            html = `
                <h2 class="reference">${this.currentVerse.reference}</h2>
                <div class="game-area">
            `;
            
            if (this.gameState === 'showing') {
                html += `
                    <div class="showing-verse">
                        <p>${this.currentVerse.text}</p>
                        <div class="countdown">Starting in ${this.countdown} seconds...</div>
                    </div>
                `;
            } else if (this.gameState === 'playing' || this.gameState === 'completed') {
                // Answer area
                html += '<div class="answer-area">';
                this.constructedVerse.forEach((slot, i) => {
                    const wordLength = slot.word?.text.length || this.originalWords[i]?.length || 5;
                    const classes = ['answer-slot'];
                    if (slot.isCorrect === true) classes.push('correct');
                    if (slot.isIncorrectFlash) classes.push('incorrect-flash');
                    if (slot.word !== null) classes.push('filled');
                    
                    html += `
                        <div class="${classes.join(' ')}" 
                             style="--word-length: ${wordLength}ch;"
                             onclick="game.handleSlotClick(${i})"
                             data-slot="${i}">
                            <div class="word-placeholder">
                                ${slot.word ? `<span class="word-text">${slot.word.text}</span>` : '<span class="placeholder-line"></span>'}
                            </div>
                            <div class="slot-number">${i + 1}</div>
                        </div>
                    `;
                });
                html += '</div>';
                
                if (this.gameState === 'completed') {
                    html += `
                        <p class="completion-message">Verse Complete!</p>
                        <p class="sneak-peek-final-count">Sneak Peeks Used: ${this.sneakPeekCount}</p>
                        <button onclick="game.setupVerse(${this.currentVerseIndex + 1})" class="button next-verse-button">Next Verse</button>
                    `;
                }
                
                // Word display area
                if (this.gameState === 'playing' && !this.isShowingVerse && this.currentWordToPlace) {
                    html += `
                        <div class="word-display-area">
                            <p class="instruction">Tap the correct spot for:</p>
                            <div class="word-to-place">${this.currentWordToPlace.text}</div>
                        </div>
                    `;
                } else if (this.gameState === 'playing' && !this.isShowingVerse && !this.currentWordToPlace && this.placedWordCount < this.originalWords.length) {
                    html += '<p class="completion-message">Loading next word...</p>';
                }
                
                // Sneak peek verse display
                if (this.gameState === 'playing' && this.isShowingVerse) {
                    html += `
                        <div class="showing-verse sneak-peek-active">
                            <p>${this.currentVerse.text}</p>
                        </div>
                    `;
                }
                
                // Controls & Progress
                html += `
                    <div class="controls">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${this.completionPercentage}%"></div>
                            <span class="progress-text">${this.completionPercentage}%</span>
                        </div>
                        <div class="buttons">
                `;
                
                if (this.gameState === 'playing') {
                    html += `
                        <button onclick="game.toggleSneakPeek()" class="button sneak-peek-button" ${this.isShowingVerse ? 'disabled' : ''}>
                            Sneak Peek (${this.sneakPeekCount})
                        </button>
                    `;
                }
                
                html += `
                            <button onclick="game.resetVerse()" class="button reset-button">Reset</button>
                            <button onclick="game.skipVerse()" class="button skip-button">Skip</button>
                        </div>
                `;
                
                if (this.isShowingVerse) {
                    html += '<button onclick="game.toggleSneakPeek()" class="button hide-peek-button">Hide Verse</button>';
                }
                
                html += '</div>';
            }
            
            html += '</div>';
        }
        
        this.container.innerHTML = html;
    }
}

// Global game instance
let game;