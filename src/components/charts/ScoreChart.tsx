import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface PlayerData {
    name: string;
    color: string;
}

interface ScoreDataPoint {
    round: number;
    [playerName: string]: number | string;
}

interface ScoreChartProps {
    data: ScoreDataPoint[];
    players: PlayerData[];
    title?: string;
}

const PLAYER_COLORS = [
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#10B981', // emerald
    '#EC4899', // pink
    '#3B82F6', // blue
    '#EF4444', // red
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#6366F1', // indigo
];

export function getPlayerColor(index: number): string {
    return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export default function ScoreChart({ data, players, title = 'Score Progression' }: ScoreChartProps) {
    if (data.length === 0) {
        return (
            <div className="card p-6 text-center text-gray-400">
                <p>No round data available yet</p>
            </div>
        );
    }

    return (
        <div className="card p-3 md:p-4">
            <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">{title}</h3>
            <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="round"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            tickFormatter={(value) => `R${value}`}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB',
                            }}
                            labelFormatter={(label) => `Round ${label}`}
                        />
                        <Legend
                            wrapperStyle={{ color: '#F9FAFB' }}
                            iconType="circle"
                        />
                        {players.map((player, index) => (
                            <Line
                                key={player.name}
                                type="monotone"
                                dataKey={player.name}
                                stroke={player.color || getPlayerColor(index)}
                                strokeWidth={2}
                                dot={{ fill: player.color || getPlayerColor(index), strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
