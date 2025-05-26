import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { 
  CYPHER_MASTER_WALLET, 
} from '../constants';
import { 
  TokenPrice, 
  TimeFrame
} from '../types';

import { AggregatedVolume } from '../types';
import { WalletAnalysis } from '../types';
import { Counterparty } from '../types';
// Initialize the viem client for Base chain
const client = createPublicClient({
  chain: base,
  transport: http(),
});


// Cache for price data to minimize API calls
const priceCache = new Map<string, TokenPrice>();
const addressTypeCache = new Map<string, 'Wallet' | 'Contract' | 'Unknown'>();
const BASESCAN_API_URL = 'https://api.basescan.org/api';
const UNISWAP_V3_BASE_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-base';
const BASESCAN_API_KEY = '9W4MCQTE1JEUP94C4FGMJS12355QQQ1WCM'; // Leave empty for public access, or replace with your key


// Real token addresses on Base Chain for common tokens
const TOKEN_ADDRESSES = {
  WETH: '0x4200000000000000000000000000000000000006', // WETH on Base
  USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54e79da029', // USDC on Base
  AERO: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', // AERO on Base
  // Add other relevant ERC-20 tokens here if needed for real data
};

const KNOWN_PROTOCOLS: { [address: string]: { type: string; name: string } } = {
  '0x33128a8fC17869897dcE68Ed026d694621f6FDfD': { type: 'Known Protocol', name: 'Uniswap V3 Factory' },
  '0x2626664c2603336E57B271c5C0b26F421741e481': { type: 'Known Protocol', name: 'Uniswap V3 SwapRouter02' },
  '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43': { type: 'Known Protocol', name: 'Aerodrome Router' },
  '0x4200000000000000000000000000000000000010': { type: 'Known Protocol', name: 'Base L2StandardBridge' },
  '0x4200000000000000000000000000000000000007': { type: 'Known Protocol', name: 'Base L2CrossDomainMessenger' },
  // Add more known addresses as needed (e.g., other DEXs, lending protocols, CEX deposit contracts if identifiable)
};


/**
 * GraphQL query to find a Uniswap V3 pool for a given token pair and fee tier.
 */
const GET_POOL_QUERY = `
  query GetPool($token0: String!, $token1: String!, $feeTier: BigInt!) {
    pools(where: { token0_: { id: $token0 }, token1_: { id: $token1 }, feeTier: $feeTier }) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      token0Price
      token1Price
    }
  }
`;

/**
 * GraphQL query to get historical daily data for a specific Uniswap V3 pool.
 */
const GET_POOL_DAY_DATA_QUERY = `
  query GetPoolDayData($poolId: String!, $date: Int!) {
    poolDayDatas(where: { pool: $poolId, date_gte: $date, date_lte: $date }, first: 1, orderBy: date, orderDirection: asc) {
      date
      token0Price
      token1Price
    }
  }
`;



export async function getUSDLoadVolume(
  timeframe: TimeFrame,
  startDate: string, // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
): Promise<AggregatedVolume[]> {
  const aggregatedVolumeMap = new Map<string, number>();
  const normalizedMasterWalletAddress = CYPHER_MASTER_WALLET.toLowerCase();

  const startTimestamp = new Date(startDate).getTime() / 1000;
  const endTimestamp = new Date(endDate).getTime() / 1000;

  if (isNaN(startTimestamp) || isNaN(endTimestamp) || startTimestamp > endTimestamp) {
    throw new Error('Invalid date range provided for USD load volume analysis.');
  }

  // Fetch all transactions to/from the master wallet
  const allTransactions = await fetchWalletTransactions(normalizedMasterWalletAddress);
  console.log(allTransactions)

  // Filter transactions to only include those sent TO the master wallet within 2025
  const relevantTransactions = allTransactions.filter(tx => {
    const txTimestamp = parseInt(tx.timeStamp || tx.timeStamp, 10); // Use timeStamp for normal tx, timeStamp for token tx
    const txYear = new Date(txTimestamp * 1000).getFullYear();
    
    // Ensure transaction is TO the master wallet and within 2025
    return tx.to.toLowerCase() === normalizedMasterWalletAddress && txYear === 2025;
  });

  for (const tx of relevantTransactions) {
    const txTimestamp = parseInt(tx.timeStamp || tx.timeStamp, 10); // Use timeStamp for normal tx, timeStamp for token tx
    let tokenAddress: string;
    let amountRaw: string;
    let decimals: number;
    let tokenSymbol: string;

    if (tx.value) { // This is a normal ETH transaction
      tokenAddress = TOKEN_ADDRESSES.WETH; // Represent ETH as WETH for price lookup
      amountRaw = tx.value;
      decimals = 18; // ETH has 18 decimals
      tokenSymbol = 'WETH';
    } else if (tx.tokenDecimal && tx.contractAddress && tx.value) { // This is an ERC-20 token transfer
      tokenAddress = tx.contractAddress.toLowerCase();
      amountRaw = tx.value; // ERC-20 amount is typically in 'value' field on BaseScan for tokentx
      decimals = parseInt(tx.tokenDecimal, 10);
      tokenSymbol = tx.tokenSymbol || 'UNKNOWN_ERC20';
    } else {
      console.warn('Skipping transaction due to missing data:', tx);
      continue;
    }

    try {
      const tokenPrice = await getHistoricalTokenPrice(tokenAddress, txTimestamp);

      if (tokenPrice && tokenPrice.price > 0) {
        const amountNormalized = parseFloat(amountRaw) / Math.pow(10, decimals);
        const usdValue = amountNormalized * tokenPrice.price;

        let dateKey: string;
        switch (timeframe) {
          case 'daily':
            dateKey = formatDate(txTimestamp);
            break;
          case 'weekly':
            dateKey = formatWeek(txTimestamp);
            break;
          case 'monthly':
            dateKey = formatMonth(txTimestamp);
            break;
          default:
            dateKey = formatDate(txTimestamp); // Fallback
        }
        aggregatedVolumeMap.set(dateKey, (aggregatedVolumeMap.get(dateKey) || 0) + usdValue);
      } else {
        console.warn(`Could not get valid historical price for ${tokenSymbol} (${tokenAddress}) at ${new Date(txTimestamp * 1000).toISOString()}. Skipping USD conversion for this transaction.`);
      }
    } catch (priceError) {
      console.error(`Error processing transaction for USD conversion (Tx Hash: ${tx.hash || 'N/A'}):`, priceError);
    }
  }

  const sortedVolume = Array.from(aggregatedVolumeMap.entries())
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return sortedVolume;
}

  const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
};


const getWeekNumber = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

// Helper function to format date to YYYY-WW
const formatWeek = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const week = String(getWeekNumber(timestamp)).padStart(2, '0');
  return `${year}-W${week}`;
};

// Helper function to format date to YYYY-MM
const formatMonth = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};


/**
 * Gets the historical price of a token at a specific timestamp by querying The Graph.
 * It attempts to find a pool with USDC, then WETH, to derive the USD value.
 */
export async function getHistoricalTokenPrice(
  tokenAddress: string,
  timestamp: number
): Promise<TokenPrice | null> {
  // Check cache first
  const cacheKey = `${tokenAddress.toLowerCase()}-${timestamp}`;
  if (priceCache.has(cacheKey)) {
    return priceCache.get(cacheKey) || null;
  }

  // USDC is 1 USD
  if (tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase()) {
    const usdcPrice: TokenPrice = {
      symbol: 'USDC',
      address: TOKEN_ADDRESSES.USDC,
      price: 1.0,
      timestamp,
    };
    priceCache.set(cacheKey, usdcPrice);
    return usdcPrice;
  }

  // Convert timestamp to day (Unix timestamp at start of day) for poolDayDatas query
  const dayTimestamp = Math.floor(timestamp / (24 * 60 * 60)) * (24 * 60 * 60);

  // Define potential quote tokens and fee tiers to try
  const quoteTokenAddresses = [TOKEN_ADDRESSES.USDC, TOKEN_ADDRESSES.WETH];
  const feeTiers = ['500', '3000', '10000']; // 0.05%, 0.3%, 1%

  let foundPrice: TokenPrice | null = null;

  for (const quoteToken of quoteTokenAddresses) {
    for (const feeTier of feeTiers) {
      try {
        // Try to find the pool (token0, token1)
        let poolVariables = {
          token0: tokenAddress.toLowerCase(),
          token1: quoteToken.toLowerCase(),
          feeTier: feeTier,
        };

        let graphQuery = GET_POOL_QUERY;
        let poolResponse = await fetch(UNISWAP_V3_BASE_SUBGRAPH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: graphQuery, variables: poolVariables }),
        });
        let poolData = await poolResponse.json();
        let pool = poolData.data?.pools[0];

        // If pool not found with token0 as the input token, try swapping token0 and token1
        if (!pool) {
          poolVariables = {
            token0: quoteToken.toLowerCase(),
            token1: tokenAddress.toLowerCase(),
            feeTier: feeTier,
          };
          poolResponse = await fetch(UNISWAP_V3_BASE_SUBGRAPH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: graphQuery, variables: poolVariables }),
          });
          console.log("0000")
          console.log(poolResponse);
          poolData = await poolResponse.json();
          pool = poolData.data?.pools[0];
        }

        if (pool) {
          // Found a pool, now get historical day data
          const dayDataVariables = {
            poolId: pool.id,
            date: dayTimestamp,
          };
          const dayDataResponse = await fetch(UNISWAP_V3_BASE_SUBGRAPH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_POOL_DAY_DATA_QUERY, variables: dayDataVariables }),
          });
          const dayData = await dayDataResponse.json();
          const dailyPriceData = dayData.data?.poolDayDatas[0];

          if (dailyPriceData) {
            let priceInQuoteToken;
            let tokenSymbol;

            if (pool.token0.id.toLowerCase() === tokenAddress.toLowerCase()) {
              priceInQuoteToken = parseFloat(dailyPriceData.token1Price); // Price of token0 in terms of token1
              tokenSymbol = pool.token0.symbol;
            } else {
              priceInQuoteToken = parseFloat(dailyPriceData.token0Price); // Price of token1 in terms of token0
              tokenSymbol = pool.token1.symbol;
            }

            let usdPrice = priceInQuoteToken;
            // If the quote token is WETH, we need to convert WETH price to USD
            if (quoteToken.toLowerCase() === TOKEN_ADDRESSES.WETH.toLowerCase()) {
              // Recursively get WETH price in USD (this will hit the USDC/WETH pool logic)
              const wethPriceInUSD = await getHistoricalTokenPrice(TOKEN_ADDRESSES.WETH, timestamp);
              if (wethPriceInUSD) {
                usdPrice *= wethPriceInUSD.price;
              } else {
                console.warn(`Could not get WETH price in USD for timestamp ${timestamp}.`);
                continue; // Try next fee tier or quote token
              }
            }

            foundPrice = {
              symbol: tokenSymbol,
              address: tokenAddress,
              price: usdPrice,
              timestamp,
            };
            break; // Found a price, break from feeTier loop
          }
        }
      } catch (graphError) {
        console.error(`Error querying The Graph for ${tokenAddress} vs ${quoteToken} (fee: ${feeTier}):`, graphError);
      }
    }
    if (foundPrice) break; // Found a price, break from quoteToken loop
  }

  // If no price found via The Graph, return a generic UNKNOWN token price
  if (!foundPrice) {
    console.warn(`No historical price found on The Graph for ${tokenAddress} at ${timestamp}. Returning generic mock price.`);
    foundPrice = {
      symbol: 'UNKNOWN',
      address: tokenAddress,
      price: Math.random() * 50, // Fallback to a random price
      timestamp,
    };
  }

  // Cache the result
  priceCache.set(cacheKey, foundPrice);
  return foundPrice;
}



/**
 * Analyzes a wallet to find its top counterparties.
 */
export async function analyzeWallet(walletAddress: string): Promise<WalletAnalysis> {
  const normalizedWalletAddress = walletAddress.toLowerCase();
  const counterpartyCounts = new Map<string, number>();
  let totalTransactions = 0;
  let totalValueUSD = 0;

  try {
    const allTransactions = await fetchWalletTransactions(normalizedWalletAddress);

    for (const tx of allTransactions) {
      totalTransactions++;
      let counterpartyAddress: string;
      if (tx.from.toLowerCase() === normalizedWalletAddress) {
        counterpartyAddress = tx.to.toLowerCase();
      } else if (tx.to.toLowerCase() === normalizedWalletAddress) {
        counterpartyAddress = tx.from.toLowerCase();
      } else {
        continue; // Should not happen if transactions are correctly filtered for the wallet
      }

      // Exclude the wallet itself from counterparties
      if (counterpartyAddress === normalizedWalletAddress) {
        continue;
      }

      counterpartyCounts.set(counterpartyAddress, (counterpartyCounts.get(counterpartyAddress) || 0) + 1);
    }

    const sortedCounterparties: Counterparty[] = [];
    for (const [address, count] of counterpartyCounts.entries()) {
      const knownInfo = KNOWN_PROTOCOLS[address];
      let type: 'Wallet' | 'Contract' | 'Known Protocol' | 'Centralized Exchange' | 'Unknown';
      let name: string | undefined;

      if (knownInfo) {
        type = knownInfo.type as any; // Cast to specific type
        name = knownInfo.name;
      } else {
        type = await isContractAddress(address);
        name = undefined; // No specific name for unknown wallets/contracts
      }

      sortedCounterparties.push({ address, count, type, name });
    }

    // Sort by count descending and take top 10
    sortedCounterparties.sort((a, b) => b.count - a.count);
    const top10Counterparties = sortedCounterparties.slice(0, 10);

    return {
      address: walletAddress,
      topCounterparties: top10Counterparties,
      totalTransactions: totalTransactions,
      totalValue: parseFloat(totalValueUSD.toFixed(2)), // Convert to a more readable format
    };
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    throw error;
  }
}

/**
 * Checks if an address is a contract by querying BaseScan.
 */
async function isContractAddress(address: string): Promise<'Wallet' | 'Contract' | 'Unknown'> {
  const normalizedAddress = address.toLowerCase();
  if (addressTypeCache.has(normalizedAddress)) {
    return addressTypeCache.get(normalizedAddress)!;
  }

  // Check hardcoded known protocols first
  if (KNOWN_PROTOCOLS[normalizedAddress]) {
    addressTypeCache.set(normalizedAddress, 'Contract'); // Known protocols are contracts
    return 'Contract';
  }

  try {
    const response = await fetch(
      `${BASESCAN_API_URL}?module=proxy&action=eth_getCode&address=${normalizedAddress}&apikey=${BASESCAN_API_KEY}`
    );
    const data = await response.json();

    if (data.result && data.result !== '0x') {
      addressTypeCache.set(normalizedAddress, 'Contract');
      return 'Contract';
    } else {
      addressTypeCache.set(normalizedAddress, 'Wallet');
      return 'Wallet';
    }
  } catch (error) {
    console.error(`Error checking contract status for ${address}:`, error);
    addressTypeCache.set(normalizedAddress, 'Unknown');
    return 'Unknown';
  }
}


/**
 * Fetches transactions for a given wallet address from BaseScan.
 * Combines normal transactions and ERC-20 token transfers.
 */
async function fetchWalletTransactions(walletAddress: string): Promise<any[]> {
  const transactions: any[] = [];
  const normalizedAddress = walletAddress.toLowerCase();

  try {
    // Fetch normal transactions (ETH transfers)
    const normalTxResponse = await fetch(
      `${BASESCAN_API_URL}?module=account&action=txlist&address=${normalizedAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`
    );
    const normalTxData = await normalTxResponse.json();
    if (normalTxData.status === '1' && Array.isArray(normalTxData.result)) {
      transactions.push(...normalTxData.result);
    } else {
      console.warn('BaseScan normal transactions API error or no data:', normalTxData.message);
      console.log(normalTxData)
    }

    // Fetch ERC-20 token transfers
    const tokenTxResponse = await fetch(
      `${BASESCAN_API_URL}?module=account&action=tokentx&address=${normalizedAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`
    );
    const tokenTxData = await tokenTxResponse.json();
    if (tokenTxData.status === '1' && Array.isArray(tokenTxData.result)) {
      transactions.push(...tokenTxData.result);
    } else {
      console.warn('BaseScan ERC-20 token transactions API error or no data:', tokenTxData.message);
    }

  } catch (error) {
    console.error('Error fetching wallet transactions from BaseScan:', error);
    throw new Error('Failed to fetch wallet transactions. Please try again later.');
  }

  return transactions;
}
/**
 * Checks if an address is a contract
 */
export async function isContract(address: string): Promise<boolean> {
  try {
    const code = await client.getBytecode({
      address: address as `0x${string}`,
    });
    
    // If there's code at the address, it's a contract
    return code !== undefined && code !== '0x';
  } catch (error) {
    console.error('Error checking if address is contract:', error);
    return false;
  }
}

/**
 * Gets the balance of a token for a specific address
 */
export async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<bigint> {
  try {
    // For ERC20 tokens
    if (tokenAddress !== '0x0000000000000000000000000000000000000000') {
      // In a real implementation, we would call the ERC20 balanceOf method
      return BigInt(0);
    }
    
    // For native ETH
    const balance = await client.getBalance({
      address: walletAddress as `0x${string}`,
    });
    
    return balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return BigInt(0);
  }
}