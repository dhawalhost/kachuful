import React from 'react';

interface BottomActionBarProps {
    children: React.ReactNode;
    className?: string;
}

export default function BottomActionBar({ children, className = '' }: BottomActionBarProps) {
    return (
        <div className={`
            fixed bottom-0 left-0 right-0 z-50
            safe-bottom
            bg-gray-900/90 backdrop-blur-xl border-t border-white/10
            p-4
            flex items-center gap-4
            shadow-[0_-4px_20px_rgba(0,0,0,0.4)]
            animate-slide-up
            ${className}
        `}>
            {children}
        </div>
    );
}
