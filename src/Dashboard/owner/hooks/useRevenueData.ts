import { useState, useEffect } from 'react';

interface RevenueData {
  label: string;
  value: number;
}

export const useRevenueData = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('week');

  useEffect(() => {
    // Simulate API call based on period
    setLoading(true);
    
    setTimeout(() => {
      let data: RevenueData[] = [];
      
      switch (period) {
        case 'today':
          data = [
            { label: '6AM', value: 2500 },
            { label: '9AM', value: 4200 },
            { label: '12PM', value: 18500 },
            { label: '3PM', value: 9200 },
            { label: '6PM', value: 32400 },
            { label: '9PM', value: 28700 },
            { label: '12AM', value: 8500 }
          ];
          break;
        case 'week':
          data = [
            { label: 'Mon', value: 125400 },
            { label: 'Tue', value: 118700 },
            { label: 'Wed', value: 142300 },
            { label: 'Thu', value: 156800 },
            { label: 'Fri', value: 198500 },
            { label: 'Sat', value: 234200 },
            { label: 'Sun', value: 187600 }
          ];
          break;
        case 'month':
          data = [
            { label: 'Week 1', value: 485600 },
            { label: 'Week 2', value: 523400 },
            { label: 'Week 3', value: 612800 },
            { label: 'Week 4', value: 598700 }
          ];
          break;
        case 'quarter':
          data = [
            { label: 'Jan-Mar', value: 1854200 },
            { label: 'Apr-Jun', value: 2145600 },
            { label: 'Jul-Sep', value: 1987300 },
            { label: 'Oct-Dec', value: 2356800 }
          ];
          break;
        default:
          data = [];
      }
      
      setRevenueData(data);
      setLoading(false);
    }, 500);
  }, [period]);

  return { revenueData, loading, period, setPeriod };
};