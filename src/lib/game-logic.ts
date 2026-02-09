import type {
    ScoringVariant,
    TrumpSuit,
    PlayerBid,
    ValidationResult,
    GameSettings,
} from '../types/game';

// ============================================
// Rule 1: Score Calculation
// ============================================

export function calculateScore(
    predicted: number,
    actual: number,
    variant: ScoringVariant = '10_plus_predicted'
): number {
    switch (variant) {
        case '10_plus_predicted':
            return predicted === actual ? 10 + predicted : 0;

        case 'high_incentive':
            if (predicted === actual) {
                return ((predicted + 1) * 10) + predicted;
            } else {
                return -Math.abs(predicted - actual);
            }

        case 'medium_incentive':
            return predicted === actual ? 10 * predicted : 0;

        case 'point_per_trick':
            let score = actual;
            if (predicted === actual) {
                score += 10;
            }
            return score;

        default:
            return predicted === actual ? 10 + predicted : 0;
    }
}

// ============================================
// Rule 2: Bid Validation
// ============================================

export function validateBids(
    bids: PlayerBid[],
    totalTricks: number,
    dealerIndex: number
): ValidationResult {
    // Check all players have bid
    if (bids.length === 0) {
        return { valid: false, error: 'No bids submitted' };
    }

    // Check bid range
    for (const bid of bids) {
        if (bid.predicted < 0 || bid.predicted > totalTricks) {
            return {
                valid: false,
                error: `Bid must be between 0 and ${totalTricks}`
            };
        }
    }

    // Dealer restriction rule
    const sumOfBids = bids.reduce((sum, bid) => sum + bid.predicted, 0);

    if (sumOfBids === totalTricks) {
        const dealerBid = bids[dealerIndex].predicted;
        return {
            valid: false,
            error: `Dealer cannot bid ${dealerBid}. Total bids cannot equal total tricks (${totalTricks})`
        };
    }

    return { valid: true };
}

// ============================================
// Rule 3: Trump Suit Rotation
// ============================================

export function getTrumpSuit(roundNumber: number): TrumpSuit {
    const trumpCycle: TrumpSuit[] = ['spades', 'diamonds', 'clubs', 'hearts', 'none'];
    const index = (roundNumber - 1) % 5;
    return trumpCycle[index];
}

// ============================================
// Rule 4: Cards Dealt Per Round
// ============================================

export function getCardsDealt(
    roundNumber: number,
    settings: GameSettings
): number {
    const { startingCards, totalRounds, roundPattern } = settings;

    if (roundPattern === 'down_only') {
        return Math.max(1, startingCards - (roundNumber - 1));
    }

    // down_up pattern
    const midPoint = Math.ceil(totalRounds / 2);

    if (roundNumber <= midPoint) {
        // Descending phase
        return startingCards - (roundNumber - 1);
    } else {
        // Ascending phase
        const roundsFromMid = roundNumber - midPoint;
        return 1 + roundsFromMid;
    }
}

// ============================================
// Rule 5: Dealer Rotation
// ============================================

export function getDealerIndex(
    roundNumber: number,
    totalPlayers: number,
    startingDealerIndex: number = 0
): number {
    return (startingDealerIndex + (roundNumber - 1)) % totalPlayers;
}

// ============================================
// Rule 6: Bidding Order
// ============================================

export function getBiddingOrder(
    dealerIndex: number,
    totalPlayers: number
): number[] {
    const order: number[] = [];
    for (let i = 1; i <= totalPlayers; i++) {
        const playerIndex = (dealerIndex + i) % totalPlayers;
        order.push(playerIndex);
    }
    return order;
}

// ============================================
// Rule 8: Game Completion
// ============================================

export function isGameComplete(
    currentRound: number,
    totalRounds: number
): boolean {
    return currentRound > totalRounds;
}

// ============================================
// Helper: Generate UUID
// ============================================

export function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ============================================
// Helper: Get Default Settings
// ============================================

export function getDefaultSettings(): GameSettings {
    return {
        scoringVariant: '10_plus_predicted',
        startingCards: 7,
        totalRounds: 13,
        roundPattern: 'down_up',
        trumpPattern: 'rotating',
        dealerRestriction: true,
    };
}

// ============================================
// Helper: Validate Tricks Total
// ============================================

export function validateTricksTotal(
    tricks: number[],
    expectedTotal: number
): ValidationResult {
    const sum = tricks.reduce((a, b) => a + b, 0);

    if (sum !== expectedTotal) {
        return {
            valid: false,
            error: `Total tricks (${sum}) must equal cards dealt (${expectedTotal})`
        };
    }

    return { valid: true };
}

// ============================================
// Helper: Get Suit Symbol
// ============================================

export function getSuitSymbol(suit: TrumpSuit): string {
    switch (suit) {
        case 'spades':
            return '♠️';
        case 'hearts':
            return '♥️';
        case 'diamonds':
            return '♦️';
        case 'clubs':
            return '♣️';
        case 'none':
            return '🚫';
        default:
            return '';
    }
}

// ============================================
// Helper: Get Suit Color Class
// ============================================

export function getSuitColorClass(suit: TrumpSuit): string {
    switch (suit) {
        case 'spades':
        case 'clubs':
            return 'suit-spades';
        case 'hearts':
        case 'diamonds':
            return 'suit-hearts';
        case 'none':
            return 'text-gray-400';
        default:
            return '';
    }
}
