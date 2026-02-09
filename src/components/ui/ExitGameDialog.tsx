import { X, LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useHistoryStore } from '../../store/historyStore';

interface ExitGameDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExitGameDialog({ isOpen, onClose }: ExitGameDialogProps) {
    const navigate = useNavigate();
    const { game, endGame } = useGameStore();
    const { addGame } = useHistoryStore();

    if (!isOpen) return null;

    const handleExit = () => {
        if (!game) {
            navigate('/');
            return;
        }

        // If game has completed rounds, save to history and show results
        if (game.rounds.length > 0) {
            // Mark game as completed
            endGame();
            addGame({ ...game, status: 'completed' });

            // Navigate to final results to show scores
            navigate('/results');
        } else {
            // No rounds played, just go home (resetGame will happen on setup)
            navigate('/');
        }
    };

    const hasProgress = game && game.rounds.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="card w-full max-w-sm animate-bounce-in border-orange-500/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                        <h3 className="text-xl font-bold text-white">End Game Early?</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Message */}
                <p className="text-gray-300 mb-6">
                    {hasProgress
                        ? "The game will end with current scores and be saved to history."
                        : "No rounds have been played yet. Exit without saving?"}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExit}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        {hasProgress ? 'End Game' : 'Exit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ExitGameButtonProps {
    onPress: () => void;
    className?: string;
}

export function ExitGameButton({ onPress, className = '' }: ExitGameButtonProps) {
    return (
        <button
            onClick={onPress}
            className={`p-2 rounded-xl bg-gray-800/50 hover:bg-red-600/30 border border-gray-700 hover:border-red-500/50 transition-all group ${className}`}
            title="Exit Game"
        >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
        </button>
    );
}
