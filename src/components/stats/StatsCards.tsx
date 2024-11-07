import React from 'react';
import { ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';

interface StatsCardsProps {
  totalSpent: number;
  totalPurchases: number;
  averagePerPurchase: number;
  selectedYear: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalSpent,
  totalPurchases,
  averagePerPurchase,
  selectedYear
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const isCurrentYear = selectedYear === new Date().getFullYear();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isCurrentYear ? 'Total Gastado' : `Total Gastado ${selectedYear}`}
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ShoppingCart className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isCurrentYear ? 'Total Compras' : `Compras ${selectedYear}`}
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPurchases}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CreditCard className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isCurrentYear ? 'Media por Compra' : `Media por Compra ${selectedYear}`}
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(averagePerPurchase)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;