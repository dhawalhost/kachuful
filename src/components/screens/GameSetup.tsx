import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useHistoryStore } from '../../store/historyStore';
import { Play, History, Users, Settings } from 'lucide-react';
import type { ScoringVariant, RoundPattern } from '../../types/game';
import { useHaptics } from '../../hooks/useHaptics';
import TopAppBar from '../layout/TopAppBar';
import BottomActionBar from '../layout/BottomActionBar';

export default function GameSetup() {
    const navigate = useNavigate();
    const initGame = useGameStore(state => state.initGame);
    const historyCount = useHistoryStore(state => state.history.length);
    const { impactLight, impactMedium } = useHaptics();

    const [playerCount, setPlayerCount] = useState(4);
    const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
    const [scoringVariant, setScoringVariant] = useState<ScoringVariant>('10_plus_predicted');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [startingCards, setStartingCards] = useState(7);
    const [totalRounds, setTotalRounds] = useState(13);
    const [roundPattern, setRoundPattern] = useState<RoundPattern>('down_up');
    const [errors, setErrors] = useState<string[]>([]);

    const handlePlayerCountChange = (count: number) => {
        impactLight();
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
        if (!validate()) {
            // Optional: error haptic
            return;
        }
        impactMedium();
        initGame(playerNames.map(n => n.trim()), {
            scoringVariant,
            startingCards,
            totalRounds,
            roundPattern,
        });
        navigate('/bidding');
    };

    const scoringOptions = [
        { id: '10_plus_predicted', name: 'Standard', desc: '10 + tricks', icon: '🎯' },
        { id: 'high_incentive', name: 'High Risk', desc: 'Big rewards', icon: '🔥' },
        { id: 'medium_incentive', name: 'Balanced', desc: '10 × tricks', icon: '⚖️' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 page-enter">
            <TopAppBar
                title={
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Kachuful" className="w-8 h-8 rounded-lg shadow-lg" />
                        <span className="font-black tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            KACHUFUL
                        </span>
                    </div>
                }
                actions={
                    historyCount > 0 && (
                        <button
                            onClick={() => navigate('/history')}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <History className="w-5 h-5" />
                        </button>
                    )
                }
            />

            {/* Main content - with padding for top bar and bottom bar */}
            <div className="pt-20 pb-28 px-4 max-w-5xl mx-auto space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 items-start">

                {/* Left Column: Player Management */}
                <div className="space-y-6">
                    {/* Player Count Selection */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-2 mb-3 px-1">
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
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="font-bold text-lg mb-3 px-1 flex items-center gap-2">
                            <span className="text-xl">👥</span>
                            Enter Names
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                        className="input-field w-full relative bg-gray-800/50 border-gray-700 focus:bg-gray-800"
                                        autoComplete="off"
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
                <div className="space-y-6">
                    {/* Scoring System */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <h2 className="font-bold text-lg mb-3 px-1 flex items-center gap-2">
                            <span className="text-xl">🎲</span>
                            Scoring Mode
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {scoringOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        impactLight();
                                        setScoringVariant(option.id as ScoringVariant);
                                    }}
                                    className={`
                                        relative p-3 rounded-xl text-left md:text-center transition-all duration-300 flex md:block items-center gap-3 md:gap-0
                                        ${scoringVariant === option.id
                                            ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-500'
                                            : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-600'}
                                    `}
                                >
                                    <div className="text-2xl mb-0 md:mb-1">{option.icon}</div>
                                    <div>
                                        <div className="font-semibold text-sm">{option.name}</div>
                                        <div className="text-xs text-gray-400">{option.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="card animate-slide-up bg-gray-800/20 border-gray-700/50" style={{ animationDelay: '0.4s' }}>
                        <button
                            onClick={() => {
                                impactLight();
                                setShowAdvanced(!showAdvanced);
                            }}
                            className="w-full flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Settings className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
                                <span className="font-bold">Advanced Settings</span>
                            </div>
                            <span className="text-gray-400">{showAdvanced ? '−' : '+'}</span>
                        </button>

                        {showAdvanced && (
                            <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4 animate-slide-up">
                                {/* Round Pattern Selector */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Game Flow</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                impactLight();
                                                setRoundPattern('down_up');
                                                setTotalRounds(startingCards * 2 - 1);
                                            }}
                                            className={`
                                                p-2 rounded-lg text-sm font-medium transition-colors
                                                ${roundPattern === 'down_up'
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                                            `}
                                        >
                                            Standard (↘️↗️)
                                        </button>
                                        <button
                                            onClick={() => {
                                                impactLight();
                                                setRoundPattern('down_only');
                                                setTotalRounds(startingCards);
                                            }}
                                            className={`
                                                p-2 rounded-lg text-sm font-medium transition-colors
                                                ${roundPattern === 'down_only'
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                                            `}
                                        >
                                            Quick (↘️)
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Starting Cards</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    impactLight();
                                                    const newStart = Math.max(1, startingCards - 1);
                                                    setStartingCards(newStart);
                                                    if (roundPattern === 'down_up') {
                                                        setTotalRounds(newStart * 2 - 1);
                                                    } else {
                                                        setTotalRounds(newStart);
                                                    }
                                                }}
                                                className="btn-bid w-10 h-10 text-lg"
                                            >−</button>
                                            <span className="font-bold text-2xl w-10 text-center">{startingCards}</span>
                                            <button
                                                onClick={() => {
                                                    impactLight();
                                                    const newStart = Math.min(13, startingCards + 1);
                                                    setStartingCards(newStart);
                                                    if (roundPattern === 'down_up') {
                                                        setTotalRounds(newStart * 2 - 1);
                                                    } else {
                                                        setTotalRounds(newStart);
                                                    }
                                                }}
                                                className="btn-bid w-10 h-10 text-lg"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Total Rounds</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    impactLight();
                                                    setTotalRounds(Math.max(1, totalRounds - 1));
                                                }}
                                                className="btn-bid w-10 h-10 text-lg"
                                            >−</button>
                                            <span className="font-bold text-2xl w-10 text-center">{totalRounds}</span>
                                            <button
                                                onClick={() => {
                                                    impactLight();
                                                    setTotalRounds(Math.min(25, totalRounds + 1));
                                                }}
                                                className="btn-bid w-10 h-10 text-lg"
                                            >+</button>
                                        </div>
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
                </div>
            </div>

            <BottomActionBar>
                <button
                    onClick={handleStart}
                    className="btn-primary w-full py-4 text-xl font-bold flex items-center justify-center gap-3 shadow-xl"
                >
                    <Play className="w-6 h-6" fill="currentColor" />
                    START GAME
                </button>
            </BottomActionBar>
        </div>
    );
}
