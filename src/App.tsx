import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import VolumeChart from './components/dashboard/VolumeChart';
import VolumeStats from './components/dashboard/VolumeStats';
import CounterpartyTable from './components/wallet/CounterpartyTable';
import LoadingState from './components/dashboard/LoadingState';
import Card from './components/ui/Card';
import { TimeFrame, WalletAnalysis, AggregatedVolume } from './types';
import { 
  getUSDLoadVolume, 
  analyzeWallet 
} from './services/blockchainService';
import { 
  CYPHER_MASTER_WALLET
} from './constants';
import { formatAddress } from './utils/formatters';
import { Wallet } from 'lucide-react';

function App() {
  // State for volume data
  const [dailyVolume, setDailyVolume] = useState<AggregatedVolume[]>([]);
  const [weeklyVolume, setWeeklyVolume] = useState<AggregatedVolume[]>([]);
  const [monthlyVolume, setMonthlyVolume] = useState<AggregatedVolume[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const startDate = '2025-01-01';
  const endDate = '2025-12-31';
  
  // State for wallet analysis
  const [walletAnalysis, setWalletAnalysis] = useState<WalletAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Loading states
  const [isLoadingVolume, setIsLoadingVolume] = useState(true);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  
  // Load the volume data on mount
  useEffect(() => {
    loadVolumeData();
  }, []);

  // Load all volume data
  const loadVolumeData = async () => {
    setIsLoadingVolume(true);
    setError(null);
    
    try {
      // Load all timeframes in parallel
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        getUSDLoadVolume('daily', startDate, endDate),
        getUSDLoadVolume('weekly', startDate, endDate),
        getUSDLoadVolume('monthly', startDate, endDate)
      ]);
      
      setDailyVolume(dailyData);
      setWeeklyVolume(weeklyData);
      setMonthlyVolume(monthlyData);
    } catch (err) {
      console.error('Error loading volume data:', err);
      setError('Failed to load volume data. Please try again later.');
    } finally {
      setIsLoadingVolume(false);
    }
  };
  
  // Handle wallet analysis
  const handleWalletSearch = async (address: string) => {
    setIsAnalyzing(true);
    setError(null);
    
try {
  const analysis = await analyzeWallet(address);
  if (analysis && typeof analysis === 'object' && analysis.address) {
    setWalletAnalysis(analysis);
  } else {
    setError('Invalid analysis result.');
    setWalletAnalysis(null);
  }
} catch (err) {
  console.error('Error analyzing wallet:', err);
  setError('Failed to analyze wallet. Please try again later.');
  setWalletAnalysis(null);
} finally {
  setIsAnalyzing(false);
}
  };
  
  // Handle timeframe change for the volume chart
  const handleTimeframeChange = (newTimeframe: TimeFrame) => {
    setTimeframe(newTimeframe);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header onWalletSearch={handleWalletSearch} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Cypher Blockchain Card Load Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Analyzing card loads sent to <span className="font-mono">{formatAddress(CYPHER_MASTER_WALLET)}</span>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            2025 USD Load Volume
          </h2>
          
          {isLoadingVolume ? (
            <LoadingState message="Loading volume data..." />
          ) : (
            <>
              <VolumeStats 
                dailyData={dailyVolume}
                weeklyData={weeklyVolume}
                monthlyData={monthlyVolume}
              />
              
              <div className="mt-6">
                <VolumeChart
                  dailyData={dailyVolume}
                  weeklyData={weeklyVolume}
                  monthlyData={monthlyVolume}
                  timeframe={timeframe}
                  onTimeframeChange={handleTimeframeChange}
                />
              </div>
            </>
          )}
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Wallet Analysis
          </h2>
          
          {isAnalyzing ? (
            <LoadingState message="Analyzing wallet data..." />
          ) : walletAnalysis ? (
            <CounterpartyTable 
              counterparties={walletAnalysis.topCounterparties}
              walletAddress={walletAnalysis.address}
              totalTransactions={walletAnalysis.totalTransactions}
              totalValue={walletAnalysis.totalValue}
            />
          ) : (
            <Card className="text-center py-12">
              <Wallet className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                No Wallet Selected
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Enter a wallet address in the search bar above to analyze its transaction history and top counterparties.
              </p>
            </Card>
          )}
        </section>
      </main>
      
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2025 Cypher. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;