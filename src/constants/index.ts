// Cypher master wallet address that receives token loads
export const CYPHER_MASTER_WALLET = '0xcCCd218A58B53C67fC17D8C87Cb90d83614e35fD';

// Base chain related constants
export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = 'https://mainnet.base.org';

// Common token addresses on Base
export const TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000', // Native ETH
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  DAI: {
    symbol: 'DAI', 
    name: 'Dai Stablecoin',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
};

// Known contracts and protocols on Base
export const KNOWN_ADDRESSES = {
  // Exchanges & Bridges
  '0x49048044d57e1c92a77f79988d21fa8faf74e97e': {
    name: 'Base Bridge',
    type: 'protocol',
  },
  '0x4200000000000000000000000000000000000006': {
    name: 'Base Bridge (L2)',
    type: 'protocol',
  },
  '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9': {
    name: 'Aerodrome Router',
    type: 'protocol',
  },
  '0x4c36388be6f416a29c8d8eee81c771ce6be14b18': {
    name: 'Uniswap Universal Router',
    type: 'protocol',
  },
  
  // Centralized Exchanges
  '0xf977814e90da44bfa03b6295a0616a897441acec': {
    name: 'Binance',
    type: 'exchange',
  },
  '0xa090e606e30bd747d4e6245a1517ebe430f0057e': {
    name: 'Coinbase',
    type: 'exchange',
  },
  
  // Add more known addresses as needed
};

// Aerodrome Finance contracts for price data
export const AERODROME_CONTRACTS = {
  FACTORY: '0x0df318405fc57fb9fe4d63cfdb76391c36e97efa',
  ROUTER: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
};

// Mock data for development (will be replaced with real API calls)
export const MOCK_DAILY_VOLUME: DailyVolume[] = [
  { date: '2025-01-01', volume: 24000 },
  { date: '2025-01-02', volume: 18500 },
  { date: '2025-01-03', volume: 32000 },
  { date: '2025-01-04', volume: 15800 },
  { date: '2025-01-05', volume: 21300 },
  { date: '2025-01-06', volume: 38000 },
  { date: '2025-01-07', volume: 29600 },
  { date: '2025-01-08', volume: 31200 },
  { date: '2025-01-09', volume: 27800 },
  { date: '2025-01-10', volume: 43500 },
  { date: '2025-01-11', volume: 36900 },
  { date: '2025-01-12', volume: 29700 },
  { date: '2025-01-13', volume: 34200 },
  { date: '2025-01-14', volume: 41500 },
];

export const MOCK_WEEKLY_VOLUME: WeeklyVolume[] = [
  { week: 'Week 1', startDate: '2025-01-01', endDate: '2025-01-07', volume: 179200 },
  { week: 'Week 2', startDate: '2025-01-08', endDate: '2025-01-14', volume: 244800 },
  { week: 'Week 3', startDate: '2025-01-15', endDate: '2025-01-21', volume: 203500 },
  { week: 'Week 4', startDate: '2025-01-22', endDate: '2025-01-28', volume: 187600 },
];

export const MOCK_MONTHLY_VOLUME: MonthlyVolume[] = [
  { month: 'January', year: 2025, volume: 815100 },
  { month: 'February', year: 2025, volume: 723800 },
  { month: 'March', year: 2025, volume: 892300 },
];

export const MOCK_WALLET_ANALYSIS: WalletAnalysis = {
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  totalTransactions: 86,
  totalValue: 52370,
  topCounterparties: [
    {
      address: '0x4c36388be6f416a29c8d8eee81c771ce6be14b18',
      name: 'Uniswap Universal Router',
      type: 'protocol',
      transactionCount: 18,
      totalValue: 12500,
      lastTransaction: '2025-01-14T09:23:45Z',
    },
    {
      address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
      name: 'Aerodrome Router',
      type: 'protocol',
      transactionCount: 15,
      totalValue: 9800,
      lastTransaction: '2025-01-13T14:12:30Z',
    },
    {
      address: '0x49048044d57e1c92a77f79988d21fa8faf74e97e',
      name: 'Base Bridge',
      type: 'protocol',
      transactionCount: 12,
      totalValue: 7600,
      lastTransaction: '2025-01-11T11:05:22Z',
    },
    {
      address: '0xa090e606e30bd747d4e6245a1517ebe430f0057e',
      name: 'Coinbase',
      type: 'exchange',
      transactionCount: 8,
      totalValue: 5200,
      lastTransaction: '2025-01-09T16:45:10Z',
    },
    {
      address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      name: null,
      type: 'wallet',
      transactionCount: 7,
      totalValue: 4300,
      lastTransaction: '2025-01-08T08:32:15Z',
    },
    {
      address: '0xcccd218a58b53c67fc17d8c87cb90d83614e35fd',
      name: 'Cypher Master Wallet',
      type: 'wallet',
      transactionCount: 6,
      totalValue: 3800,
      lastTransaction: '2025-01-07T10:11:05Z',
    },
    {
      address: '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      name: null,
      type: 'contract',
      transactionCount: 5,
      totalValue: 3100,
      lastTransaction: '2025-01-06T19:22:33Z',
    },
    {
      address: '0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
      name: null,
      type: 'wallet',
      transactionCount: 5,
      totalValue: 2900,
      lastTransaction: '2025-01-05T13:56:48Z',
    },
    {
      address: '0xf977814e90da44bfa03b6295a0616a897441acec',
      name: 'Binance',
      type: 'exchange',
      transactionCount: 5,
      totalValue: 1970,
      lastTransaction: '2025-01-04T07:34:21Z',
    },
    {
      address: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
      name: null,
      type: 'contract',
      transactionCount: 5,
      totalValue: 1200,
      lastTransaction: '2025-01-03T22:45:09Z',
    },
  ],
};