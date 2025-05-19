export interface TokenPrice {
  symbol: string;
  address: string;
  price: number;
  timestamp: number;
}

export interface TokenVolumeData {
  date: string;
  volume: number;
}

export interface DailyVolume {
  date: string;
  volume: number;
}

export interface WeeklyVolume {
  week: string;
  startDate: string;
  endDate: string;
  volume: number;
}

export interface MonthlyVolume {
  month: string;
  year: number;
  volume: number;
}

export interface Counterparty {
  address: string;
  name: string | null;
  type: 'wallet' | 'contract' | 'protocol' | 'exchange' | 'unknown';
  transactionCount: number;
  totalValue: number;
  lastTransaction: string;
}

export interface WalletAnalysis {
  address: string;
  topCounterparties: Counterparty[];
  totalTransactions: number;
  totalValue: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly';

export interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
}

export interface TokenTransfer {
  hash: string;
  from: string;
  to: string;
  tokenAddress: string;
  value: bigint;
  timestamp: number;
}