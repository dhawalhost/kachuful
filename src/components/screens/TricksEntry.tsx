import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { validateTricksTotal, calculateScore } from '../../lib/game-logic';
import type { PlayerResult } from '../../types/game';
import { ExitGameDialog, ExitGameButton } from '../ui/ExitGameDialog';

export default function TricksEntry() {
    const navigate = useNavigate();
    const game = useGameStore(state => state.game);
    const submitResults = useGameStore(state => state.submitResults);

    const [tricks, setTricks] = useState<Map<string, number>>(new Map());
    const [error, setError] = useState('');
    const [showExitDialog, setShowExitDialog] = useState(false);

    useEffect(() => {
        if (!game) {
            navigate('/');
        }
    }, [game, navigate]);

    if (!game) return null;

    const currentRound = game.rounds[game.currentRound - 1];
    if (!currentRound || currentRound.bids.length === 0) {
        navigate('/bidding');
        return null;
    }

    const cardsDealt = currentRound.cardsDealt;

    const handleTrickChange = (playerId: string, tricksWon: number) => {
        setError('');
        const newTricks = new Map(tricks);
        newTricks.set(playerId, tricksWon);
        setTricks(newTricks);
    };

    const calculateAndSubmit = () => {
        // Validate total
        const tricksArray = game.players.map(p => tricks.get(p.id) || 0);
        const validation = validateTricksTotal(tricksArray, cardsDealt);

        if (!validation.valid) {
            setError(validation.error || 'Invalid tricks total');
            return;
        }

        // Create results
        const results: PlayerResult[] = game.players.map(player => {
            const bid = currentRound.bids.find(b => b.playerId === player.id)!;
            const actual = tricks.get(player.id) || 0;

            return {
                playerId: player.id,
                predicted: bid.predicted,
                actual,
                matched: bid.predicted === actual,
            };
        });

        submitResults(results);
        navigate('/scoreboard');
    };

    const totalTricks = Array.from(tricks.values()).reduce((sum, t) => sum + t, 0);
    const isValid = totalTricks === cardsDealt && tricks.size === game.players.length;

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Exit button - top right */}
                <div className="flex justify-end mb-2">
                    <ExitGameButton onPress={() => setShowExitDialog(true)} />
                </div>

                <div className="text-center mb-4 md:mb-8 animate-fade-in">
                    <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
                        Enter Tricks Won
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">Round {game.currentRound} of {game.settings.totalRounds}</p>
                </div>

                <div className="card animate-slide-up">
                    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                        {game.players.map(player => {
                            const bid = currentRound.bids.find(b => b.playerId === player.id)!;
                            const tricksWon = tricks.get(player.id) || 0;
                            const matched = tricksWon === bid.predicted;
                            const score = calculateScore(bid.predicted, tricksWon, game.settings.scoringVariant);

                            return (
                                <div key={player.id} className="p-4 bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="font-semibold text-lg">{player.name}</div>
                                            <div className="text-sm text-gray-400">Bid: {bid.predicted}</div>
                                        </div>
                                        {tricks.has(player.id) && (
                                            <div className={`text-right ${matched ? 'text-green-400' : 'text-red-400'}`}>
                                                {matched ? '✅ Matched!' : '❌ Missed'}
                                                <div className="font-bold text-lg">
                                                    {score > 0 ? '+' : ''}{score} points
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-6 md:grid-cols-8 gap-1 md:gap-2">
                                        {Array.from({ length: cardsDealt + 1 }, (_, i) => i).map(num => (
                                            <button
                                                key={num}
                                                onClick={() => handleTrickChange(player.id, num)}
                                                className={`btn-bid ${tricksWon === num ? 'selected' : ''}`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Validation */}
                    <div className={`p-4 rounded-lg mb-6 ${totalTricks === cardsDealt
                        ? 'bg-green-900/30 border border-green-500'
                        : 'bg-gray-700/30 border border-gray-600'
                        }`}>
                        <div className="flex items-center justify-between">
                            <span>Total Tricks:</span>
                            <span className="font-bold text-xl">
                                {totalTricks} / {cardsDealt}
                                {totalTricks === cardsDealt && ' ✓'}
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚠️</span>
                                <span className="text-red-400">{error}</span>
                            </div>
                        </div>
                    )}


                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/bidding')}
                            className="btn-secondary flex-1"
                        >
                            ← EDIT BIDS
                        </button>
                        <button
                            onClick={calculateAndSubmit}
                            disabled={!isValid}
                            className="btn-primary flex-1"
                        >
                            CALCULATE SCORES →
                        </button>
                    </div>
                </div>

                {/* Exit Game Dialog */}
                <ExitGameDialog
                    isOpen={showExitDialog}
                    onClose={() => setShowExitDialog(false)}
                />
            </div>
        </div>
    );
}
