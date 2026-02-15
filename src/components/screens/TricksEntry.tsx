import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { validateTricksTotal, calculateScore } from '../../lib/game-logic';
import type { PlayerResult } from '../../types/game';
import { ExitGameDialog } from '../ui/ExitGameDialog';
import { useHaptics } from '../../hooks/useHaptics';
import { LogOut, Check, ChevronRight } from 'lucide-react';
import TopAppBar from '../layout/TopAppBar';
import BottomActionBar from '../layout/BottomActionBar';

export default function TricksEntry() {
    const navigate = useNavigate();
    const game = useGameStore(state => state.game);
    const submitResults = useGameStore(state => state.submitResults);
    const { impactLight, impactMedium } = useHaptics();

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
        impactLight();
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

        impactMedium();
        submitResults(results);
        navigate('/scoreboard');
    };

    const totalTricks = Array.from(tricks.values()).reduce((sum, t) => sum + t, 0);
    const isValid = totalTricks === cardsDealt && tricks.size === game.players.length;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 page-enter">
            <TopAppBar
                title="Enter Tricks"
                subtitle={`Round ${game.currentRound} of ${game.settings.totalRounds}`}
                showBack={true}
                onBack={() => navigate('/bidding')}
                actions={
                    <button
                        onClick={() => setShowExitDialog(true)}
                        className="p-2 rounded-full hover:bg-white/10 text-red-400"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                }
            />

            <div className="pt-20 pb-28 px-4 max-w-md mx-auto">
                <div className="card animate-slide-up bg-gray-800/20 border-gray-700/50">
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        {game.players.map(player => {
                            const bid = currentRound.bids.find(b => b.playerId === player.id)!;
                            const tricksWon = tricks.get(player.id) || 0;
                            const matched = tricksWon === bid.predicted;
                            const score = calculateScore(bid.predicted, tricksWon, game.settings.scoringVariant);

                            return (
                                <div key={player.id} className="p-4 bg-gray-700/30 rounded-2xl border border-gray-700/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="font-bold text-lg">{player.name}</div>
                                            <div className="text-sm text-gray-400 flex items-center gap-1">
                                                Target: <span className="text-white font-mono bg-gray-600 px-1.5 rounded">{bid.predicted}</span>
                                            </div>
                                        </div>
                                        {tricks.has(player.id) && (
                                            <div className={`text-right ${matched ? 'text-green-400' : 'text-red-400'}`}>
                                                <div className="text-xs font-bold uppercase tracking-wider mb-0.5">
                                                    {matched ? 'MATCHED' : 'MISSED'}
                                                </div>
                                                <div className="font-black text-xl">
                                                    {score > 0 ? '+' : ''}{score}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({ length: cardsDealt + 1 }, (_, i) => i).map(num => (
                                            <button
                                                key={num}
                                                onClick={() => handleTrickChange(player.id, num)}
                                                className={`
                                                    h-10 rounded-lg font-bold text-lg transition-all duration-200
                                                    ${tricksWon === num
                                                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                                                `}
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
                    <div className={`
                        p-4 rounded-xl mb-2 transition-colors duration-300
                        ${totalTricks === cardsDealt
                            ? 'bg-green-500/10 border border-green-500/50'
                            : 'bg-gray-800/50 border border-gray-700'}
                    `}>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Total Tricks Taken</span>
                            <div className="flex items-center gap-2">
                                <span className={`font-mono font-bold text-xl ${totalTricks === cardsDealt ? 'text-green-400' : 'text-gray-200'}`}>
                                    {totalTricks} / {cardsDealt}
                                </span>
                                {totalTricks === cardsDealt && <Check className="w-5 h-5 text-green-400" />}
                            </div>
                        </div>
                        {totalTricks !== cardsDealt && (
                            <div className="text-xs text-red-400 mt-1 text-right">
                                Must equal {cardsDealt}
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl animate-bounce-in">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚠️</span>
                                <span className="text-red-400">{error}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Exit Game Dialog */}
                <ExitGameDialog
                    isOpen={showExitDialog}
                    onClose={() => setShowExitDialog(false)}
                />
            </div>

            <BottomActionBar>
                <button
                    onClick={calculateAndSubmit}
                    disabled={!isValid}
                    className={`
                        w-full py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-xl transition-all duration-300 rounded-2xl
                        ${isValid
                            ? 'btn-primary'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
                    `}
                >
                    <span>NEXT ROUND</span>
                    <ChevronRight className="w-6 h-6" />
                </button>
            </BottomActionBar>
        </div>
    );
}
