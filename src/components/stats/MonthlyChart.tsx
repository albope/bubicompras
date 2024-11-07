import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyStats } from '../../hooks/useStats';
import { useTheme } from '../../contexts/ThemeContext';

interface MonthlyChartProps {
  data: MonthlyStats[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {payload[0].payload.count} compras
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Gastos Mensuales</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#e5e7eb'}
            />
            <XAxis
              dataKey="month"
              tick={{ 
                fontSize: 12,
                fill: isDark ? '#9ca3af' : '#4b5563'
              }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke={isDark ? '#4b5563' : '#9ca3af'}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ 
                fontSize: 12,
                fill: isDark ? '#9ca3af' : '#4b5563'
              }}
              stroke={isDark ? '#4b5563' : '#9ca3af'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total" 
              fill={isDark ? '#60a5fa' : '#3b82f6'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;