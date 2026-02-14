'use client';

import Card from '@/components/ui/Card';

export default function PortfolioPage() {
  const portfolioStats = [
    {
      label: 'Total Value',
      value: 'AED 460,329.94',
      change: '+12.5%',
      positive: true,
    },
    {
      label: 'Today\'s Gain/Loss',
      value: '+AED 8,588.53',
      change: '+1.9%',
      positive: true,
    },
    {
      label: 'Total Investments',
      value: 'AED 367,000.00',
      change: '15 stocks',
      positive: true,
    },
    {
      label: 'Total Return',
      value: '+AED 93,329.94',
      change: '+25.4%',
      positive: true,
    }
  ];

  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, price: 175.43, value: 8771.50, change: 2.3, shariah: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, price: 378.91, value: 11367.30, change: 1.8, shariah: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 25, price: 141.80, value: 3545.00, change: -0.5, shariah: false },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 40, price: 248.50, value: 9940.00, change: 3.2, shariah: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 60, price: 875.28, value: 52516.80, change: 5.1, shariah: true },
  ];

  const recentTransactions = [
    { type: 'Buy', symbol: 'NVDA', shares: 10, price: 870.00, date: '2026-02-14', time: '09:30 AM' },
    { type: 'Sell', symbol: 'GOOGL', shares: 5, price: 142.50, date: '2026-02-13', time: '02:15 PM' },
    { type: 'Buy', symbol: 'AAPL', shares: 15, price: 173.20, date: '2026-02-12', time: '11:45 AM' },
  ];

  return (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wide">{stat.label}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm font-bold">{stat.change}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Holdings Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Your Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Symbol</th>
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Name</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Shares</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Price</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Value</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Change</th>
                  <th className="text-center font-bold uppercase text-xs py-3 px-4">Shariah</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => (
                  <tr key={index} className="border-b-2 border-black hover:bg-black hover:text-white">
                    <td className="py-4 px-4">
                      <span className="font-bold">{holding.symbol}</span>
                    </td>
                    <td className="py-4 px-4">{holding.name}</td>
                    <td className="py-4 px-4 text-right">{holding.shares}</td>
                    <td className="py-4 px-4 text-right">AED {holding.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold">
                      AED {holding.value.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold">
                      {holding.change > 0 ? '+' : ''}{holding.change}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 font-bold text-xs border-2 border-black ${holding.shariah ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {holding.shariah ? 'YES' : 'NO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="border-4 border-black p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 font-bold text-xs border-2 border-black ${transaction.type === 'Buy' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {transaction.type.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold">{transaction.symbol}</div>
                      <div className="text-sm">{transaction.shares} shares @ AED {transaction.price}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{transaction.date}</div>
                    <div className="text-sm">{transaction.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}
