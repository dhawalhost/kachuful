import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../../store/historyStore';
import { History, Trash2, ArrowLeft, Trophy, Target } from 'lucide-react';

export default function GameHistory() {
    const navigate = useNavigate();
    const history = useHistoryStore(state => state.history);
    const clearHistory = useHistoryStore(state => state.clearHistory);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getScoringLabel = (variant: string) => {
        switch (variant) {
            case '10_plus_predicted': return 'Standard (10+P)';
            case 'high_incentive': return 'High Incentive';
            case 'medium_incentive': return 'Medium';
            case 'point_per_trick': return 'Per Trick';
            default: return variant;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            <History className="w-7 h-7 text-purple-400" />
                            Game History
                        </h1>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={() => {
                                if (confirm('Clear all game history?')) {
                                    clearHistory();
                                }
                            }}
                            className="btn-secondary text-sm flex items-center gap-2 text-red-400 hover:text-red-300"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {history.length === 0 && (
                    <div className="card text-center py-12">
                        <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Games Yet</h3>
                        <p className="text-gray-500 mb-4">
                            Complete a game to see it in your history
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary"
                        >
                            Start a Game
                        </button>
                    </div>
                )}

                {/* History List */}
                <div className="space-y-4">
                    {history.map((game, index) => (
                        <div
                            key={game.gameId}
                            className="card animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Game Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Trophy className="w-5 h-5 text-yellow-400" />
                                        <span className="font-bold text-lg text-yellow-400">
                                            {game.winner.name}
                                        </span>
                                        <span className="text-gray-400">won!</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {formatDate(game.completedAt)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-purple-400 font-bold text-xl">
                                        {game.winner.score} pts
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {game.totalRounds} rounds • {getScoringLabel(game.scoringVariant)}
                                    </div>
                                </div>
                            </div>

                            {/* Player Results */}
                            <div className="border-t border-gray-700 pt-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {game.players.map(player => (
                                        <div
                                            key={player.name}
                                            className={`p-2 rounded-lg text-sm ${player.rank === 1
                                                    ? 'bg-yellow-900/30 border border-yellow-700'
                                                    : 'bg-gray-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="text-gray-400">#{player.rank}</span>
                                                <span className="font-medium truncate">{player.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-purple-400 font-bold">
                                                    {player.finalScore}
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-500">
                                                    <Target className="w-3 h-3" />
                                                    {player.accuracy}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
