import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameHistoryEntry, GameState } from '../types/game';

interface HistoryStore {
    history: GameHistoryEntry[];

    // Actions
    addGame: (game: GameState) => void;
    clearHistory: () => void;
    getRecentGames: (count?: number) => GameHistoryEntry[];
}

export const useHistoryStore = create<HistoryStore>()(
    persist(
        (set, get) => ({
            history: [],

            addGame: (game: GameState) => {
                // Sort players by score (highest first)
                const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
                const winner = sortedPlayers[0];

                const historyEntry: GameHistoryEntry = {
                    gameId: game.gameId,
                    completedAt: new Date().toISOString(),
                    totalRounds: game.rounds.length,
                    scoringVariant: game.settings.scoringVariant,
                    winner: {
                        name: winner.name,
                        score: winner.totalScore,
                    },
                    players: sortedPlayers.map((player, index) => ({
                        name: player.name,
                        finalScore: player.totalScore,
                        accuracy: player.stats.roundsPlayed > 0
                            ? Math.round((player.stats.successfulBids / player.stats.roundsPlayed) * 100)
                            : 0,
                        rank: index + 1,
                    })),
                };

                set(state => ({
                    history: [historyEntry, ...state.history],
                }));
            },

            clearHistory: () => {
                set({ history: [] });
            },

            getRecentGames: (count = 10) => {
                return get().history.slice(0, count);
            },
        }),
        {
            name: 'kachuful-game-history',
        }
    )
);
