import React from 'react';
import { ShoppingCart, TrendingUp, Store, ListChecks } from 'lucide-react';
import { PurchaseStats } from '../types';

interface DashboardStatsProps {
  stats: PurchaseStats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMostVisitedStore = () => {
    const stores = Object.entries(stats.visitsByStore);
    if (stores.length === 0) return 'Ninguno';
    return stores.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Listas Activas
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.activeLists}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Gastado
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Store className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Supermercado Favorito
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {getMostVisitedStore()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ListChecks className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Compras Este Año
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.yearlyPurchases}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;