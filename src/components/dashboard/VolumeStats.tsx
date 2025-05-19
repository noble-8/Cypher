import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { DailyVolume, WeeklyVolume, MonthlyVolume } from '../../types';
import { formatUSD } from '../../utils/formatters';

interface VolumeStatsProps {
  dailyData: DailyVolume[];
  weeklyData: WeeklyVolume[];
  monthlyData: MonthlyVolume[];
}

const VolumeStats: React.FC<VolumeStatsProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
}) => {
  // Calculate daily stats (comparing today vs yesterday)
  const calculateDailyChange = () => {
    if (dailyData.length < 2) return { value: 0, percentage: 0, isPositive: true };
    
    const today = dailyData[dailyData.length - 1].volume;
    const yesterday = dailyData[dailyData.length - 2].volume;
    const change = today - yesterday;
    const percentage = (change / yesterday) * 100;
    
    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      isPositive: change >= 0,
    };
  };
  
  // Calculate weekly stats (comparing this week vs last week)
  const calculateWeeklyChange = () => {
    if (weeklyData.length < 2) return { value: 0, percentage: 0, isPositive: true };
    
    const thisWeek = weeklyData[weeklyData.length - 1].volume;
    const lastWeek = weeklyData[weeklyData.length - 2].volume;
    const change = thisWeek - lastWeek;
    const percentage = (change / lastWeek) * 100;
    
    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      isPositive: change >= 0,
    };
  };
  
  // Calculate monthly stats (comparing this month vs last month)
  const calculateMonthlyChange = () => {
    if (monthlyData.length < 2) return { value: 0, percentage: 0, isPositive: true };
    
    const thisMonth = monthlyData[monthlyData.length - 1].volume;
    const lastMonth = monthlyData[monthlyData.length - 2].volume;
    const change = thisMonth - lastMonth;
    const percentage = (change / lastMonth) * 100;
    
    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      isPositive: change >= 0,
    };
  };
  
  const dailyChange = calculateDailyChange();
  const weeklyChange = calculateWeeklyChange();
  const monthlyChange = calculateMonthlyChange();
  
  // Get latest values
  const latestDaily = dailyData.length > 0 ? dailyData[dailyData.length - 1].volume : 0;
  const latestWeekly = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].volume : 0;
  const latestMonthly = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].volume : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Daily Volume"
        value={formatUSD(latestDaily)}
        change={dailyChange.percentage.toFixed(1)}
        isPositive={dailyChange.isPositive}
        changeText={`${dailyChange.isPositive ? '+' : '-'}${formatUSD(dailyChange.value)} vs yesterday`}
        icon={<DollarSign className="w-5 h-5 text-primary-400" />}
      />
      
      <StatCard
        title="Weekly Volume"
        value={formatUSD(latestWeekly)}
        change={weeklyChange.percentage.toFixed(1)}
        isPositive={weeklyChange.isPositive}
        changeText={`${weeklyChange.isPositive ? '+' : '-'}${formatUSD(weeklyChange.value)} vs last week`}
        icon={<TrendingUp className="w-5 h-5 text-accent-500" />}
      />
      
      <StatCard
        title="Monthly Volume"
        value={formatUSD(latestMonthly)}
        change={monthlyChange.percentage.toFixed(1)}
        isPositive={monthlyChange.isPositive}
        changeText={`${monthlyChange.isPositive ? '+' : '-'}${formatUSD(monthlyChange.value)} vs last month`}
        icon={<DollarSign className="w-5 h-5 text-accent-500" />}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  changeText: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  changeText,
  icon,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md">{icon}</div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">{value}</span>
        
        <div className="flex items-center mt-2">
          <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {change}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
            {changeText}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default VolumeStats;