import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Target, TrendingUp, Zap } from 'lucide-react';
import ScoreChart, { getPlayerColor } from '../charts/ScoreChart';
import RoundPerformanceChart from '../charts/RoundPerformanceChart';
import StatCard from '../ui/StatCard';
import { ExitGameDialog, ExitGameButton } from '../ui/ExitGameDialog';

export default function Scoreboard() {
    const navigate = useNavigate();
    const game = useGameStore(state => state.game);
    const nextRound = useGameStore(state => state.nextRound);
    const getLeader = useGameStore(state => state.getLeader);

    const [showExitDialog, setShowExitDialog] = useState(false);

    useEffect(() => {
        if (!game) {
            navigate('/');
        }
    }, [game, navigate]);

    if (!game) return null;

    const leader = getLeader();
    const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
    const currentRoundData = game.rounds[game.currentRound - 1];

    // Prepare chart data - cumulative scores per round
    const scoreChartData = game.rounds.map((_round, roundIndex) => {
        const dataPoint: { round: number;[playerName: string]: number | string } = { round: roundIndex + 1 };
        game.players.forEach(player => {
            // Calculate cumulative score up to this round
            let cumulativeScore = 0;
            for (let i = 0; i <= roundIndex; i++) {
                const score = game.rounds[i]?.scores?.find(s => s.playerId === player.id);
                if (score) cumulativeScore = score.cumulativeScore;
            }
            dataPoint[player.name] = cumulativeScore;
        });
        return dataPoint;
    });

    // Prepare performance chart data for current round
    const performanceData = currentRoundData?.results?.map(result => {
        const player = game.players.find(p => p.id === result.playerId);
        return {
            name: player?.name || 'Unknown',
            predicted: result.predicted,
            actual: result.actual,
            matched: result.matched,
        };
    }) || [];

    // Calculate round statistics
    const roundStats = {
        totalTricks: currentRoundData?.results?.reduce((sum, r) => sum + r.actual, 0) || 0,
        successfulPredictions: currentRoundData?.results?.filter(r => r.matched).length || 0,
        totalPlayers: game.players.length,
        highestRoundScore: Math.max(...(currentRoundData?.scores?.map(s => s.roundScore) || [0])),
    };

    const handleNext = () => {
        // Check if this is the final round BEFORE incrementing
        const isFinalRound = game.currentRound >= game.settings.totalRounds;

        if (isFinalRound) {
            // Mark game as complete and go to final results
            nextRound(); // This will set status to 'completed'
            navigate('/results');
        } else {
            nextRound();
            navigate('/bidding');
        }
    };

    const playerData = game.players.map((player, index) => ({
        name: player.name,
        color: getPlayerColor(index),
    }));

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Exit button - top right */}
                <div className="flex justify-end mb-2">
                    <ExitGameButton onPress={() => setShowExitDialog(true)} />
                </div>

                {/* Header */}
                <div className="text-center mb-4 md:mb-6 animate-fade-in">
                    <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
                        Round {game.currentRound} of {game.settings.totalRounds} Complete
                    </h2>
                    <div className="h-1.5 md:h-2 bg-gray-700 rounded-full max-w-md mx-auto overflow-hidden">
                        <div
                            className="h-full bg-gradient-primary transition-all duration-500"
                            style={{ width: `${(game.currentRound / game.settings.totalRounds) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Leader Card */}
                {leader && (
                    <div className="bg-gradient-gold rounded-xl p-3 md:p-4 mb-4 md:mb-6 text-center animate-bounce-in shadow-2xl">
                        <div className="flex items-center justify-center gap-2 mb-0.5 md:mb-1">
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-900" />
                            <h3 className="text-lg md:text-xl font-bold text-yellow-900">CURRENT LEADER</h3>
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-900" />
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-yellow-950">{leader.name}</div>
                        <div className="text-lg md:text-xl text-yellow-900">{leader.totalScore} points</div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6 animate-slide-up">
                    <StatCard
                        icon={<Target className="w-6 h-6" />}
                        label="Predictions Hit"
                        value={`${roundStats.successfulPredictions}/${roundStats.totalPlayers}`}
                        color={roundStats.successfulPredictions > roundStats.totalPlayers / 2 ? 'success' : 'default'}
                    />
                    <StatCard
                        icon={<Zap className="w-6 h-6" />}
                        label="Top Round Score"
                        value={roundStats.highestRoundScore}
                        color="warning"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        label="Total Tricks"
                        value={roundStats.totalTricks}
                        color="default"
                    />
                    <StatCard
                        icon={<Trophy className="w-6 h-6" />}
                        label="Rounds Played"
                        value={`${game.currentRound}/${game.settings.totalRounds}`}
                        color="default"
                    />
                </div>

                {/* Charts Section - Stack on mobile, Side-by-side on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-6">
                    {/* Score Progression Chart */}
                    {scoreChartData.length > 0 && (
                        <div className="h-full">
                            <ScoreChart
                                data={scoreChartData}
                                players={playerData}
                                title="📈 Score Progression"
                            />
                        </div>
                    )}

                    {/* Round Performance Chart */}
                    {performanceData.length > 0 && (
                        <div className="h-full">
                            <RoundPerformanceChart
                                data={performanceData}
                                title="🎯 Round Performance"
                            />
                        </div>
                    )}
                </div>

                {/* Standings Table */}
                <div className="card animate-slide-up mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">📊 Overall Standings</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700 text-xs md:text-sm">
                                    <th className="text-left p-1.5 md:p-2">Rank</th>
                                    <th className="text-left p-1.5 md:p-2">Player</th>
                                    <th className="text-right p-1.5 md:p-2 hidden sm:table-cell">This Round</th>
                                    <th className="text-right p-1.5 md:p-2">Total</th>
                                    <th className="text-right p-1.5 md:p-2 hidden sm:table-cell">Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPlayers.map((player, index) => {
                                    const roundScore = currentRoundData?.scores?.find(
                                        s => s.playerId === player.id
                                    )?.roundScore || 0;
                                    const roundResult = currentRoundData?.results?.find(
                                        r => r.playerId === player.id
                                    );

                                    return (
                                        <tr
                                            key={player.id}
                                            className={`border-b border-gray-800 ${player.id === leader?.id ? 'bg-yellow-900/20' : ''
                                                }`}
                                        >
                                            <td className="p-1.5 md:p-2">
                                                <span className="font-bold text-sm md:text-base">
                                                    {index === 0 && '🥇 '}
                                                    {index === 1 && '🥈 '}
                                                    {index === 2 && '🥉 '}
                                                    {index > 2 && `${index + 1}. `}
                                                </span>
                                            </td>
                                            <td className="p-1.5 md:p-2">
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <div
                                                        className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: getPlayerColor(game.players.findIndex(p => p.id === player.id)) }}
                                                    />
                                                    <span className={`font-semibold text-sm md:text-base truncate ${player.id === leader?.id ? 'text-yellow-400' : ''
                                                        }`}>
                                                        {player.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-right p-1.5 md:p-2 hidden sm:table-cell">
                                                <span className={`font-semibold ${roundResult?.matched ? 'text-emerald-400' : 'text-red-400'
                                                    }`}>
                                                    {roundScore > 0 ? '+' : ''}{roundScore}
                                                </span>
                                            </td>
                                            <td className="text-right p-1.5 md:p-2">
                                                <span className="font-bold text-base md:text-lg">{player.totalScore}</span>
                                            </td>
                                            <td className="text-right p-1.5 md:p-2 hidden sm:table-cell">
                                                <span className="text-gray-400 text-xs md:text-sm">
                                                    {player.stats.successfulBids}/{player.stats.roundsPlayed}
                                                    <span className="text-xs ml-1">
                                                        ({player.stats.roundsPlayed > 0
                                                            ? Math.round((player.stats.successfulBids / player.stats.roundsPlayed) * 100)
                                                            : 0}%)
                                                    </span>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Next Round Button */}
                <button
                    onClick={handleNext}
                    className="btn-primary w-full max-w-md mx-auto block text-lg py-4"
                >
                    {game.currentRound >= game.settings.totalRounds
                        ? '🏆 VIEW FINAL RESULTS'
                        : `▶️ NEXT ROUND (${game.currentRound + 1})`}
                </button>

                {/* Exit Game Dialog */}
                <ExitGameDialog
                    isOpen={showExitDialog}
                    onClose={() => setShowExitDialog(false)}
                />
            </div>
        </div>
    );
}
