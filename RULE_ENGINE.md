# Kachuful Rule Engine Specification

> **Purpose:** Pure scoring logic and game rule validation  
> **Language Agnostic:** Can be implemented in any programming language  
> **Version:** 1.0

---

## Core Data Types

```typescript
enum ScoringVariant {
  STANDARD = "10_plus_predicted",      // 10 + predicted (default)
  HIGH_INCENTIVE = "high_incentive",   // ((predicted + 1) × 10) + predicted
  MEDIUM_INCENTIVE = "medium",         // 10 × predicted
  POINT_PER_TRICK = "point_per_trick"  // 1 per trick + 10 bonus
}

enum TrumpSuit {
  SPADES = "spades",
  DIAMONDS = "diamonds",
  CLUBS = "clubs",
  HEARTS = "hearts",
  NO_TRUMP = "none"
}

type PlayerBid = {
  playerId: string,
  predicted: number  // 0 to cardsDealt
}

type PlayerResult = {
  playerId: string,
  predicted: number,
  actual: number
}
```

---

## Rule 1: Score Calculation

### Function Signature
```typescript
calculateScore(
  predicted: number,
  actual: number,
  variant: ScoringVariant
): number
```

### Logic by Variant

#### STANDARD (10 + Predicted)
```
IF predicted == actual:
  RETURN 10 + predicted
ELSE:
  RETURN 0
```

**Examples:**
- Predicted: 0, Actual: 0 → Score: **10**
- Predicted: 3, Actual: 3 → Score: **13**
- Predicted: 7, Actual: 7 → Score: **17**
- Predicted: 5, Actual: 4 → Score: **0**
- Predicted: 2, Actual: 3 → Score: **0**

#### HIGH_INCENTIVE
```
IF predicted == actual:
  RETURN ((predicted + 1) × 10) + predicted
ELSE:
  RETURN -(ABS(predicted - actual))
```

**Examples:**
- Predicted: 0, Actual: 0 → Score: **10** `((0+1)×10) + 0`
- Predicted: 3, Actual: 3 → Score: **43** `((3+1)×10) + 3`
- Predicted: 5, Actual: 3 → Score: **-2**
- Predicted: 2, Actual: 5 → Score: **-3**

#### MEDIUM_INCENTIVE
```
IF predicted == actual:
  RETURN 10 × predicted
ELSE:
  RETURN 0
```

**Examples:**
- Predicted: 0, Actual: 0 → Score: **0**
- Predicted: 3, Actual: 3 → Score: **30**
- Predicted: 5, Actual: 4 → Score: **0**

#### POINT_PER_TRICK
```
score = actual  // 1 point per trick won
IF predicted == actual:
  score += 10  // bonus for correct prediction
RETURN score
```

**Examples:**
- Predicted: 0, Actual: 0 → Score: **10** (0 + 10 bonus)
- Predicted: 3, Actual: 3 → Score: **13** (3 + 10 bonus)
- Predicted: 5, Actual: 3 → Score: **3** (no bonus)
- Predicted: 2, Actual: 4 → Score: **4** (no bonus)

---

## Rule 2: Bid Validation

### Function Signature
```typescript
validateBids(
  bids: PlayerBid[],
  totalTricks: number,
  dealerIndex: number
): { valid: boolean, error?: string }
```

### Validation Rules

#### 2.1: All Players Must Bid
```
IF bids.length != totalPlayers:
  RETURN { valid: false, error: "All players must bid" }
```

#### 2.2: Bid Range Check
```
FOR EACH bid IN bids:
  IF bid.predicted < 0 OR bid.predicted > totalTricks:
    RETURN { valid: false, error: "Bid must be 0 to {totalTricks}" }
```

#### 2.3: Dealer Restriction Rule
```
dealerBid = bids[dealerIndex].predicted
sumOfBids = SUM(all bids)

IF sumOfBids == totalTricks:
  RETURN { 
    valid: false, 
    error: "Dealer cannot bid {dealerBid}. Total bids cannot equal total tricks ({totalTricks})" 
  }
```

**Why?** This prevents guaranteed success where all players could win exactly their bid.

#### 2.4: Valid Case
```
RETURN { valid: true }
```

### Examples

**Valid Scenarios:**
- Total Tricks: 7, Dealer Index: 3 (last player)
  - Bids: [2, 2, 1, 1] → Sum = 6 ≠ 7 ✅
  - Bids: [3, 2, 1, 2] → Sum = 8 ≠ 7 ✅

**Invalid Scenarios:**
- Total Tricks: 7, Dealer Index: 3
  - Bids: [2, 2, 2, 1] → Sum = 7 ❌ (Dealer cannot bid 1)
  - Bids: [3, 1, 2, 1] → Sum = 7 ❌ (Dealer cannot bid 1)

---

## Rule 3: Trump Suit Rotation

### Function Signature
```typescript
getTrumpSuit(roundNumber: number): TrumpSuit
```

### Logic
```
trumpCycle = [SPADES, DIAMONDS, CLUBS, HEARTS, NO_TRUMP]
index = (roundNumber - 1) % 5
RETURN trumpCycle[index]
```

### Rotation Pattern

| Round | Trump Suit |
|-------|-----------|
| 1, 6, 11, 16 | ♠️ Spades |
| 2, 7, 12, 17 | ♦️ Diamonds |
| 3, 8, 13, 18 | ♣️ Clubs |
| 4, 9, 14, 19 | ♥️ Hearts |
| 5, 10, 15, 20 | No Trump |

---

## Rule 4: Cards Dealt Per Round

### Function Signature
```typescript
getCardsDealt(
  roundNumber: number,
  startCards: number = 7,
  totalRounds: number = 13
): number
```

### Standard Pattern (Down then Up)

```
midPoint = CEIL(totalRounds / 2)

IF roundNumber <= midPoint:
  // Descending phase
  RETURN startCards - (roundNumber - 1)
ELSE:
  // Ascending phase
  roundsFromMid = roundNumber - midPoint
  RETURN 1 + roundsFromMid
```

### Example: 13 Rounds Starting at 7 Cards

| Round | Cards Dealt | Phase |
|-------|-------------|-------|
| 1 | 7 | Descending ⬇️ |
| 2 | 6 | Descending ⬇️ |
| 3 | 5 | Descending ⬇️ |
| 4 | 4 | Descending ⬇️ |
| 5 | 3 | Descending ⬇️ |
| 6 | 2 | Descending ⬇️ |
| 7 | 1 | Minimum ⬇️ |
| 8 | 2 | Ascending ⬆️ |
| 9 | 3 | Ascending ⬆️ |
| 10 | 4 | Ascending ⬆️ |
| 11 | 5 | Ascending ⬆️ |
| 12 | 6 | Ascending ⬆️ |
| 13 | 7 | Back to start ⬆️ |

### Alternative: Descending Only

```
RETURN startCards - (roundNumber - 1)
```

---

## Rule 5: Dealer Rotation

### Function Signature
```typescript
getDealerIndex(
  roundNumber: number,
  totalPlayers: number,
  startingDealerIndex: number = 0
): number
```

### Logic
```
RETURN (startingDealerIndex + (roundNumber - 1)) % totalPlayers
```

### Example: 4 Players

| Round | Dealer Index | Player |
|-------|--------------|--------|
| 1 | 0 | Player 1 |
| 2 | 1 | Player 2 |
| 3 | 2 | Player 3 |
| 4 | 3 | Player 4 |
| 5 | 0 | Player 1 |

---

## Rule 6: Bidding Order

### Function Signature
```typescript
getBiddingOrder(
  dealerIndex: number,
  totalPlayers: number
): number[]
```

### Logic
```
order = []
FOR i = 1 TO totalPlayers:
  playerIndex = (dealerIndex + i) % totalPlayers
  order.push(playerIndex)
RETURN order
```

### Example: 4 Players, Dealer = Player 2 (index 1)

```
Bidding Order: [2, 3, 0, 1]
```

Player 3 bids first, then 4, then 1, then 2 (dealer last)

---

## Rule 7: Trick Winner Determination

### Function Signature
```typescript
getTrickWinner(
  cardsPlayed: Card[],
  leadSuit: Suit,
  trumpSuit: TrumpSuit
): number  // index of winning player
```

### Logic

```
// Separate trump and non-trump cards
trumpCards = cardsPlayed.filter(c => c.suit == trumpSuit)

IF trumpCards.length > 0:
  // Highest trump wins
  highestTrump = MAX(trumpCards by rank)
  RETURN indexOf(highestTrump)
ELSE:
  // Highest card of lead suit wins
  leadSuitCards = cardsPlayed.filter(c => c.suit == leadSuit)
  highestLead = MAX(leadSuitCards by rank)
  RETURN indexOf(highestLead)
```

### Card Rank Order (Highest to Lowest)
```
A (Ace) > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3 > 2
```

---

## Rule 8: Game Completion

### Function Signature
```typescript
isGameComplete(
  currentRound: number,
  totalRounds: number
): boolean
```

### Logic
```
RETURN currentRound > totalRounds
```

---

## Rule 9: Winner Determination

### Function Signature
```typescript
getWinner(players: Player[]): Player
```

### Logic
```
RETURN player WITH MAX(totalScore)

// In case of tie:
IF multiple players have same max score:
  RETURN player with higher bid accuracy
  IF still tied:
    RETURN all tied players (co-winners)
```

---

## Edge Cases & Special Scenarios

### Edge Case 1: Zero Bid Success
```
Predicted: 0, Actual: 0
Score (STANDARD): 10 points ✅

This is a valid strategy - betting on winning no tricks.
```

### Edge Case 2: Maximum Bid
```
Cards Dealt: 7
Player bids: 7 (all tricks)
If successful: 10 + 7 = 17 points
```

### Edge Case 3: 2-Player Game
```
Total Tricks: 7
Player 1 bids: 4
Player 2 (dealer) cannot bid: 3 (since 4 + 3 = 7)
Player 2 valid bids: 0, 1, 2, 4, 5, 6, 7
```

### Edge Case 4: No Trump Round
```
Trump Suit: NO_TRUMP
Winner: Highest card of lead suit (no trump cards)
```

### Edge Case 5: Single Card Round
```
Cards Dealt: 1
Total Tricks: 1
Bids can be: 0 or 1
Dealer Restriction: If 3 players bid 0, dealer cannot bid 1
```

---

## Implementation Checklist

When implementing the rule engine, ensure:

- [ ] All scoring variants produce correct values
- [ ] Dealer restriction properly validates bids
- [ ] Trump rotation cycles correctly (5-suit pattern)
- [ ] Cards dealt follows down-up pattern
- [ ] Dealer rotates clockwise each round
- [ ] Zero bid awards 10 points (STANDARD variant)
- [ ] Negative scores only in HIGH_INCENTIVE variant
- [ ] Edge cases handled (0 bids, max bids, 2 players)

---

## Testing Matrix

### Score Calculation Tests

| Variant | Predicted | Actual | Expected Score |
|---------|-----------|--------|----------------|
| STANDARD | 0 | 0 | 10 |
| STANDARD | 3 | 3 | 13 |
| STANDARD | 5 | 4 | 0 |
| HIGH_INCENTIVE | 3 | 3 | 43 |
| HIGH_INCENTIVE | 3 | 1 | -2 |
| MEDIUM_INCENTIVE | 3 | 3 | 30 |
| MEDIUM_INCENTIVE | 0 | 0 | 0 |
| POINT_PER_TRICK | 3 | 3 | 13 |
| POINT_PER_TRICK | 3 | 5 | 5 |

### Bid Validation Tests

| Total Tricks | Dealer Index | Bids | Valid? | Reason |
|--------------|--------------|------|--------|--------|
| 7 | 3 | [2,2,2,1] | ❌ | Sum = 7 |
| 7 | 3 | [2,2,1,1] | ✅ | Sum = 6 |
| 5 | 1 | [1,2,2] | ❌ | Sum = 5 |
| 5 | 1 | [1,1,2] | ✅ | Sum = 4 |

---

## Reference Implementation (Pseudocode)

```python
class RuleEngine:
    def calculate_score(predicted, actual, variant):
        if variant == "10_plus_predicted":
            return 10 + predicted if predicted == actual else 0
        elif variant == "high_incentive":
            if predicted == actual:
                return ((predicted + 1) * 10) + predicted
            else:
                return -abs(predicted - actual)
        elif variant == "medium":
            return 10 * predicted if predicted == actual else 0
        elif variant == "point_per_trick":
            score = actual
            if predicted == actual:
                score += 10
            return score
    
    def validate_bids(bids, total_tricks, dealer_index):
        if sum(bids) == total_tricks:
            return False, "Total bids cannot equal total tricks"
        
        for bid in bids:
            if bid < 0 or bid > total_tricks:
                return False, f"Bid must be 0 to {total_tricks}"
        
        return True, None
    
    def get_trump_suit(round_number):
        cycle = ["spades", "diamonds", "clubs", "hearts", "none"]
        return cycle[(round_number - 1) % 5]
    
    def get_cards_dealt(round_number, start_cards=7, total_rounds=13):
        mid_point = (total_rounds + 1) // 2
        if round_number <= mid_point:
            return start_cards - (round_number - 1)
        else:
            return 1 + (round_number - mid_point)
```

---

## Notes

- This specification is **pure logic** - no UI, no state management
- All functions should be **pure** (no side effects)
- All functions should be **deterministic** (same input → same output)
- Implement comprehensive **unit tests** for all functions
- Use this as the **single source of truth** for game rules
