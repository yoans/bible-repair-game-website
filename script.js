// Main website JavaScript functionality

// Interactive hero demo functionality
let currentDemoWord = 'so';
let demoWordsToPlace = ['so', 'loved', 'world'];
let demoCurrentIndex = 0;

function selectWord(element) {
    // Remove active class from all words
    document.querySelectorAll('.available-word').forEach(word => {
        word.classList.remove('active');
    });
    
    // Add active class to selected word
    element.classList.add('active');
    currentDemoWord = element.getAttribute('data-word');
    
    // Update instruction
    const instruction = document.querySelector('.current-word');
    if (instruction) {
        instruction.textContent = currentDemoWord;
    }
    
    // Update highlighting
    updateSlotHighlighting();
}

function placeWord(expectedWord, slotElement) {
    if (currentDemoWord === expectedWord && !slotElement.classList.contains('filled')) {
        // Fill the slot
        slotElement.textContent = currentDemoWord;
        slotElement.classList.remove('empty', 'highlight');
        slotElement.classList.add('filled');
        
        // Mark word as used
        const usedWord = document.querySelector(`[data-word="${currentDemoWord}"]`);
        if (usedWord && usedWord.classList.contains('available-word')) {
            usedWord.classList.add('used');
            usedWord.onclick = null;
        }
        
        // Move to next word
        demoCurrentIndex++;
        if (demoCurrentIndex < demoWordsToPlace.length) {
            currentDemoWord = demoWordsToPlace[demoCurrentIndex];
            
            // Auto-select next word
            const nextWord = document.querySelector(`[data-word="${currentDemoWord}"].available-word`);
            if (nextWord && !nextWord.classList.contains('used')) {
                selectWord(nextWord);
            }
        } else {
            // All words placed - show completion
            setTimeout(() => {
                const hint = document.querySelector('.demo-hint');
                hint.innerHTML = '🎉 Perfect! You completed: "For God so loved the world"<br><a href="#full-demo" class="try-full-demo-link" onclick="scrollToFullDemo()">🚀 Try the Full Demo with More Verses</a>';
                hint.style.color = 'rgba(39, 174, 96, 1)';
                hint.style.fontWeight = 'bold';
            }, 500);
        }
    }
}

function updateSlotHighlighting() {
    // Remove all highlights
    document.querySelectorAll('.word-slot').forEach(slot => {
        slot.classList.remove('highlight');
    });
    
    // Highlight the correct slot for current word
    const targetSlot = document.querySelector(`[data-word="${currentDemoWord}"]`);
    if (targetSlot && targetSlot.classList.contains('empty')) {
        targetSlot.classList.add('highlight');
    }
}

// Legacy function for backward compatibility
function repairWord(element) {
    const originalWord = element.getAttribute('data-original');
    if (originalWord && element.classList.contains('scrambled')) {
        element.textContent = originalWord;
        element.classList.remove('scrambled');
        element.classList.add('repaired');
        element.onclick = null;
    }
}

function showGame() {
    const gameSection = document.getElementById('browser-game');
    gameSection.style.display = 'block';
    
    // Scroll to the game section
    gameSection.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize the game if not already done
    if (!game) {
        game = new BibleRepairGame('game-area');
    }
}

// Expand demo function
function expandDemo() {
    const readySection = document.querySelector('.ready-section');
    const demoSection = document.getElementById('demo-section');
    
    // Hide the ready section and show the demo
    readySection.style.display = 'none';
    demoSection.style.display = 'block';
    
    // Reset demo state
    resetDemo();
}

// Scroll to full demo function
function scrollToFullDemo() {
    const fullDemoSection = document.getElementById('full-demo');
    if (fullDemoSection) {
        fullDemoSection.scrollIntoView({ behavior: 'smooth' });
        // Also expand the demo if it's not already visible
        const demoSection = document.getElementById('demo-section');
        if (demoSection && demoSection.style.display === 'none') {
            expandDemo();
        }
    }
}

function resetDemo() {
    // Reset demo variables
    currentDemoWord = 'so';
    demoCurrentIndex = 0;
    
    // Reset UI elements
    document.querySelectorAll('.word-slot').forEach(slot => {
        if (slot.getAttribute('data-word')) {
            slot.textContent = '___';
            slot.classList.remove('filled');
            slot.classList.add('empty');
        }
    });
    
    // Reset word bank
    document.querySelectorAll('.available-word').forEach(word => {
        word.classList.remove('used', 'active');
        word.onclick = function() { selectWord(this); };
    });
    
    // Set first word as active
    const firstWord = document.querySelector('[data-word="so"].available-word');
    if (firstWord) {
        selectWord(firstWord);
    }
    
    // Reset hint
    const hint = document.querySelector('.demo-hint');
    if (hint) {
        hint.textContent = '✨ Click a word, then click where it goes!';
        hint.style.color = 'rgba(255, 255, 255, 0.7)';
        hint.style.fontWeight = 'normal';
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Optional: hook for download buttons (currently both navigate normally)
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Intentionally allow default navigation for both iOS and Android
        });
    });
    
    // Add animation on scroll for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('.features, .how-to-play, .tech-info');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add some utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copied to clipboard: ' + text);
    });
}

// Add keyboard shortcuts for the game
document.addEventListener('keydown', function(e) {
    if (game && document.getElementById('browser-game').style.display !== 'none') {
        switch(e.key) {
            case 'r':
            case 'R':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    game.resetVerse();
                }
                break;
            case 's':
            case 'S':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    game.skipVerse();
                }
                break;
            case ' ':
                if (game.gameState === 'playing') {
                    e.preventDefault();
                    game.toggleSneakPeek();
                }
                break;
        }
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', function(e) {
    // Enable touch interactions
}, { passive: true });

// Performance optimization: Lazy load images when they come into view
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);