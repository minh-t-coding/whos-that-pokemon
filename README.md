# Who's That Pokémon?

An interactive Pokémon guessing game built with Angular and NgRx. Test your knowledge of Pokémon by identifying them from silhouettes, with hints available if you get stuck.

**[Play the Game](https://minh-t-coding.github.io/whos-that-pokemon/)**

## Installation

### Prerequisites
- Node.js (v18+)
- npm (v10+)

### Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/minh-t-coding/whos-that-pokemon.git
cd whos-that-pokemon
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run serve
```

Navigate to `http://localhost:4200/` in your browser.

## How to Play

1. **Select Difficulty**: Choose from Kanto, Johto, or World Tour
2. **Enter Your Name**: Your score will be saved under this name
3. **Guess the Pokémon**: Type the Pokémon's name in the input field
4. **Use Hints**: Click the Hint button to unlock progressive hints
5. **Scan or Skip**: 
   - **Scan**: Submit your guess
   - **Skip**: Move to the next Pokémon (limited to 5 skips)
6. **View Collection**: Check your caught Pokémon anytime during gameplay
7. **Game Over**: When you reach 3 wrong guesses or use all 5 skips, the game ends

## Scoring System

Points are calculated based on:
- **Time Taken**: Faster guesses earn more points
  - ≤5 seconds: +50 bonus
  - ≤10 seconds: +40 bonus
  - ≤20 seconds: +30 bonus
  - ≤30 seconds: +20 bonus
  - \>30 seconds: +10 bonus

- **Base Score**: 100 points
- **Difficulty Multiplier**:
  - Kanto: 1x
  - Johto: 1.4x
  - World: 1.8x

## API Integration

Data is fetched from the **PokéAPI v2**:
- Pokemon information (sprites, types, cries)
- Supports up to 1,025 Pokémon

## Browser Storage

The app uses browser localStorage to persist:
- **Game State**: Player scores, caught Pokémon, attempts
- **Leaderboard**: Top scores for all players
- **Settings**: Volume preferences

## Deployment

Deployed on GitHub Pages at: https://minh-t-coding.github.io/whos-that-pokemon/

## Contributors

- **Minh Nguyen**
- **Devan Martinez**
