import { Spade, Heart, Diamond, Club, Ban } from 'lucide-react';
import type { TrumpSuit } from '../../types/game';

interface SuitIconProps {
    suit: TrumpSuit;
    className?: string;
    fill?: boolean;
}

export default function SuitIcon({ suit, className = "w-6 h-6", fill = true }: SuitIconProps) {
    const commonProps = {
        className,
        fill: fill ? "currentColor" : "none"
    };

    switch (suit) {
        case 'spades':
            return <Spade {...commonProps} />;
        case 'hearts':
            return <Heart {...commonProps} />;
        case 'diamonds':
            return <Diamond {...commonProps} />;
        case 'clubs':
            return <Club {...commonProps} />;
        case 'none':
            return <Ban className={className} />;
        default:
            return null;
    }
}
