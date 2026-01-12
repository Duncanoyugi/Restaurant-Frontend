import { useState, useEffect } from 'react';
import { useGetRevenueAnalyticsQuery } from '../../analytics/analyticsApi';

export interface RevenueItem {
  label: string;
  value: number;
}

export const useRevenueData = () => {
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([
    { label: '8AM', value: 1200 },
    { label: '10AM', value: 1800 },
    { label: '12PM', value: 2400 },
    { label: '2PM', value: 2100 },
    { label: '4PM', value: 2800 },
    { label: '6PM', value: 3200 },
    { label: '8PM', value: 2900 },
    { label: '10PM', value: 2200 },
  ]);

  const [period, setPeriod] = useState<string>('last_30_days');
  const { data: apiData, isLoading } = useGetRevenueAnalyticsQuery({
    period: period as any,
  });

  useEffect(() => {
    if (apiData && Array.isArray(apiData) && apiData.length > 0) {
      // Transform API data to chart format
      const transformedData = apiData.map((item: any, index: number) => ({
        label: item.hour || item.date || `Hour ${index + 1}`,
        value: item.revenue || item.amount || 0,
      }));
      setRevenueData(transformedData);
    } else if (apiData && !Array.isArray(apiData) && (apiData as any).revenueData) {
      // Handle nested structure if it exists
      const transformedData = (apiData as any).revenueData.map((item: any, index: number) => ({
        label: item.hour || item.date || `Hour ${index + 1}`,
        value: item.revenue || item.amount || 0,
      }));
      setRevenueData(transformedData);
    }
    // Keep default data if API returns empty array
  }, [apiData]);

  return { revenueData, loading: isLoading, period, setPeriod };
};
