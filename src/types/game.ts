// ============================================
// Enums & Types
// ============================================

export type GameStatus = "setup" | "in_progress" | "completed";

export type ScoringVariant =
    | "10_plus_predicted"      // Standard: 10 + predicted if match
    | "high_incentive"         // ((predicted + 1) × 10) + predicted
    | "medium_incentive"       // 10 × predicted
    | "point_per_trick";       // 1 per trick + 10 bonus

export type TrumpSuit = "spades" | "diamonds" | "clubs" | "hearts" | "none";

export type RoundStatus = "pending" | "bidding" | "playing" | "completed";

export type RoundPattern = "down_up" | "down_only";
export type TrumpPattern = "rotating" | "fixed" | "random";

// ============================================
// Game Settings
// ============================================

export interface GameSettings {
    scoringVariant: ScoringVariant;
    startingCards: number;       // Default: 7
    totalRounds: number;         // Default: 13
    roundPattern: RoundPattern;  // "down_up" | "down_only"
    trumpPattern: TrumpPattern;  // "rotating" | "fixed" | "random"
    dealerRestriction: boolean;  // Default: true
}

// ============================================
// Player
// ============================================

export interface Player {
    id: string;                  // UUID
    name: string;                // Display name
    position: number;            // Seating order (0-indexed)
    totalScore: number;          // Cumulative score across all rounds
    stats: PlayerStats;
}

export interface PlayerStats {
    roundsPlayed: number;
    successfulBids: number;      // Correct predictions
    failedBids: number;          // Incorrect predictions
    totalTricksWon: number;
    zeroBidsWon: number;         // Times predicted 0 and succeeded
    maxRoundScore: number;       // Highest single round score
    averageScore: number;        // Average per round
}

// ============================================
// Round
// ============================================

export interface Round {
    number: number;              // 1-indexed
    status: RoundStatus;
    cardsDealt: number;
    trumpSuit: TrumpSuit;
    dealerIndex: number;         // Who dealt this round

    // Bidding phase
    bids: PlayerBid[];

    // Playing phase
    results: PlayerResult[];

    // Computed
    scores: PlayerScore[];
}

export interface PlayerBid {
    playerId: string;
    predicted: number;           // 0 to cardsDealt
    timestamp?: string;          // When bid was made
}

export interface PlayerResult {
    playerId: string;
    predicted: number;           // Their bid
    actual: number;              // Tricks actually won
    matched: boolean;            // predicted === actual
}

export interface PlayerScore {
    playerId: string;
    roundScore: number;          // Points earned this round
    cumulativeScore: number;     // Total score up to this round
}

// ============================================
// Game State
// ============================================

export interface GameState {
    // Metadata
    gameId: string;              // UUID
    createdAt: string;           // ISO 8601 timestamp
    updatedAt: string;           // ISO 8601 timestamp
    status: GameStatus;          // "setup" | "in_progress" | "completed"

    // Configuration
    settings: GameSettings;

    // Players
    players: Player[];

    // Game Progress
    currentRound: number;        // 1-indexed
    dealerIndex: number;         // Current dealer (0-indexed player array)

    // Rounds
    rounds: Round[];             // History of all rounds

    // Statistics (computed)
    stats?: GameStatistics;
}

// ============================================
// Game Statistics
// ============================================

export interface GameStatistics {
    totalRoundsPlayed: number;
    currentLeader: string;       // Player ID
    mostAccuratePlayer: string;  // Player ID (highest bid success rate)
    highestRoundScore: {
        playerId: string;
        round: number;
        score: number;
    };

    // Distribution
    bidAccuracyRate: number;     // Overall % of successful bids
    averageScorePerRound: number;
}

// ============================================
// Validation Result
// ============================================

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

// ============================================
// Game History (for storing completed games)
// ============================================

export interface GameHistoryEntry {
    gameId: string;
    completedAt: string;         // ISO 8601 timestamp
    totalRounds: number;
    scoringVariant: ScoringVariant;
    winner: {
        name: string;
        score: number;
    };
    players: {
        name: string;
        finalScore: number;
        accuracy: number;        // % of successful bids
        rank: number;            // 1 = winner, 2 = second, etc.
    }[];
}
