import { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subtext?: string;
    color?: 'default' | 'success' | 'warning' | 'error';
}

const colorClasses = {
    default: 'text-purple-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
};

export default function StatCard({ icon, label, value, subtext, color = 'default' }: StatCardProps) {
    return (
        <div className="card p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-200">
            <div className={`text-3xl mb-2 ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className={`text-2xl font-bold ${colorClasses[color]}`}>
                {value}
            </div>
            <div className="text-sm text-gray-400 mt-1">
                {label}
            </div>
            {subtext && (
                <div className="text-xs text-gray-500 mt-1">
                    {subtext}
                </div>
            )}
        </div>
    );
}
