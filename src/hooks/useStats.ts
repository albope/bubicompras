import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { format, parse, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export interface MonthlyStats {
  month: string;
  total: number;
  count: number;
}

export const useStats = (selectedYear: number = new Date().getFullYear()) => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [activeLists, setActiveLists] = useState(0);
  const [totalLists, setTotalLists] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const listsRef = collection(db, 'lists');
        const q = query(
          listsRef,
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const monthlyStats: { [key: string]: MonthlyStats } = {};
        const years = new Set<number>();
        let activeCount = 0;

        // Initialize all months for selected year
        for (let i = 0; i < 12; i++) {
          const monthDate = new Date(selectedYear, i, 1);
          const monthKey = format(monthDate, 'MMMM', { locale: es });
          monthlyStats[monthKey] = {
            month: monthKey,
            total: 0,
            count: 0
          };
        }

        // Populate data and collect years
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Count active lists
          if (data.active) {
            activeCount++;
          }

          if (data.shoppingDate && data.totalCost !== undefined && data.totalCost !== null) {
            // Parse the shopping date
            const shoppingDate = parse(data.shoppingDate, 'yyyy-MM-dd', new Date());
            
            if (isValid(shoppingDate)) {
              years.add(shoppingDate.getFullYear());

              if (shoppingDate.getFullYear() === selectedYear) {
                const monthKey = format(shoppingDate, 'MMMM', { locale: es });
                if (monthlyStats[monthKey]) {
                  monthlyStats[monthKey].total += data.totalCost;
                  monthlyStats[monthKey].count += 1;
                }
              }
            }
          }
        });

        // Update counts
        setActiveLists(activeCount);
        setTotalLists(querySnapshot.size);

        // Convert to array and sort by month
        const monthOrder = Array.from({ length: 12 }, (_, i) => 
          format(new Date(selectedYear, i, 1), 'MMMM', { locale: es })
        );
        
        const sortedData = Object.values(monthlyStats)
          .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        setMonthlyData(sortedData);
        
        // Update available years
        const yearArray = Array.from(years).sort((a, b) => b - a);
        if (!yearArray.includes(new Date().getFullYear())) {
          yearArray.unshift(new Date().getFullYear());
        }
        setAvailableYears(yearArray);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, selectedYear]);

  // Calculate totals
  const totalSpent = monthlyData.reduce((acc, month) => acc + month.total, 0);
  const totalPurchases = monthlyData.reduce((acc, month) => acc + month.count, 0);
  const averagePerPurchase = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

  // Get current month's data
  const currentMonth = format(new Date(), 'MMMM', { locale: es });
  const currentMonthData = monthlyData.find(data => data.month === currentMonth);

  return {
    loading,
    error,
    monthlyData,
    totalSpent,
    totalPurchases,
    averagePerPurchase,
    availableYears,
    currentMonthSpending: currentMonthData?.total || 0,
    currentMonthPurchases: currentMonthData?.count || 0,
    activeLists,
    totalLists
  };
};