# Complete MVP Generation Prompt for Antigravity

---

## 🎯 PROJECT OVERVIEW

Create a **Kachuful Scorer** web application - a premium scoring tracker for the Indian card game Kachuful (also known as Judgement). This is a trick-taking card game where players predict the exact number of tricks they'll win each round.

**Target User:** Card game players who want automated, error-free score tracking  
**Platform:** Progressive Web App (mobile-first, works offline)  
**Timeline:** MVP in ~2-3 weeks

---

## 📚 REFERENCE DOCUMENTS

You have access to complete specifications in the project directory:

1. **[PRD.md](file:///Users/dhawal.dyavanpalli/.gemini/antigravity/brain/4f5f27a6-635a-416f-8e82-d5fe0272b2bc/prd.md)** - Complete product requirements and game rules
2. **[RULE_ENGINE.md](file:///Users/dhawal.dyavanpalli/go/src/kachuful/RULE_ENGINE.md)** - Pure scoring logic and validation algorithms
3. **[UI_FLOW.md](file:///Users/dhawal.dyavanpalli/go/src/kachuful/UI_FLOW.md)** - Screen-by-screen UI flows and layouts
4. **[DATA_SCHEMA.json](file:///Users/dhawal.dyavanpalli/go/src/kachuful/DATA_SCHEMA.json)** - Complete TypeScript data models
5. **[Roadmap.md](file:///Users/dhawal.dyavanpalli/.gemini/antigravity/brain/4f5f27a6-635a-416f-8e82-d5fe0272b2bc/roadmap.md)** - 8-week development plan

**IMPORTANT:** Read ALL reference documents before starting implementation.

---

## 🎮 GAME RULES QUICK REFERENCE

### Core Mechanics
- **Players:** 2-10 (optimal 4-6)
- **Rounds:** 13 rounds typically (7 cards → 1 card → 7 cards pattern)
- **Trump Rotation:** ♠️ Spades → ♦️ Diamonds → ♣️ Clubs → ♥️ Hearts → No Trump (repeats)

### Key Rules
1. **Bidding:** Each player predicts exact tricks they'll win (0 to cards dealt)
2. **Dealer Restriction:** Last bidder (dealer) cannot bid a number that makes total bids = total tricks
3. **Scoring (Standard):** If prediction matches actual → `10 + predicted`, else `0`
4. **Zero Bid:** Predict 0, win 0 → 10 points (valid strategy!)

### Example Round
- Round 3: 5 cards dealt, ♣️ Clubs trump
- Player 1 bids 2, Player 2 bids 1, Player 3 bids 0, Player 4 (dealer) bids... 
  - CANNOT bid 2 (2+1+0+2 = 5, equals total tricks)
  - CAN bid 0, 1, 3, 4, or 5
- After playing: P1 wins 2 → 12 pts, P2 wins 0 → 0 pts, P3 wins 0 → 10 pts, P4 wins 3 → 0 pts

---

## 🎨 DESIGN REQUIREMENTS

### Visual Aesthetics (CRITICAL!)
- **Premium feel:** This must WOW users - vibrant gradients, glassmorphism, smooth animations
- **Card game theme:** Use ♠️♥️♦️♣️ suit symbols throughout
- **Dark mode first:** Rich dark background with glowing accents
- **Modern 2026 design:** NOT basic or minimal - think Apple/Stripe quality

### Color Palette
```css
--primary: linear-gradient(135deg, #1E3A8A 0%, #7C3AED 100%); /* Blue to purple */
--accent: #F59E0B; /* Gold for highlights/leader */
--success: #10B981; /* Green for correct predictions */
--error: #EF4444; /* Red for wrong predictions */
--suit-red: #DC2626; /* Hearts ♥️, Diamonds ♦️ */
--suit-black: #1F2937; /* Spades ♠️, Clubs ♣️ */
```

### Typography
- **Headings:** Bold, 2xl-4xl
- **Body:** Clean sans-serif (Inter, Outfit, or similar)
- **Scores:** Tabular numbers or monospace

### Animations
- Button hovers, clicks (scale, ripple)
- Page transitions (smooth fade/slide)
- Score updates (count-up animation)
- Winner reveal (confetti celebration)

---

## 🏗️ TECHNICAL STACK

### Required Technologies
```bash
# Core
- Vite (build tool)
- React 18+ with TypeScript
- React Router (routing)

# Styling
- Tailwind CSS (preferred) OR vanilla CSS with design tokens

# State Management
- Zustand (recommended) OR React Context

# Storage
- LocalStorage for MVP
- (Future: IndexedDB for Phase 2)

# Icons
- Lucide React or similar

# Utilities
- UUID generation (crypto.randomUUID())
- Date handling (native or date-fns)
```

### Project Setup Command
```bash
npx create-vite@latest ./ --template react-ts
npm install
npm install react-router-dom zustand lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📁 FOLDER STRUCTURE

```
/src
  /components
    /screens
      GameSetup.tsx
      BiddingScreen.tsx
      TricksEntry.tsx
      Scoreboard.tsx
      FinalResults.tsx
    /shared
      Button.tsx
      Card.tsx
      Header.tsx
      Modal.tsx
  /lib
    game-logic.ts       # Pure functions from RULE_ENGINE.md
    storage.ts          # LocalStorage operations
    utils.ts
  /types
    game.ts             # Interfaces from DATA_SCHEMA.json
  /store
    gameStore.ts        # Zustand store
  /styles
    globals.css         # Design tokens, Tailwind config
  /hooks
    useGameState.ts
  App.tsx
  main.tsx
  routes.tsx
```

---

## 🔨 IMPLEMENTATION STEPS

### Phase 1: Foundation (Day 1-2)

#### 1.1 Project Initialization
```bash
# Initialize Vite + React + TypeScript
npx create-vite@latest ./ --template react-ts

# Install dependencies
npm install react-router-dom zustand lucide-react

# Setup Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 1.2 Create Design System
Create `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Color tokens */
    --primary-start: #1E3A8A;
    --primary-end: #7C3AED;
    --accent: #F59E0B;
    --success: #10B981;
    --error: #EF4444;
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
  }
  
  body {
    @apply bg-gray-900 text-gray-100;
    font-family: 'Inter', sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-gradient-to-r from-blue-900 to-purple-700 
           text-white px-6 py-3 rounded-lg
           hover:scale-105 transition-transform
           font-semibold text-lg;
  }
  
  .card {
    @apply bg-gray-800/50 backdrop-blur-lg
           border border-gray-700 rounded-xl p-6
           shadow-xl;
  }
}
```

#### 1.3 Setup TypeScript Types
Create `src/types/game.ts` - **Copy all interfaces from DATA_SCHEMA.json**

---

### Phase 2: Core Logic (Day 2-3)

#### 2.1 Implement Rule Engine
Create `src/lib/game-logic.ts` - **Implement ALL functions from RULE_ENGINE.md:**

```typescript
// Must include (see RULE_ENGINE.md for complete logic):
- calculateScore(predicted, actual, variant)
- validateBids(bids, totalTricks, dealerIndex)
- getTrumpSuit(roundNumber)
- getCardsDealt(roundNumber, settings)
- getDealerIndex(roundNumber, totalPlayers)
- getBiddingOrder(dealerIndex, totalPlayers)
- isGameComplete(currentRound, totalRounds)
```

**CRITICAL:** Write unit tests for all scoring variants!

#### 2.2 State Management
Create `src/store/gameStore.ts` using Zustand:

```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, PlayerBid, PlayerResult } from '../types/game';

interface GameStore {
  game: GameState | null;
  
  // Actions
  initGame: (playerNames: string[], settings?) => void;
  submitBids: (bids: PlayerBid[]) => void;
  submitResults: (results: PlayerResult[]) => void;
  nextRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  // Selectors
  getCurrentRound: () => Round | undefined;
  getLeader: () => Player | undefined;
  isComplete: () => boolean;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,
      
      initGame: (playerNames, settings) => {
        // Implementation from DATA_SCHEMA.json
      },
      
      submitBids: (bids) => {
        // See DATA_SCHEMA.json for logic
      },
      
      // ... other methods
    }),
    {
      name: 'kachuful-game-state',
    }
  )
);
```

---

### Phase 3: UI Components (Day 3-7)

#### 3.1 Game Setup Screen
**Reference:** UI_FLOW.md - Screen 2

```typescript
// src/components/screens/GameSetup.tsx

Key features:
- Player count selector (2-10)
- Dynamic name inputs
- Scoring variant radio buttons
- Advanced settings (collapsible)
- Validation: no duplicates, all names filled

Design:
- Large, touch-friendly inputs
- Card suit decorations
- Gradient background
- Smooth validation feedback
```

#### 3.2 Bidding Screen
**Reference:** UI_FLOW.md - Screen 3

```typescript
// src/components/screens/BiddingScreen.tsx

Key features:
- Show round info (number, cards, trump, dealer)
- Progress indicator (X/Y players bid)
- Bid buttons 0-[cards dealt]
- Dealer restriction validation
- Visual warning when dealer violates rule

Design:
- Large bid buttons (min 48x48px)
- Trump suit icon (colored ♠️♥️♦️♣️)
- Disabled state for invalid dealer bids
- Pulse animation on current player
```

#### 3.3 Tricks Entry Screen
**Reference:** UI_FLOW.md - Screen 4

```typescript
// src/components/screens/TricksEntry.tsx

Key features:
- For each player: show name, bid, trick selector
- Real-time score preview (✅ matched / ❌ missed)
- Validation: sum must equal cards dealt
- Calculate scores button (disabled until valid)

Design:
- Green checkmark for matched predictions
- Red X for missed predictions
- Points preview: "+12 points" or "+0 points"
- Celebration micro-animation on successful bid
```

#### 3.4 Scoreboard Screen
**Reference:** UI_FLOW.md - Screen 5

```typescript
// src/components/screens/Scoreboard.tsx

Key features:
- Leader highlight card (🏆 + name + score)
- Rankings table: Player, Score, Accuracy
- Expandable round-by-round breakdown
- "Next Round" or "View Results" button

Design:
- Gold gradient for leader card
- Responsive table (horizontal scroll mobile)
- Count-up animation when scores update
- Trophy icon for #1
```

#### 3.5 Final Results Screen
**Reference:** UI_FLOW.md - Screen 6

```typescript
// src/components/screens/FinalResults.tsx

Key features:
- Winner announcement (huge, bold)
- Confetti animation
- Final rankings with medals (🥇🥈🥉)
- Game statistics (most accurate, highest round, etc.)
- Actions: View Scoreboard, Play Again, New Game

Design:
- Fullscreen celebration
- Confetti particles (use canvas or library)
- Trophy bounce animation
- Medal reveal sequence
```

---

### Phase 4: Routing & Integration (Day 8-9)

#### 4.1 Setup React Router
```typescript
// src/routes.tsx

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <GameSetup /> },
  { path: '/bidding', element: <BiddingScreen /> },
  { path: '/tricks', element: <TricksEntry /> },
  { path: '/scoreboard', element: <Scoreboard /> },
  { path: '/results', element: <FinalResults /> },
]);

// In App.tsx
import { RouterProvider } from 'react-router-dom';

function App() {
  return <RouterProvider router={router} />;
}
```

#### 4.2 Navigation Guards
- Redirect to `/` if no active game
- Prevent accessing future rounds
- Confirm before quitting mid-game

---

### Phase 5: Polish & Testing (Day 10-12)

#### 5.1 Animations
```typescript
// Add to components:
- Page transitions (Framer Motion or CSS)
- Button hover/click effects
- Score count-up (react-countup or custom)
- Confetti (react-confetti or canvas-confetti)
```

#### 5.2 Responsive Design
Test on:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1024px+

#### 5.3 Error States
- Network errors (future)
- Invalid state recovery
- Corrupted LocalStorage handling

#### 5.4 Performance
- Lazy load routes
- Optimize re-renders (React.memo, useMemo)
- Lighthouse audit (target 90+)

---

## ✅ ACCEPTANCE CRITERIA

### Must Work
- [ ] Can complete full 13-round game without errors
- [ ] Scoring 100% accurate (test all variants)
- [ ] Dealer restriction properly enforced
- [ ] LocalStorage persistence works (refresh page mid-game)
- [ ] Mobile-responsive (works on phone)

### Must Look Premium
- [ ] Dark mode with vibrant gradients
- [ ] Smooth animations (60 FPS)
- [ ] Card suit symbols visible throughout
- [ ] No "basic" or "minimal" aesthetic - must WOW

### Must Be Tested
- [ ] 5+ complete games played manually
- [ ] Edge cases tested (2 players, 10 players, zero bids)
- [ ] All scoring variants verified
- [ ] Browser: Chrome, Safari, Firefox

---

## 🚀 DEPLOYMENT

```bash
# Build
npm run build

# Deploy to Vercel
npx vercel

# OR deploy to Netlify
npx netlify deploy --prod
```

**Environment:**
- No environment variables needed for MVP
- Pure client-side app
- Works offline after first load

---

## 📋 VERIFICATION CHECKLIST

Before considering MVP complete:

### Functional Tests
- [ ] Setup game with 4 players
- [ ] Play Round 1: All players bid, enter tricks, see scores
- [ ] Verify dealer restriction blocks invalid bid
- [ ] Test zero bid (0 predicted, 0 actual → 10 points)
- [ ] Complete all 13 rounds
- [ ] View final results, see correct winner
- [ ] Click "Play Again" → new game with same players works
- [ ] Refresh browser mid-game → state restored correctly

### Edge Cases
- [ ] 2-player game works
- [ ] 10-player game works
- [ ] All players bid 0 (dealer can't bid 0)
- [ ] Maximum bid (all cards)
- [ ] Trump rotation correct (verify round 5 = no trump, round 6 = spades)

### UI/UX
- [ ] Mobile: All buttons easily tappable
- [ ] Animations smooth, no jank
- [ ] Leader highlight visible and correct
- [ ] Confetti plays on winner screen
- [ ] Dark mode looks premium

### Performance
- [ ] Lighthouse score 90+ (Performance, Accessibility, Best Practices)
- [ ] Page load < 2 seconds
- [ ] No console errors
- [ ] Works offline (after first load)

---

## 🐛 KNOWN EDGE CASES TO HANDLE

From RULE_ENGINE.md:

1. **Zero Bid Success:** Predict 0, win 0 → 10 points (not 0!)
2. **Dealer Restriction with 2 Players:** If P1 bids 3 (total 5 tricks), dealer CANNOT bid 2
3. **No Trump Round:** Highest card of lead suit wins (no trump cards)
4. **Single Card Round:** Only 1 trick available, careful with dealer restriction
5. **Tie Breaker:** If multiple players have same max score, show all as co-winners

---

## 🎯 SUCCESS METRICS

After launch:
- **Usage:** 5+ complete games in first week
- **Accuracy:** Zero scoring bugs reported
- **Feedback:** "Wow, this looks amazing!" reactions
- **Performance:** Sub-2s load time
- **Retention:** Users come back for 2nd game

---

## 📦 DELIVERABLES

1. **Working App:** Deployed URL on Vercel/Netlify
2. **Source Code:** Clean, TypeScript, commented
3. **README.md:** Setup instructions, how to run
4. **Video Demo:** 2-min screencast of full game (optional but nice)

---

## ⚠️ CRITICAL REMINDERS

1. **Read ALL references docs first** (PRD, RULE_ENGINE, UI_FLOW, DATA_SCHEMA)
2. **Premium design is non-negotiable** - basic UI = failure
3. **Mobile-first** - most users will be on phones during card games
4. **Test dealer restriction thoroughly** - most complex rule
5. **Zero bid edge case** - must award 10 points, not 0
6. **LocalStorage persistence** - don't lose games on refresh!

---

## 🚦 START COMMAND

**To begin implementation, say:**

> "I'm ready to build the Kachuful Scorer MVP. I've read all reference documents (PRD, RULE_ENGINE, UI_FLOW, DATA_SCHEMA). Let's start with Step 1: Project initialization using Vite + React + TypeScript."

Then proceed through each phase systematically.

---

## 📞 SUPPORT

If you encounter issues:
1. Check reference docs for specifications
2. Review RULE_ENGINE.md for scoring logic
3. Check UI_FLOW.md for screen layouts
4. Verify DATA_SCHEMA.json for state structure

**Good luck building an amazing Kachuful Scorer! 🎮🏆**
