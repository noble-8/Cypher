import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyVolume, WeeklyVolume, MonthlyVolume, TimeFrame } from '../../types';
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';
import { formatUSD } from '../../utils/formatters';

interface VolumeChartProps {
  dailyData: DailyVolume[];
  weeklyData: WeeklyVolume[];
  monthlyData: MonthlyVolume[];
  timeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
}

const VolumeChart: React.FC<VolumeChartProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
  timeframe,
  onTimeframeChange,
}) => {
  // Determine which data to use based on timeframe
  const chartData = (() => {
    switch (timeframe) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  })();
  
  // Calculate total volume for the current timeframe
  const totalVolume = chartData.reduce((sum, item) => sum + ('volume' in item ? item.volume : 0), 0);
  
  // Format the x-axis labels based on timeframe
  const formatXAxis = (value: string) => {
    if (timeframe === 'daily') {
      // For daily, show day of month
      return new Date(value).getDate();
    } else if (timeframe === 'weekly') {
      // For weekly, show the week number
      return value;
    } else {
      // For monthly, show first 3 letters of month
      return value.substring(0, 3);
    }
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      
      let displayLabel = label;
      if (timeframe === 'daily') {
        displayLabel = new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } else if (timeframe === 'weekly') {
        // Find the start and end dates for the week
        const weekData = weeklyData.find(w => w.week === label);
        displayLabel = weekData ? `${weekData.startDate} to ${weekData.endDate}` : label;
      }
      
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded shadow-lg">
          <p className="text-sm font-medium">{displayLabel}</p>
          <p className="text-sm text-primary-500 font-bold">{formatUSD(value)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  const timeframeTabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];
  
  return (
    <Card 
      title="USD Load Volume (2025)" 
      subtitle={`Total Volume: ${formatUSD(totalVolume)}`}
      className="h-full"
    >
      <Tabs
        tabs={timeframeTabs}
        activeTab={timeframe}
        onChange={(id) => onTimeframeChange(id as TimeFrame)}
        className="mb-4"
      />
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey={timeframe === 'daily' ? 'date' : timeframe === 'weekly' ? 'week' : 'month'} 
              tickFormatter={formatXAxis}
              stroke="#94a3b8"
            />
            <YAxis 
              tickFormatter={(value) => `$${value / 1000}k`} 
              stroke="#94a3b8"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="volume" 
              fill="#8366FF" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              name="USD Volume"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default VolumeChart;