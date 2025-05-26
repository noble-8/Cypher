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