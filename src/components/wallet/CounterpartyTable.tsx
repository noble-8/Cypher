import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { Counterparty } from '../../types';
import { formatAddress, formatUSD } from '../../utils/formatters';
import Card from '../ui/Card';

interface CounterpartyTableProps {
  counterparties: Counterparty[];
  walletAddress: string;
  totalTransactions: number;
  totalValue: number;
}

const CounterpartyTable: React.FC<CounterpartyTableProps> = ({
  counterparties,
  walletAddress,
  totalTransactions,
  totalValue,
}) => {
  // Define colors for different entity types
  const typeColors = {
    wallet: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    contract: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    protocol: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    exchange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  
  // Generate etherscan URL for the address
  const getEtherscanUrl = (address: string) => {
    return `https://basescan.org/address/${address}`;
  };
  
  return (
    <Card 
      title="Top Counterparties" 
      subtitle={`For wallet ${formatAddress(walletAddress)}`}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Total Transactions</span>
          <p className="text-lg font-semibold">{totalTransactions}</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Total Value</span>
          <p className="text-lg font-semibold">{formatUSD(totalValue)}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Transactions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Value
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Last Transaction
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {counterparties.map((counterparty) => (
              <tr key={counterparty.address} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <a 
                      href={getEtherscanUrl(counterparty.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 font-mono flex items-center"
                    >
                      {formatAddress(counterparty.address)}
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                  {counterparty.name && (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {counterparty.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${typeColors[counterparty.type]}`}>
                    {counterparty.type.charAt(0).toUpperCase() + counterparty.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200">
                  {counterparty.transactionCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200">
                  {formatUSD(counterparty.totalValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-right">
                  {new Date(counterparty.lastTransaction).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CounterpartyTable;