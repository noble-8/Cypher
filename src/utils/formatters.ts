import { Counterparty, TokenMetadata } from '../types';
import { KNOWN_ADDRESSES, TOKENS } from '../constants';

/**
 * Formats a wallet address for display by shortening it
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formats a number as USD currency
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats a timestamp (in seconds) to a readable date format
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Determines the type and name of an address by checking if it's a known address
 */
export function identifyAddress(address: string): Partial<Counterparty> {
  // Check if it's a known address
  const lowerCaseAddress = address.toLowerCase();
  const knownAddress = KNOWN_ADDRESSES[lowerCaseAddress as keyof typeof KNOWN_ADDRESSES];
  
  if (knownAddress) {
    return {
      name: knownAddress.name,
      type: knownAddress.type as 'wallet' | 'contract' | 'protocol' | 'exchange',
    };
  }
  
  // If it's the Cypher master wallet
  if (lowerCaseAddress === '0xcccd218a58b53c67fc17d8c87cb90d83614e35fd') {
    return {
      name: 'Cypher Master Wallet',
      type: 'wallet',
    };
  }
  
  // Default to unknown
  return {
    name: null,
    type: 'unknown',
  };
}

/**
 * Gets token metadata by address
 */
export function getTokenMetadata(tokenAddress: string): TokenMetadata | undefined {
  const lowerCaseAddress = tokenAddress.toLowerCase();
  
  // Check if it's a known token
  for (const token of Object.values(TOKENS)) {
    if (token.address.toLowerCase() === lowerCaseAddress) {
      return token;
    }
  }
  
  // Not found
  return undefined;
}

/**
 * Format a numeric value with appropriate decimal places
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a token amount by its decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals;
}