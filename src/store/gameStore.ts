import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    GameState,
    Player,
    PlayerBid,
    PlayerResult,
    Round,
    GameSettings,
    PlayerStats,
    PlayerScore,
} from '../types/game';
import {
    generateUUID,
    getDefaultSettings,
    calculateScore,
    getTrumpSuit,
    getCardsDealt,
    getDealerIndex,
} from '../lib/game-logic';

interface GameStore {
    game: GameState | null;

    // Actions
    initGame: (playerNames: string[], settings?: Partial<GameSettings>) => void;
    submitBids: (bids: PlayerBid[]) => void;
    submitResults: (results: PlayerResult[]) => void;
    nextRound: () => void;
    endGame: () => void;
    resetGame: () => void;
    continueGame: (additionalRounds: number) => void;

    // Selectors
    getCurrentRound: () => Round | undefined;
    getLeader: () => Player | undefined;
    isComplete: () => boolean;
}

const createInitialPlayerStats = (): PlayerStats => ({
    roundsPlayed: 0,
    successfulBids: 0,
    failedBids: 0,
    totalTricksWon: 0,
    zeroBidsWon: 0,
    maxRoundScore: 0,
    averageScore: 0,
});

const updatePlayerStats = (
    stats: PlayerStats,
    result: PlayerResult,
    roundScore: number
): PlayerStats => {
    const newStats = { ...stats };
    newStats.roundsPlayed += 1;

    if (result.matched) {
        newStats.successfulBids += 1;
        if (result.predicted === 0) {
            newStats.zeroBidsWon += 1;
        }
    } else {
        newStats.failedBids += 1;
    }

    newStats.totalTricksWon += result.actual;
    newStats.maxRoundScore = Math.max(newStats.maxRoundScore, roundScore);
    newStats.averageScore =
        (newStats.averageScore * (newStats.roundsPlayed - 1) + roundScore) / newStats.roundsPlayed;

    return newStats;
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            game: null,

            initGame: (playerNames: string[], settings?: Partial<GameSettings>) => {
                const finalSettings: GameSettings = {
                    ...getDefaultSettings(),
                    ...settings,
                };

                const players: Player[] = playerNames.map((name, index) => ({
                    id: generateUUID(),
                    name,
                    position: index,
                    totalScore: 0,
                    stats: createInitialPlayerStats(),
                }));

                const newGame: GameState = {
                    gameId: generateUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    status: 'in_progress',
                    settings: finalSettings,
                    players,
                    currentRound: 1,
                    dealerIndex: 0,
                    rounds: [],
                };

                set({ game: newGame });
            },

            submitBids: (bids: PlayerBid[]) => {
                const { game } = get();
                if (!game) return;

                const cardsDealt = getCardsDealt(game.currentRound, game.settings);
                const trumpSuit = getTrumpSuit(game.currentRound);

                const newRound: Round = {
                    number: game.currentRound,
                    status: 'playing',
                    cardsDealt,
                    trumpSuit,
                    dealerIndex: game.dealerIndex,
                    bids,
                    results: [],
                    scores: [],
                };

                const updatedRounds = [...game.rounds];
                const roundIndex = game.currentRound - 1;

                if (roundIndex < updatedRounds.length) {
                    updatedRounds[roundIndex] = newRound;
                } else {
                    updatedRounds.push(newRound);
                }

                set({
                    game: {
                        ...game,
                        rounds: updatedRounds,
                        updatedAt: new Date().toISOString(),
                    },
                });
            },

            submitResults: (results: PlayerResult[]) => {
                const { game } = get();
                if (!game) return;

                const roundIndex = game.currentRound - 1;
                const round = game.rounds[roundIndex];
                if (!round) return;

                // Calculate scores
                const scores: PlayerScore[] = results.map(result => {
                    const player = game.players.find(p => p.id === result.playerId)!;
                    const roundScore = calculateScore(
                        result.predicted,
                        result.actual,
                        game.settings.scoringVariant
                    );
                    const cumulativeScore = player.totalScore + roundScore;

                    return {
                        playerId: result.playerId,
                        roundScore,
                        cumulativeScore,
                    };
                });

                // Update round
                round.results = results;
                round.scores = scores;
                round.status = 'completed';

                // Update players
                const updatedPlayers = game.players.map(player => {
                    const score = scores.find(s => s.playerId === player.id)!;
                    const result = results.find(r => r.playerId === player.id)!;

                    return {
                        ...player,
                        totalScore: score.cumulativeScore,
                        stats: updatePlayerStats(player.stats, result, score.roundScore),
                    };
                });

                const updatedRounds = [...game.rounds];
                updatedRounds[roundIndex] = round;

                set({
                    game: {
                        ...game,
                        players: updatedPlayers,
                        rounds: updatedRounds,
                        updatedAt: new Date().toISOString(),
                    },
                });
            },

            nextRound: () => {
                const { game } = get();
                if (!game) return;

                const nextRoundNumber = game.currentRound + 1;
                const nextDealerIndex = (game.dealerIndex + 1) % game.players.length;
                const isComplete = nextRoundNumber > game.settings.totalRounds;

                set({
                    game: {
                        ...game,
                        currentRound: nextRoundNumber,
                        dealerIndex: nextDealerIndex,
                        status: isComplete ? 'completed' : 'in_progress',
                        updatedAt: new Date().toISOString(),
                    },
                });
            },

            endGame: () => {
                const { game } = get();
                if (!game) return;

                set({
                    game: {
                        ...game,
                        status: 'completed',
                        updatedAt: new Date().toISOString(),
                    },
                });
            },

            continueGame: (additionalRounds: number) => {
                const { game } = get();
                if (!game) return;

                set({
                    game: {
                        ...game,
                        settings: {
                            ...game.settings,
                            totalRounds: game.settings.totalRounds + additionalRounds,
                        },
                        status: 'in_progress',
                        updatedAt: new Date().toISOString(),
                    },
                });
            },

            resetGame: () => {
                set({ game: null });
            },

            getCurrentRound: () => {
                const { game } = get();
                if (!game) return undefined;
                return game.rounds[game.currentRound - 1];
            },

            getLeader: () => {
                const { game } = get();
                if (!game || game.players.length === 0) return undefined;

                return game.players.reduce((leader, player) =>
                    player.totalScore > leader.totalScore ? player : leader
                );
            },

            isComplete: () => {
                const { game } = get();
                return game?.status === 'completed';
            },
        }),
        {
            name: 'kachuful-game-state',
        }
    )
);
