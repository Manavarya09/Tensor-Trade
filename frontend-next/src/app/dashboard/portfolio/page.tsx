'use client';

import { useState } from 'react';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  shariahScore: number;
  sector: string;
}

const INITIAL_ASSETS: Asset[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 10,
    avgCost: 175.5,
    currentPrice: 178.45,
    pnl: 29.5,
    pnlPercent: 1.68,
    shariahScore: 95,
    sector: 'Technology',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    quantity: 5,
    avgCost: 380,
    currentPrice: 395.2,
    pnl: 76,
    pnlPercent: 4,
    shariahScore: 92,
    sector: 'Technology',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 8,
    avgCost: 140,
    currentPrice: 138.5,
    pnl: -12,
    pnlPercent: -1.07,
    shariahScore: 88,
    sector: 'Technology',
  },
];

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [showAddAsset, setShowAddAsset] = useState(false);

  const totalValue = assets.reduce((sum, asset) => sum + (asset.currentPrice * asset.quantity), 0);
  const totalPnL = assets.reduce((sum, asset) => sum + asset.pnl, 0);
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;
  const avgShariahScore = assets.reduce((sum, asset) => sum + asset.shariahScore, 0) / assets.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your investments and performance
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAssets([...INITIAL_ASSETS])}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddAsset(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            AED {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total P&L</p>
          <p className={`text-2xl font-bold mt-1 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}AED {totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm mt-1 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Shariah Compliance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {avgShariahScore.toFixed(0)}/100
          </p>
          <p className="text-sm text-green-600 mt-1">✓ Halal</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Assets</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {assets.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Holdings</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  P&L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Shariah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map((asset) => (
                <tr key={asset.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {asset.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {asset.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {asset.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    AED {asset.avgCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    AED {asset.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    AED {(asset.currentPrice * asset.quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.pnl >= 0 ? '+' : ''}AED {asset.pnl.toFixed(2)}
                    </div>
                    <div className={`text-xs ${asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.pnl >= 0 ? '+' : ''}{asset.pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      asset.shariahScore >= 70 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {asset.shariahScore}/100
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Asset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., AAPL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="175.50"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddAsset(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add asset logic here
                    setShowAddAsset(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
