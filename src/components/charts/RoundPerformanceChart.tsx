import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface RoundPerformanceData {
    name: string;
    predicted: number;
    actual: number;
    matched: boolean;
}

interface RoundPerformanceChartProps {
    data: RoundPerformanceData[];
    title?: string;
}

export default function RoundPerformanceChart({
    data,
    title = 'Round Performance'
}: RoundPerformanceChartProps) {
    if (data.length === 0) {
        return (
            <div className="card p-6 text-center text-gray-400">
                <p>No performance data available</p>
            </div>
        );
    }

    return (
        <div className="card p-3 md:p-4">
            <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">{title}</h3>
            <div className="h-40 md:h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="name"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            allowDecimals={false}
                            width={25}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB',
                            }}
                            formatter={(value: number, name: string) => [
                                value,
                                name === 'predicted' ? 'Predicted' : 'Actual'
                            ]}
                        />
                        <Legend
                            wrapperStyle={{ color: '#F9FAFB' }}
                            formatter={(value) => value === 'predicted' ? 'Predicted' : 'Actual'}
                        />
                        <Bar dataKey="predicted" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.matched ? '#10B981' : '#EF4444'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
