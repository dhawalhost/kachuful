import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHaptics } from '../../hooks/useHaptics';

interface TopAppBarProps {
    title: React.ReactNode;
    subtitle?: string; // Optional subtitle
    showBack?: boolean;
    onBack?: () => void;
    actions?: React.ReactNode;
    className?: string; // Allow custom classes
}

export default function TopAppBar({
    title,
    subtitle,
    showBack = false,
    onBack,
    actions,
    className = ''
}: TopAppBarProps) {
    const navigate = useNavigate();
    const { impactLight } = useHaptics();

    const handleBack = () => {
        impactLight();
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className={`
            fixed top-0 left-0 right-0 z-50
            h-16 safe-top
            flex items-center justify-between px-4
            bg-gray-900/80 backdrop-blur-md border-b border-white/5
            text-gray-100
            transition-all duration-300
            ${className}
        `}>
            {/* Left Section: Back Button & Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                <div className="flex flex-col overflow-hidden">
                    <h1 className="text-lg font-bold truncate leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <span className="text-xs text-gray-400 truncate">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>

            {/* Right Section: Actions */}
            {actions && (
                <div className="flex items-center gap-2 pl-4">
                    {actions}
                </div>
            )}
        </header>
    );
}
