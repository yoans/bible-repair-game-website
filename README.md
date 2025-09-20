# Bible Repair Game Website

A landing page for the Bible Repair Game that allows users to download the mobile app or play directly in their browser.

## Features

- **Download Mobile App**: Links to Android and iOS app stores
- **Play in Browser**: Full browser-based version of the game
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Game Features**: Complete word-unscrambling gameplay with Bible verses

## Game Description

The Bible Repair Game is an interactive word game where players unscramble Bible verses by placing words in the correct order. The game includes:

- Multiple Bible verses from various books
- Progress tracking and completion percentage
- Sneak peek feature for hints
- Mobile-optimized interface
- Audio feedback (in mobile app)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mobile App**: SvelteKit + Capacitor
- **Build Tool**: Vite
- **Languages**: TypeScript, JavaScript

## File Structure

```
bible-repair-game-website/
├── index.html          # Main landing page
├── styles.css          # Styling (matches original game design)
├── script.js           # Website functionality
├── game.js             # Browser game logic
├── favicon.png         # Site icon
└── README.md           # This file
```

## Local Development

1. Clone or download the files
2. Open `index.html` in a web browser
3. Or serve with a local HTTP server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

## Game Instructions

1. **Read the Reference**: Each verse shows the book, chapter, and verse reference
2. **Place Words**: Tap empty slots to place the highlighted word in the correct position
3. **Complete the Verse**: Continue until all words are correctly placed
4. **Use Hints**: Use the "Sneak Peek" button if you need to see the complete verse

## Original Repository

Based on the original Bible Verse Unscramble game: https://github.com/yoans/bible-verse-unscramble

## Creator

Created by **Nathaniel Young** - [nathaniel-young.com](https://nathaniel-young.com)  
Developed by **Sagacia Software** - [sagaciasoft.com](https://sagaciasoft.com)

## License

MIT License - See the original repository for full license details.
Website and landing page for the Bible Repair Game
