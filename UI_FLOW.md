# Kachuful Scorer - UI Flow Specification

> **Purpose:** Screen-by-screen user interface flows and interactions  
> **Version:** 1.0

---

## Screen Map

```
┌─────────────────┐
│  Home Screen    │
│   (Landing)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Game Setup     │◄───────┐
│   Screen        │        │
└────────┬────────┘        │
         │                 │
         ▼                 │
┌─────────────────┐        │
│ Bidding Screen  │        │
│  (Round Start)  │        │
└────────┬────────┘        │
         │                 │
         ▼                 │
┌─────────────────┐        │
│ Tricks Entry    │        │
│    Screen       │        │
└────────┬────────┘        │
         │                 │
         ├─────────────────┤
         │                 │
         ▼                 │
┌─────────────────┐        │
│   Scoreboard    │────────┤ (Next Round)
│    Screen       │        │
└────────┬────────┘        │
         │                 │
         │ (Game Complete) │
         ▼                 │
┌─────────────────┐        │
│ Final Results   │        │
│    Screen       │────────┘ (New Game)
└─────────────────┘
```

---

## Screen 1: Home Screen (Landing)

### Purpose
Welcome screen and entry point to the app

### Layout

```
┌─────────────────────────────────┐
│         [Logo/Icon]             │
│                                 │
│      KACHUFUL SCORER            │
│   Track Your Game Scores        │
│                                 │
│  ┌───────────────────────────┐ │
│  │    🎮 NEW GAME            │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │    📜 GAME HISTORY        │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │    📊 STATISTICS          │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │    ❓ HOW TO PLAY         │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Elements

- **Logo:** Playing card suits (♠️♥️♦️♣️) in gradient
- **Title:** Large, bold "KACHUFUL SCORER"
- **4 Action Buttons:**
  1. New Game → Navigate to Game Setup
  2. Game History → View past games (Phase 2)
  3. Statistics → Player stats (Phase 2)
  4. How to Play → Rules explanation

### Interactions

| Action | Result |
|--------|--------|
| Click "New Game" | Navigate to Game Setup Screen |
| Click "Game History" | Show saved games list |
| Click "Statistics" | Show player stats dashboard |
| Click "How to Play" | Show rules modal/page |

### State
- No game state required
- Check localStorage for saved games (show count on History button)

---

## Screen 2: Game Setup Screen

### Purpose
Configure new game parameters and player information

### Layout

```
┌─────────────────────────────────┐
│  ← Back          SETUP           │
├─────────────────────────────────┤
│                                 │
│  Number of Players              │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┐ │
│  │2 │3 │4 │5 │6 │7 │8 │9 │10│ │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┘ │
│                                 │
│  Player Names                   │
│  ┌───────────────────────────┐ │
│  │ Player 1: [Name_______]   │ │
│  │ Player 2: [Name_______]   │ │
│  │ Player 3: [Name_______]   │ │
│  │ Player 4: [Name_______]   │ │
│  └───────────────────────────┘ │
│                                 │
│  Scoring Variant                │
│  ○ 10 + Predicted (Standard)    │
│  ○ High Incentive               │
│  ○ Medium Incentive             │
│                                 │
│  Advanced Settings ▼            │
│  - Starting Cards: [7_]         │
│  - Total Rounds: [13_]          │
│                                 │
│  ┌───────────────────────────┐ │
│  │    START GAME             │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Elements

#### 2.1: Number of Players Selector
- Horizontal button group (2-10)
- Selected button highlighted
- Default: 4 players

#### 2.2: Player Names
- Dynamic text inputs (appears based on player count)
- Placeholder: "Enter player name"
- Auto-focus on first empty field

#### 2.3: Scoring Variant Radio Buttons
- Default selected: "10 + Predicted"
- Show brief description on hover/tap

#### 2.4: Advanced Settings (Collapsible)
- Starting Cards: Number input (1-13), default 7
- Total Rounds: Number input (1-20), default 13
- Collapsed by default

#### 2.5: Start Game Button
- Large, prominent CTA
- Disabled until valid inputs

### Validation Rules

| Field | Rule |
|-------|------|
| Player Count | Required, 2-10 |
| Player Names | All fields filled, no duplicates |
| Starting Cards | 1-13 |
| Total Rounds | 1-20 |

### Interactions

| Action | Result |
|--------|--------|
| Change player count | Show/hide name inputs |
| Enter player name | Enable/disable Start button |
| Click Start Game | Validate → Create game state → Navigate to Bidding Screen |
| Click Back | Return to Home (confirm if inputs filled) |
| Duplicate name | Show error message |

### Error States

```
┌───────────────────────────────┐
│ ⚠️ Player names must be unique │
│   "Rahul" is already used      │
└───────────────────────────────┘
```

---

## Screen 3: Bidding Screen

### Purpose
Collect bid predictions from all players for current round

### Layout

```
┌─────────────────────────────────┐
│         ROUND 3 of 13           │
│     5 Cards Dealt  |  ♦️ Trump  │
│         Dealer: Priya           │
├─────────────────────────────────┤
│                                 │
│  [■■■□] Players Bid: 3/4        │
│                                 │
│  ✅ Rahul bid 2                 │
│  ✅ Anjali bid 1                │
│  ✅ Vikram bid 0                │
│                                 │
│  ⏳ Priya's Turn (Dealer)       │
│                                 │
│  Select Bid:                    │
│  ┌──┬──┬──┬──┬──┬──┐          │
│  │0 │1 │2 │3 │4 │5 │          │
│  └──┴──┴──┴──┴──┴──┘          │
│                                 │
│  ⚠️ Cannot bid 2                │
│  (Total would equal 5 tricks)   │
│                                 │
│  ┌───────────────────────────┐ │
│  │   CONFIRM BIDS            │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Elements

#### 3.1: Round Header
- Round number: "ROUND X of Y"
- Cards dealt: Large number
- Trump suit: Icon (♠️♥️♦️♣️ or "No Trump")
- Current dealer name

#### 3.2: Progress Indicator
- Visual bar showing bid completion
- Text: "Players Bid: X/Y"

#### 3.3: Bid Summary List
- ✅ Green checkmark for completed bids
- ⏳ Hourglass for current player
- Shows player name and bid amount

#### 3.4: Bid Selection Buttons
- Numbers 0 to [cards dealt]
- Large, touch-friendly (min 48px)
- Disabled buttons for invalid dealer bids

#### 3.5: Dealer Restriction Warning
- Shows when dealer's choice violates rule
- Red/orange alert box
- Explains why bid is invalid

#### 3.6: Confirm Button
- Enabled only when all bids valid
- Disabled if dealer restriction violated

### Bidding Flow

```
┌─────────────────┐
│ Player 1 Bids   │
│ (Left of Dealer)│
└────────┬────────┘
         ▼
┌─────────────────┐
│ Player 2 Bids   │
└────────┬────────┘
         ▼
┌─────────────────┐
│  ...            │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Dealer Bids     │
│ (Last)          │
└────────┬────────┘
         ▼
┌─────────────────┐
│ All Bids Valid? │
├──Yes──┬───No────┤
│       ▼         ▼
│    Confirm   Show Error
│       │
│       ▼
│  Navigate to
│  Tricks Entry
└──────────────────┘
```

### Interactions

| Action | Result |
|--------|--------|
| Click bid number | Select bid for current player, move to next player |
| All bids complete | Enable Confirm button |
| Dealer violates rule | Show warning, disable invalid bids |
| Click Confirm | Validate → Navigate to Tricks Entry |
| Click back (optional) | Show confirmation dialog |

### State Changes

```javascript
state.rounds[currentRound].bids = [
  { playerId: "1", predicted: 2 },
  { playerId: "2", predicted: 1 },
  { playerId: "3", predicted: 0 },
  { playerId: "4", predicted: 1 }
]
```

---

## Screen 4: Tricks Entry Screen

### Purpose
Record actual tricks won by each player after physical gameplay

### Layout

```
┌─────────────────────────────────┐
│         ROUND 3 of 13           │
│     5 Cards Dealt  |  ♦️ Trump  │
├─────────────────────────────────┤
│                                 │
│  Enter Tricks Won               │
│                                 │
│  Rahul     (Bid: 2)             │
│  ┌──┬──┬──┬──┬──┬──┐          │
│  │0 │1 │2 │3 │4 │5 │          │
│  └──┴──┴──┴──┴──┴──┘          │
│  ✅ Matched! +12 points         │
│                                 │
│  Anjali    (Bid: 1)             │
│  ┌──┬──┬──┬──┬──┬──┐          │
│  │0 │1 │2 │3 │4 │5 │          │
│  └──┴──┴──┴──┴──┴──┘          │
│  ❌ Missed (Got 0) +0 points    │
│                                 │
│  Vikram    (Bid: 0)             │
│  ┌──┬──┬──┬──┬──┬──┐          │
│  │0 │1 │2 │3 │4 │5 │          │
│  └──┴──┴──┴──┴──┴──┘          │
│  ✅ Matched! +10 points         │
│                                 │
│  Priya     (Bid: 1)             │
│  ┌──┬──┬──┬──┬──┬──┐          │
│  │0 │1 │2 │3 │4 │5 │          │
│  └──┴──┴──┴──┴──┴──┘          │
│  ✅ Matched! +11 points         │
│                                 │
│  Total: 5/5 tricks ✓            │
│                                 │
│  ┌───────────────────────────┐ │
│  │   CALCULATE SCORES        │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Elements

#### 4.1: Player Trick Entry (Repeated)
- Player name
- Bid reminder: "(Bid: X)"
- Trick selector buttons (0 to cards dealt)
- Real-time result indicator:
  - ✅ Green "Matched! +X points" if bid matches
  - ❌ Red "Missed +0 points" if bid doesn't match

#### 4.2: Total Validation
- Show sum of tricks: "Total: X/Y tricks"
- ✓ Green checkmark if sum equals cards dealt
- ⚠️ Warning if sum doesn't equal cards dealt

#### 4.3: Calculate Scores Button
- Enabled when total tricks = cards dealt
- Large, prominent CTA

### Validation

```
SUM(all tricks) MUST EQUAL cardsDealt

If not equal:
  - Show error: "Total tricks must equal {cardsDealt}"
  - Disable Calculate button
```

### Interactions

| Action | Result |
|--------|--------|
| Click trick number | Select tricks for player, show score preview |
| Sum matches total | Enable Calculate button |
| Sum incorrect | Show error, disable button |
| Click Calculate | Compute scores → Navigate to Scoreboard |

### Animation

- Slide in score preview when trick selected
- Celebrate animation (confetti) if multiple players matched bids

---

## Screen 5: Scoreboard Screen

### Purpose
Display cumulative scores and round-by-round breakdown

### Layout

```
┌─────────────────────────────────┐
│  ← Menu          SCOREBOARD      │
├─────────────────────────────────┤
│                                 │
│  Round 3 of 13 Complete         │
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🏆 CURRENT LEADER           ││
│  │    Rahul - 35 points        ││
│  └─────────────────────────────┘│
│                                 │
│  Overall Standings              │
│  ┏━━━━━━━┳━━━━━┳━━━━━━━━━┓   │
│  ┃ Player┃Score┃ Accuracy┃   │
│  ┣━━━━━━━╋━━━━━╋━━━━━━━━━┫   │
│  ┃1. Rahul   35    2/3   ┃   │
│  ┃2. Priya   32    3/3   ┃   │
│  ┃3. Anjali  23    1/3   ┃   │
│  ┃4. Vikram  20    2/3   ┃   │
│  ┗━━━━━━━┻━━━━━┻━━━━━━━━━┛   │
│                                 │
│  ▼ View Round Details           │
│                                 │
│  ┌───────────────────────────┐ │
│  │   NEXT ROUND (4)          │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Elements

#### 5.1: Round Progress
- "Round X of Y Complete"
- Progress bar (optional)

#### 5.2: Leader Highlight Card
- Crown icon 🏆
- Current leader name and score
- Gradient background (gold)

#### 5.3: Standings Table
- Columns: Rank, Player, Score, Accuracy
- **Rank:** 1, 2, 3, 4...
- **Player:** Name
- **Score:** Cumulative total (bold)
- **Accuracy:** Successful bids / Total rounds (e.g., 2/3)
- Sorted by score (descending)

#### 5.4: Round Details (Collapsible)
- Expandable accordion
- Shows round-by-round:
  - Round number
  - Trump suit
  - Bid vs Actual for each player
  - Points earned

```
Round 1: ♠️ Spades (7 cards)
- Rahul: 3/3 ✅ +13
- Anjali: 2/3 ❌ +0
- Vikram: 1/1 ✅ +11
- Priya: 1/1 ✅ +11
```

#### 5.5: Next Round Button
- Only show if game not complete
- Navigate to next Bidding Screen

#### 5.6: View Results Button
- Only show if game complete
- Navigate to Final Results

### Interactions

| Action | Result |
|--------|--------|
| Click Next Round | Navigate to Bidding Screen (next round) |
| Click View Results | Navigate to Final Results (if game complete) |
| Expand Round Details | Show round breakdown table |
| Click Menu | Show menu: Resume, Quit, Settings |

---

## Screen 6: Final Results Screen

### Purpose
Celebrate winner and show final statistics

### Layout

```
┌─────────────────────────────────┐
│         GAME COMPLETE! 🎉       │
├─────────────────────────────────┤
│                                 │
│        🏆 WINNER 🏆             │
│                                 │
│          RAHUL                  │
│        158 POINTS               │
│                                 │
│  [Confetti Animation]           │
│                                 │
│  Final Standings                │
│  ┏━━━━━━━━━━━━┳━━━━━━━━━┓     │
│  ┃   Player   ┃  Score  ┃     │
│  ┣━━━━━━━━━━━━╋━━━━━━━━━┫     │
│  ┃ 🥇 Rahul   ┃   158   ┃     │
│  ┃ 🥈 Priya   ┃   142   ┃     │
│  ┃ 🥉 Vikram  ┃   128   ┃     │
│  ┃    Anjali  ┃   115   ┃     │
│  ┗━━━━━━━━━━━━┻━━━━━━━━━┛     │
│                                 │
│  Game Statistics                │
│  - Most accurate: Priya (11/13) │
│  - Highest round: Rahul (17 pts)│
│  - Zero bids won: Vikram (5)    │
│                                 │
│  ┌───────────────────────────┐ │
│  │   VIEW FULL SCOREBOARD    │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │   PLAY AGAIN              │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │   NEW GAME                │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Elements

#### 6.1: Winner Announcement
- Large trophy icon 🏆
- Winner name (huge, bold text)
- Final score
- Confetti/celebration animation

#### 6.2: Final Standings
- Medal icons for top 3 (🥇🥈🥉)
- All players ranked
- Final scores

#### 6.3: Game Statistics
- Most accurate predictor
- Highest single round score
- Most zero bids won
- Other interesting stats

#### 6.4: Action Buttons
1. **View Full Scoreboard:** See all rounds
2. **Play Again:** New game with same players/settings
3. **New Game:** Return to Game Setup

### Interactions

| Action | Result |
|--------|--------|
| Click View Scoreboard | Navigate to Scoreboard (read-only) |
| Click Play Again | Reset game, keep players → Navigate to Bidding R1 |
| Click New Game | Navigate to Game Setup |
| Auto-save | Save game to history on mount |

### Animations

- Confetti fall from top
- Trophy bounce/shine
- Medal reveal animation

---

## Navigation Patterns

### Header Navigation

```
┌─────────────────────────────────┐
│ ← Back    SCREEN NAME    ⋮ Menu │
└─────────────────────────────────┘
```

- **Back Button:** Previous screen (with confirm if changes)
- **Screen Title:** Current screen name
- **Menu Icon:** Overflow menu

### Menu (Hamburger/Kebab)

```
┌───────────────┐
│ Continue Game │
│ View Score    │
│ Quit Game     │
│ Rules         │
│ Settings      │
└───────────────┘
```

### Confirmation Dialogs

**Quit Game:**
```
┌─────────────────────────┐
│ Quit Current Game?      │
│                         │
│ Progress will be saved  │
│                         │
│  [Cancel]  [Quit]       │
└─────────────────────────┘
```

---

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Large touch targets (min 48px)
- Stacked navigation
- Full-width buttons

### Tablet (640px - 1024px)
- Two-column where applicable
- Side-by-side scoreboard
- Larger fonts

### Desktop (> 1024px)
- Centered max-width container (800px)
- Side panels for stats
- Hover states for buttons

---

## Loading States

### During Navigation
```
┌─────────────────────┐
│   [Spinner Icon]    │
│  Loading Round 4... │
└─────────────────────┘
```

### During Calculation
```
┌─────────────────────┐
│  Calculating...     │
│  ━━━━━━━━━━ 100%   │
└─────────────────────┘
```

---

## Error States

### Invalid Bid Entry
```
┌────────────────────────────┐
│ ⚠️ Invalid Bid             │
│ Total bids cannot equal    │
│ total tricks (5)           │
└────────────────────────────┘
```

### Trick Entry Mismatch
```
┌────────────────────────────┐
│ ⚠️ Total Mismatch          │
│ Tricks entered: 6          │
│ Should be: 5               │
└────────────────────────────┘
```

---

## Accessibility Features

- **Keyboard Navigation:** Tab through all interactive elements
- **ARIA Labels:** Screen reader friendly
- **Focus Indicators:** Visible focus states
- **Color Contrast:** WCAG AA compliant
- **Touch Targets:** Minimum 48x48px

---

## Micro-Interactions

| Element | Interaction | Effect |
|---------|-------------|--------|
| Bid Button | Tap | Scale up, color change |
| Confirm Button | Tap | Ripple effect |
| Score Update | New score | Count-up animation |
| Winner Reveal | Page load | Confetti burst |
| Leader Change | Score update | Pulse highlight |

---

## State Persistence

Each screen should:
1. **Save state** on navigation
2. **Restore state** on mount
3. **Handle browser back** button appropriately

**LocalStorage Key:**
```
kachuful_game_state_{gameId}
```

---

## Implementation Notes

- Use **React Router** for routing
- Implement **route guards** to prevent invalid navigation
- Add **transition animations** between screens
- Consider **skeleton loaders** for better perceived performance
- Implement **offline support** via PWA
