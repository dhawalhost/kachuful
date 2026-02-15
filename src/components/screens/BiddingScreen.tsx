import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { getSuitColorClass, validateBids, getBiddingOrder, getCardsDealt, getTrumpSuit } from '../../lib/game-logic';
import type { PlayerBid } from '../../types/game';
import { X, Check, ChevronRight, Crown, LogOut } from 'lucide-react';
import { ExitGameDialog } from '../ui/ExitGameDialog';
import { useHaptics } from '../../hooks/useHaptics';
import TopAppBar from '../layout/TopAppBar';
import BottomActionBar from '../layout/BottomActionBar';
import SuitIcon from '../ui/SuitIcon';

interface BidDialogProps {
    playerName: string;
    maxBid: number;
    invalidBids: number[];
    isDealer: boolean;
    onSelect: (bid: number) => void;
    onClose: () => void;
}

function BidDialog({ playerName, maxBid, invalidBids, isDealer, onSelect, onClose }: BidDialogProps) {
    const { impactLight } = useHaptics();
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="card w-full max-w-sm animate-bounce-in border-purple-500/30 bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        <h3 className="text-xl font-bold text-gradient-primary">{playerName}'s Bid</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Dealer warning */}
                {isDealer && invalidBids.length > 0 && (
                    <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/50 animate-pulse-glow" style={{ boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)' }}>
                        <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-semibold">Dealer Restriction</span>
                        </div>
                        <p className="text-sm text-yellow-200/80 mt-1">Cannot bid {invalidBids.join(' or ')}</p>
                    </div>
                )}

                {/* Bid buttons grid */}
                <div className="grid grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {Array.from({ length: maxBid + 1 }, (_, i) => i).map(num => {
                        const isInvalid = invalidBids.includes(num);
                        return (
                            <button
                                key={num}
                                onClick={() => {
                                    if (!isInvalid) {
                                        impactLight();
                                        onSelect(num);
                                    }
                                }}
                                disabled={isInvalid}
                                className={`
                                    relative h-14 rounded-xl font-bold text-xl transition-all duration-300
                                    ${isInvalid
                                        ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed opacity-30'
                                        : 'btn-bid hover:glow-purple'}
                                `}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function BiddingScreen() {
    const navigate = useNavigate();
    const game = useGameStore(state => state.game);
    const submitBids = useGameStore(state => state.submitBids);
    const { impactLight, impactMedium } = useHaptics();

    const [bids, setBids] = useState<Map<string, number>>(new Map());
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [biddingOrder, setBiddingOrder] = useState<number[]>([]);
    const [showExitDialog, setShowExitDialog] = useState(false);

    useEffect(() => {
        if (!game) {
            navigate('/');
            return;
        }

        const order = getBiddingOrder(game.dealerIndex, game.players.length);
        setBiddingOrder(order);

        // Pre-populate bids if round already has bids (editing scenario)
        const currentRound = game.rounds[game.currentRound - 1];
        if (currentRound && currentRound.bids.length > 0) {
            const existingBids = new Map<string, number>();
            currentRound.bids.forEach(bid => {
                existingBids.set(bid.playerId, bid.predicted);
            });
            setBids(existingBids);
        }
    }, [game, navigate]);

    if (!game) return null;

    // Calculate cards and trump for current round
    const cardsDealt = getCardsDealt(game.currentRound, game.settings);
    const trumpSuit = getTrumpSuit(game.currentRound);
    const dealer = game.players[game.dealerIndex];

    // Find the next player who needs to bid
    const getNextPlayerToBid = (): string | null => {
        for (const playerIndex of biddingOrder) {
            const player = game.players[playerIndex];
            if (!bids.has(player.id)) {
                return player.id;
            }
        }
        return null;
    };

    const nextPlayerToBid = getNextPlayerToBid();
    const allBidsComplete = bids.size === game.players.length;

    const getInvalidBidsForPlayer = (playerId: string): number[] => {
        const player = game.players.find(p => p.id === playerId);
        if (!player) return [];

        const playerIndex = game.players.findIndex(p => p.id === playerId);
        const isDealer = playerIndex === game.dealerIndex;

        if (!isDealer) return [];

        // Calculate sum of other bids
        let otherBidsSum = 0;
        bids.forEach((bid, id) => {
            if (id !== playerId) otherBidsSum += bid;
        });

        const invalidBids: number[] = [];
        for (let bid = 0; bid <= cardsDealt; bid++) {
            if (otherBidsSum + bid === cardsDealt) {
                invalidBids.push(bid);
            }
        }

        return invalidBids;
    };

    const handlePlayerClick = (playerId: string) => {
        impactLight();
        const hasBid = bids.has(playerId);
        const isNextToBid = playerId === nextPlayerToBid;

        if (isNextToBid || hasBid) {
            setSelectedPlayerId(playerId);
            setError('');
        }
    };

    const handleBidSelect = (bid: number) => {
        if (!selectedPlayerId) return;

        const newBids = new Map(bids);
        newBids.set(selectedPlayerId, bid);
        setBids(newBids);
        setSelectedPlayerId(null);
    };

    const handleSubmit = () => {
        const bidArray: PlayerBid[] = game.players.map(player => ({
            playerId: player.id,
            predicted: bids.get(player.id) || 0,
        }));

        const validation = validateBids(bidArray, cardsDealt, game.dealerIndex);

        if (!validation.valid) {
            setError(validation.error || 'Invalid bids');
            return;
        }

        impactMedium();
        submitBids(bidArray);
        navigate('/tricks');
    };

    const selectedPlayer = selectedPlayerId ? game.players.find(p => p.id === selectedPlayerId) : null;
    const selectedPlayerIndex = selectedPlayer ? game.players.findIndex(p => p.id === selectedPlayerId) : -1;
    const progress = (bids.size / game.players.length) * 100;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 page-enter">
            <TopAppBar
                title={`Round ${game.currentRound}`}
                subtitle={`of ${game.settings.totalRounds}`}
                actions={
                    <button
                        onClick={() => setShowExitDialog(true)}
                        className="p-2 rounded-full hover:bg-white/10 text-red-400"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                }
            />

            <div className="pt-20 pb-28 px-4 max-w-md mx-auto relative h-full flex flex-col">
                {/* Header - Round info */}
                <div className="text-center mb-6 animate-fade-in">
                    {/* Cards & Trump display */}
                    <div className="flex justify-center items-center gap-6 mb-2">
                        <div className="text-center card p-3 min-w-[80px]">
                            <div className="text-3xl font-black text-gradient-primary">{cardsDealt}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Cards</div>
                        </div>

                        <div className="text-center card p-3 min-w-[80px]">
                            <div className={`flex items-center justify-center h-9 ${getSuitColorClass(trumpSuit)} text-glow`}>
                                <SuitIcon suit={trumpSuit} className="w-8 h-8 md:w-9 md:h-9" />
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Trump</div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400 bg-gray-800/50 inline-block px-3 py-1 rounded-full">
                        <Crown className="w-3 h-3 inline text-yellow-400 mr-1" />
                        Dealer: <span className="text-purple-400 font-semibold">{dealer.name}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4 animate-slide-up">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">Bidding Progress</span>
                        <span className="font-bold text-purple-400">{bids.size}/{game.players.length}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Player List */}
                <div className="space-y-3 mb-6">
                    {biddingOrder.map((playerIndex, i) => {
                        const player = game.players[playerIndex];
                        const hasBid = bids.has(player.id);
                        const bid = bids.get(player.id);
                        const isNext = player.id === nextPlayerToBid;
                        const isDealer = playerIndex === game.dealerIndex;
                        const canClick = isNext || hasBid;

                        return (
                            <button
                                key={player.id}
                                onClick={() => handlePlayerClick(player.id)}
                                disabled={!canClick}
                                className={`
                                    w-full player-card flex items-center justify-between animate-slide-up
                                    ${isNext ? 'active animate-pulse-glow border-purple-500/50' : ''}
                                    ${hasBid ? 'opacity-90' : !canClick ? 'opacity-40' : ''}
                                `}
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Status indicator */}
                                    <div className={`
                                        w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors duration-300
                                        ${hasBid
                                            ? 'bg-green-500/20 border border-green-500/50'
                                            : isNext
                                                ? 'bg-purple-500/20 border border-purple-500/50'
                                                : 'bg-gray-700/50 border border-gray-600/50'}
                                    `}>
                                        {hasBid ? <Check className="w-5 h-5 text-green-400" />
                                            : isNext ? <span className="animate-pulse">👆</span>
                                                : <span className="text-gray-500">•</span>}
                                    </div>

                                    <div className="text-left">
                                        <div className={`font-semibold ${isNext ? 'text-purple-300' : ''}`}>
                                            {player.name}
                                        </div>
                                        {isDealer && (
                                            <div className="flex items-center gap-1 text-xs text-yellow-400">
                                                <Crown className="w-3 h-3" /> Dealer
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bid display or action hint */}
                                {hasBid ? (
                                    <div className="flex items-center gap-2">
                                        <span className="score-pill text-lg px-4">{bid}</span>
                                        <span className="text-xs text-gray-500">edit</span>
                                    </div>
                                ) : isNext ? (
                                    <div className="flex items-center gap-1 text-purple-400 text-sm font-medium">
                                        Tap <ChevronRight className="w-4 h-4" />
                                    </div>
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 animate-bounce-in">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">❌</span>
                            <span className="text-red-400">{error}</span>
                        </div>
                    </div>
                )}
            </div>

            <BottomActionBar>
                <button
                    onClick={handleSubmit}
                    disabled={!allBidsComplete}
                    className={`
                        w-full py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-xl transition-all duration-300 rounded-2xl
                        ${allBidsComplete
                            ? 'btn-primary'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
                    `}
                >
                    <Check className="w-6 h-6" />
                    {allBidsComplete ? 'CONFIRM BIDS' : 'Waiting for bids...'}
                </button>
            </BottomActionBar>

            {/* Bid Selection Dialog */}
            {selectedPlayer && (
                <BidDialog
                    playerName={selectedPlayer.name}
                    maxBid={cardsDealt}
                    invalidBids={getInvalidBidsForPlayer(selectedPlayerId!)}
                    isDealer={selectedPlayerIndex === game.dealerIndex}
                    onSelect={handleBidSelect}
                    onClose={() => setSelectedPlayerId(null)}
                />
            )}

            {/* Exit Game Dialog */}
            <ExitGameDialog
                isOpen={showExitDialog}
                onClose={() => setShowExitDialog(false)}
            />
        </div>
    );
}
