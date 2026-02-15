import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useHistoryStore } from '../../store/historyStore';
import { Spade, Heart, Diamond, Club, Play, History, Users, Settings, Sparkles, Crown } from 'lucide-react';
import type { ScoringVariant } from '../../types/game';

export default function GameSetup() {
    const navigate = useNavigate();
    const initGame = useGameStore(state => state.initGame);
    const historyCount = useHistoryStore(state => state.history.length);

    const [playerCount, setPlayerCount] = useState(4);
    const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
    const [scoringVariant, setScoringVariant] = useState<ScoringVariant>('10_plus_predicted');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [startingCards, setStartingCards] = useState(7);
    const [totalRounds, setTotalRounds] = useState(13);
    const [errors, setErrors] = useState<string[]>([]);

    const handlePlayerCountChange = (count: number) => {
        setPlayerCount(count);
        const newNames = Array(count).fill('').map((_, i) => playerNames[i] || '');
        setPlayerNames(newNames);
    };

    const handleNameChange = (index: number, name: string) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
        setErrors([]);
    };

    const validate = (): boolean => {
        const newErrors: string[] = [];
        if (playerNames.some(name => !name.trim())) {
            newErrors.push('All player names must be filled');
        }
        const uniqueNames = new Set(playerNames.map(n => n.trim().toLowerCase()));
        if (uniqueNames.size !== playerNames.length) {
            newErrors.push('Player names must be unique');
        }
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleStart = () => {
        if (!validate()) return;
        initGame(playerNames.map(n => n.trim()), {
            scoringVariant,
            startingCards,
            totalRounds,
        });
        navigate('/bidding');
    };

    const scoringOptions = [
        { id: '10_plus_predicted', name: 'Standard', desc: '10 + tricks', icon: '🎯' },
        { id: 'high_incentive', name: 'High Risk', desc: 'Big rewards', icon: '🔥' },
        { id: 'medium_incentive', name: 'Balanced', desc: '10 × tricks', icon: '⚖️' },
    ];

    return (
        <div className="min-h-screen flex flex-col p-4 safe-bottom">
            {/* Animated header */}
            <div className="text-center py-6 animate-fade-in">
                {/* Card suits animation */}
                <div className="flex justify-center gap-4 mb-4">
                    <Spade className="w-8 h-8 suit-spades animate-float" style={{ animationDelay: '0s' }} />
                    <Heart className="w-8 h-8 suit-hearts animate-float" style={{ animationDelay: '0.2s' }} />
                    <Diamond className="w-8 h-8 suit-diamonds animate-float" style={{ animationDelay: '0.4s' }} />
                    <Club className="w-8 h-8 suit-clubs animate-float" style={{ animationDelay: '0.6s' }} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gradient-primary mb-2">
                    KACHUFUL
                </h1>
                <p className="text-gray-400 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Card Game Scorer
                    <Sparkles className="w-4 h-4 text-purple-400" />
                </p>
            </div>

            {/* Main content */}
            <div className="flex-1 w-full max-w-5xl mx-auto space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 items-start">

                {/* Left Column: Player Management */}
                <div className="space-y-4">
                    {/* History Button - Floating style */}
                    {historyCount > 0 && (
                        <button
                            onClick={() => navigate('/history')}
                            className="w-full glass rounded-2xl p-4 flex items-center justify-between group animate-slide-up"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <History className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">Game History</div>
                                    <div className="text-sm text-gray-400">{historyCount} game{historyCount !== 1 ? 's' : ''} played</div>
                                </div>
                            </div>
                            <Crown className="w-5 h-5 text-yellow-400 group-hover:animate-wiggle" />
                        </button>
                    )}

                    {/* Player Count Selection */}
                    <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-purple-400" />
                            <h2 className="font-bold text-lg">Players</h2>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => (
                                <button
                                    key={count}
                                    onClick={() => handlePlayerCountChange(count)}
                                    className={`
                                        relative h-12 rounded-xl font-bold text-lg transition-all duration-300
                                        ${playerCount === count
                                            ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg glow-purple scale-105'
                                            : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:scale-102'}
                                    `}
                                >
                                    {count}
                                    {playerCount === count && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Player Names - Card style */}
                    <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-2xl">👥</span>
                            Enter Names
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {playerNames.map((name, index) => (
                                <div key={index} className="relative group">
                                    <div className={`
                                        absolute -inset-0.5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300
                                        bg-gradient-to-r from-purple-600 to-pink-600 blur
                                    `} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        placeholder={`Player ${index + 1}`}
                                        className="input-field w-full relative"
                                        autoFocus={index === 0}
                                    />
                                    {name && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Game Settings */}
                <div className="space-y-4">
                    {/* Scoring System - Toggle cards */}
                    <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-2xl">🎲</span>
                            Scoring Mode
                        </h2>

                        <div className="grid grid-cols-3 gap-2">
                            {scoringOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => setScoringVariant(option.id as ScoringVariant)}
                                    className={`
                                        relative p-3 rounded-xl text-center transition-all duration-300
                                        ${scoringVariant === option.id
                                            ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-500 scale-105'
                                            : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-600'}
                                    `}
                                >
                                    <div className="text-2xl mb-1">{option.icon}</div>
                                    <div className="font-semibold text-sm">{option.name}</div>
                                    <div className="text-xs text-gray-400">{option.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Settings - Collapsible */}
                    <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Settings className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
                                <span className="font-bold">Advanced</span>
                            </div>
                            <span className="text-gray-400">{showAdvanced ? '−' : '+'}</span>
                        </button>

                        {showAdvanced && (
                            <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-2 gap-4 animate-slide-up">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Starting Cards</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setStartingCards(Math.max(1, startingCards - 1))}
                                            className="btn-bid w-10 h-10 text-lg"
                                        >−</button>
                                        <span className="font-bold text-2xl w-10 text-center">{startingCards}</span>
                                        <button
                                            onClick={() => setStartingCards(Math.min(13, startingCards + 1))}
                                            className="btn-bid w-10 h-10 text-lg"
                                        >+</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Total Rounds</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setTotalRounds(Math.max(1, totalRounds - 1))}
                                            className="btn-bid w-10 h-10 text-lg"
                                        >−</button>
                                        <span className="font-bold text-2xl w-10 text-center">{totalRounds}</span>
                                        <button
                                            onClick={() => setTotalRounds(Math.min(20, totalRounds + 1))}
                                            className="btn-bid w-10 h-10 text-lg"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 animate-bounce-in">
                            {errors.map((error, i) => (
                                <div key={i} className="text-red-400 flex items-center gap-2 text-sm">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Start Button - Hero style */}
                    <button
                        onClick={handleStart}
                        className="btn-primary w-full py-5 text-xl font-black flex items-center justify-center gap-3 animate-slide-up"
                        style={{ animationDelay: '0.5s' }}
                    >
                        <Play className="w-7 h-7" fill="currentColor" />
                        START GAME
                    </button>

                    {/* Empty history hint */}
                    {historyCount === 0 && (
                        <p className="text-center text-gray-500 text-sm animate-fade-in">
                            Complete a game to see your history 📊
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
