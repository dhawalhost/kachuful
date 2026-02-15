import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
    return (
        <div className={`
            min-h-screen bg-gray-950 text-gray-100
            grid grid-rows-[auto_1fr_auto] // Header - Content - Footer
            ${className}
        `}>
            {children}
        </div>
    );
}
