import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useHistoryStore } from '../../store/historyStore';
import { Trophy, RotateCcw, Home, Target, TrendingUp, Zap, Award, Crown, Sparkles, Plus } from 'lucide-react';
import ScoreChart, { getPlayerColor } from '../charts/ScoreChart';

export default function FinalResults() {
    const navigate = useNavigate();
    const game = useGameStore(state => state.game);
    const resetGame = useGameStore(state => state.resetGame);
    const initGame = useGameStore(state => state.initGame);
    const continueGame = useGameStore(state => state.continueGame);
    const nextRound = useGameStore(state => state.nextRound);
    const addGameToHistory = useHistoryStore(state => state.addGame);

    // Track if we've already saved this game to history
    const savedToHistoryRef = useRef<string | null>(null);

    useEffect(() => {
        if (!game || game.status !== 'completed') {
            navigate('/');
            return;
        }

        // Save to history only once per game
        if (savedToHistoryRef.current !== game.gameId) {
            addGameToHistory(game);
            savedToHistoryRef.current = game.gameId;
        }
    }, [game, navigate, addGameToHistory]);

    if (!game) return null;

    const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
    const winner = sortedPlayers[0];

    // Prepare full game chart data
    const scoreChartData = game.rounds.map((_round, roundIndex) => {
        const dataPoint: { round: number;[playerName: string]: number | string } = { round: roundIndex + 1 };
        game.players.forEach(player => {
            let cumulativeScore = 0;
            for (let i = 0; i <= roundIndex; i++) {
                const score = game.rounds[i]?.scores?.find(s => s.playerId === player.id);
                if (score) cumulativeScore = score.cumulativeScore;
            }
            dataPoint[player.name] = cumulativeScore;
        });
        return dataPoint;
    });

    const playerData = game.players.map((player, index) => ({
        name: player.name,
        color: getPlayerColor(index),
    }));

    // Calculate game statistics
    const bestAccuracy = Math.max(...sortedPlayers.map(p =>
        p.stats.roundsPlayed > 0 ? (p.stats.successfulBids / p.stats.roundsPlayed) * 100 : 0
    ));
    const highestRoundScore = Math.max(...sortedPlayers.map(p => p.stats.maxRoundScore));
    const totalBids = sortedPlayers.reduce((sum, p) => sum + p.stats.roundsPlayed, 0);
    const totalSuccessfulBids = sortedPlayers.reduce((sum, p) => sum + p.stats.successfulBids, 0);

    const handlePlayAgain = () => {
        const playerNames = game.players.map(p => p.name);
        const settings = game.settings;
        resetGame();
        initGame(playerNames, settings);
        navigate('/bidding');
    };

    const handleNewGame = () => {
        resetGame();
        navigate('/');
    };

    const handleContinue = () => {
        continueGame(5);
        nextRound();
        navigate('/bidding');
    };

    return (
        <div className="min-h-screen p-4 safe-bottom">
            <div className="max-w-lg mx-auto">
                {/* Winner Announcement - Premium celebration */}
                <div className="text-center mb-6 animate-bounce-in">
                    {/* Celebration particles */}
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full bg-yellow-400/10 animate-pulse" />
                        </div>
                        <div className="relative">
                            <Trophy className="w-20 h-20 mx-auto text-yellow-400 drop-shadow-lg animate-float" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Champion</span>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>

                    <h1 className="text-4xl font-black text-gradient-gold mb-2 animate-pulse-glow"
                        style={{ textShadow: '0 0 30px rgba(245, 158, 11, 0.5)' }}>
                        {winner.name}
                    </h1>

                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">{winner.totalScore}</span>
                        <span className="text-sm text-yellow-400/80">points</span>
                    </div>
                </div>

                {/* Stats Grid - Premium cards */}
                <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up">
                    <div className="glass rounded-2xl p-4 text-center">
                        <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
                        <div className="text-2xl font-bold text-gradient-primary">{Math.round(bestAccuracy)}%</div>
                        <div className="text-xs text-gray-400">Best Accuracy</div>
                    </div>
                    <div className="glass rounded-2xl p-4 text-center">
                        <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                        <div className="text-2xl font-bold text-gradient-gold">{highestRoundScore}</div>
                        <div className="text-xs text-gray-400">Top Round</div>
                    </div>
                    <div className="glass rounded-2xl p-4 text-center">
                        <Award className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                        <div className="text-2xl font-bold">{totalSuccessfulBids}/{totalBids}</div>
                        <div className="text-xs text-gray-400">Predictions Hit</div>
                    </div>
                    <div className="glass rounded-2xl p-4 text-center">
                        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                        <div className="text-2xl font-bold">{game.settings.totalRounds}</div>
                        <div className="text-xs text-gray-400">Rounds Played</div>
                    </div>
                </div>

                {/* Score Progression Chart */}
                {scoreChartData.length > 1 && (
                    <div className="mb-6 animate-fade-in">
                        <ScoreChart
                            data={scoreChartData}
                            players={playerData}
                            title="📈 Score Progression"
                        />
                    </div>
                )}

                {/* Final Standings - Premium ranking cards */}
                <div className="mb-6 animate-slide-up">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        Final Rankings
                    </h2>

                    <div className="space-y-2">
                        {sortedPlayers.map((player, index) => {
                            const accuracy = player.stats.roundsPlayed > 0
                                ? Math.round((player.stats.successfulBids / player.stats.roundsPlayed) * 100)
                                : 0;

                            return (
                                <div
                                    key={player.id}
                                    className={`
                                        player-card flex items-center gap-3 animate-slide-up
                                        ${index === 0 ? 'winner' : ''}
                                    `}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Rank badge */}
                                    <div className={`
                                        rank-badge
                                        ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}
                                    `}>
                                        {index + 1}
                                    </div>

                                    {/* Color indicator */}
                                    <div
                                        className="w-1 h-10 rounded-full"
                                        style={{ backgroundColor: getPlayerColor(game.players.findIndex(p => p.id === player.id)) }}
                                    />

                                    {/* Player info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold truncate">{player.name}</div>
                                        <div className="text-xs text-gray-400">
                                            {player.stats.successfulBids}/{player.stats.roundsPlayed} correct • {accuracy}%
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <div className="text-2xl font-black">{player.totalScore}</div>
                                        <div className="text-xs text-gray-500">pts</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons - Premium style */}
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    {/* Continue playing - Hero button */}
                    <button
                        onClick={handleContinue}
                        className="btn-primary w-full py-5 text-lg font-black flex items-center justify-center gap-3"
                    >
                        <Plus className="w-6 h-6" />
                        Continue (+5 Rounds)
                    </button>

                    {/* Secondary actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handlePlayAgain}
                            className="btn-secondary py-4 flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span>Rematch</span>
                        </button>
                        <button
                            onClick={handleNewGame}
                            className="btn-secondary py-4 flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>New Game</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
