import { useState } from 'react';
import { Plus, X, ChevronsUp, ChevronsDown } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

interface ContinueDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (rounds: number, cards: number, pattern: 'down_up' | 'down_only') => void;
    initialCards: number;
    initialRounds?: number;
}

export default function ContinueDialog({ isOpen, onClose, onConfirm, initialCards }: ContinueDialogProps) {
    const { impactLight, impactMedium } = useHaptics();
    const [cards, setCards] = useState(initialCards);
    const [pattern, setPattern] = useState<'down_up' | 'down_only'>('down_up');

    if (!isOpen) return null;

    const calculatedRounds = pattern === 'down_only' ? cards : (cards * 2) - 1;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="card w-full max-w-sm animate-bounce-in border-purple-500/30 bg-gray-900">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔄</span>
                        <h3 className="text-xl font-bold text-gradient-primary">Continue Game</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Pattern Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                impactLight();
                                setPattern('down_up');
                            }}
                            className={`
                                p-3 rounded-xl border flex flex-col items-center gap-2 transition-all
                                ${pattern === 'down_up'
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-500'}
                            `}
                        >
                            <ChevronsUp className="w-6 h-6" />
                            <span className="text-sm font-bold">Standard</span>
                            <span className="text-[10px] opacity-70">Up & Down</span>
                        </button>
                        <button
                            onClick={() => {
                                impactLight();
                                setPattern('down_only');
                            }}
                            className={`
                                p-3 rounded-xl border flex flex-col items-center gap-2 transition-all
                                ${pattern === 'down_only'
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-500'}
                            `}
                        >
                            <ChevronsDown className="w-6 h-6" />
                            <span className="text-sm font-bold">Quick</span>
                            <span className="text-[10px] opacity-70">Down Only</span>
                        </button>
                    </div>

                    {/* Cards Input */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wide">Starting Cards</label>
                        <div className="flex items-center gap-4 bg-gray-800/50 p-2 rounded-xl border border-gray-700">
                            <button
                                onClick={() => {
                                    impactLight();
                                    setCards(Math.max(1, cards - 1));
                                }}
                                className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all text-xl font-bold"
                            >
                                -
                            </button>
                            <div className="flex-1 text-center">
                                <div className="text-2xl font-black text-white">{cards}</div>
                            </div>
                            <button
                                onClick={() => {
                                    impactLight();
                                    setCards(Math.min(13, cards + 1));
                                }}
                                className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all text-xl font-bold"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Will generate <span className="text-purple-400 font-bold">{calculatedRounds}</span> additional rounds based on pattern.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            impactMedium();
                            onConfirm(calculatedRounds, cards, pattern);
                        }}
                        className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add {calculatedRounds} Rounds
                    </button>
                </div>
            </div>
        </div>
    );
}
