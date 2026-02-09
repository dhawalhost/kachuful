# Kachuful Scorer

A premium scoring application for the Kachuful (Judgement) card game. Track scores, validate bids with dealer restrictions, and enjoy a beautiful dark-mode interface.

## Features

- ✅ **Automated Scoring:** Accurate calculation with multiple scoring variants
- 🎯 **Dealer Restriction:** Enforces official Kachuful bidding rules  
- 📊 **Live Scoreboard:** Real-time standings and statistics
- 💾 **Auto-Save:** Game state persists across sessions
- 📱 **Mobile-First:** Responsive design for phones and tablets
- 🎨 **Premium UI:** Dark mode with vibrant gradients and smooth animations

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Game Rules

**Kachuful** (also known as Judgement) is a trick-taking card game where players predict the exact number of tricks they'll win.

### Core Mechanics
- **Players:** 2-10 (optimal 4-6)
- **Rounds:** 13 rounds (7 cards → 1 card → 7 cards)
- **Trump Rotation:** ♠️ Spades → ♦️ Diamonds → ♣️ Clubs → ♥️ Hearts → No Trump

### Scoring (Standard)
- **Exact match:** `10 + predicted tricks`
- **Mismatch:** `0 points`
- **Example:** Predict 3, win 3 = 13 points | Predict 3, win 2 = 0 points

### Key Rule: Dealer Restriction
The last bidder (dealer) cannot bid a number that makes the total bids equal the total tricks available. This prevents guaranteed success for all players.

## Project Structure

```
src/
├── components/
│   └── screens/
│       ├── GameSetup.tsx
│       ├── BiddingScreen.tsx
│       ├── TricksEntry.tsx
│       ├── Scoreboard.tsx
│       └── FinalResults.tsx
├── lib/
│   └── game-logic.ts      # Pure scoring logic
├── store/
│   └── gameStore.ts       # Zustand state management
├── types/
│   └── game.ts            # TypeScript definitions
└── index.css              # Design system & Tailwind
```

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **State:** Zustand (with persistence)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Development

```bash
# Run dev server (with hot reload)
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Preview production build
npm run preview
```

## Documentation

- **[PRD](PRD.md)** - Product requirements and features
- **[RULE_ENGINE.md](RULE_ENGINE.md)** - Scoring logic specification
- **[UI_FLOW.md](UI_FLOW.md)** - Screen-by-screen flows
- **[DATA_SCHEMA.json](DATA_SCHEMA.json)** - State management schema
- **[Roadmap.md](Roadmap.md)** - Development roadmap

## License

MIT License - feel free to use for personal or commercial projects.

## Acknowledgments

Built with ❤️ for Kachuful enthusiasts worldwide.
