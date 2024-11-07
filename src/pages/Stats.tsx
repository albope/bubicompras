import React, { useState } from 'react';
import { useStats } from '../hooks/useStats';
import StatsCards from '../components/stats/StatsCards';
import MonthlyChart from '../components/stats/MonthlyChart';
import { ChevronDown } from 'lucide-react';

const Stats = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { loading, error, monthlyData, totalSpent, totalPurchases, averagePerPurchase, availableYears } = useStats(selectedYear);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estadísticas</h1>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      <StatsCards
        totalSpent={totalSpent}
        totalPurchases={totalPurchases}
        averagePerPurchase={averagePerPurchase}
        selectedYear={selectedYear}
      />

      <MonthlyChart data={monthlyData} />
    </div>
  );
};

export default Stats;