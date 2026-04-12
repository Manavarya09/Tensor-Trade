'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import {
  getPortfolio,
  getWalletTransactions,
  PortfolioHolding,
  PortfolioSummary,
  WalletTransaction,
} from '@/lib/api';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [portfolioRes, txRes] = await Promise.all([
        getPortfolio(),
        getWalletTransactions(),
      ]);
      setPortfolio(portfolioRes);
      setTransactions((txRes.transactions ?? []).slice(0, 5));
    } catch {
      // backend offline — render empty state without crashing
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currency = portfolio?.currency ?? 'AED';

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const portfolioStats = portfolio
    ? [
        {
          label: 'Total Value',
          value: `${currency} ${fmt(portfolio.total_value)}`,
          change: `${portfolio.total_pnl_percent >= 0 ? '+' : ''}${portfolio.total_pnl_percent.toFixed(1)}%`,
          positive: portfolio.total_pnl_percent >= 0,
        },
        {
          label: "Today's Gain/Loss",
          value: `${portfolio.total_pnl >= 0 ? '+' : ''}${currency} ${fmt(portfolio.total_pnl)}`,
          change: `${portfolio.holdings_count} holdings`,
          positive: portfolio.total_pnl >= 0,
        },
        {
          label: 'Invested',
          value: `${currency} ${fmt(portfolio.invested_value)}`,
          change: `Cash: ${currency} ${fmt(portfolio.cash_balance)}`,
          positive: true,
        },
        {
          label: 'Wallet Balance',
          value: `${currency} ${fmt(portfolio.wallet_balance)}`,
          change: `${portfolio.token_symbol} tokens`,
          positive: true,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-xl font-bold uppercase">Loading...</div>
      </div>
    );
  }

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
        {portfolio?.holdings.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Symbol</th>
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Name</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Shares</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Price</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Value</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">P&L</th>
                  <th className="text-center font-bold uppercase text-xs py-3 px-4">Shariah</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((h: PortfolioHolding, index: number) => (
                  <tr key={index} className="border-b-2 border-black hover:bg-black hover:text-white">
                    <td className="py-4 px-4"><span className="font-bold">{h.symbol}</span></td>
                    <td className="py-4 px-4">{h.name}</td>
                    <td className="py-4 px-4 text-right">{h.quantity}</td>
                    <td className="py-4 px-4 text-right">{currency} {fmt(h.current_price)}</td>
                    <td className="py-4 px-4 text-right font-bold">{currency} {fmt(h.market_value)}</td>
                    <td className="py-4 px-4 text-right font-bold">
                      {h.pnl >= 0 ? '+' : ''}{h.pnl_percent.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 font-bold text-xs border-2 border-black ${h.shariah ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {h.shariah ? 'YES' : 'NO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center font-bold uppercase text-gray-500">No holdings yet</div>
        )}
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Recent Transactions</h2>
        {transactions.length ? (
          <div className="space-y-4">
            {transactions.map((tx: WalletTransaction, index: number) => (
              <div key={index} className="border-4 border-black p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 font-bold text-xs border-2 border-black ${tx.type === 'credit' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {tx.type.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold">{tx.description}</div>
                      <div className="text-sm">{tx.reference}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{currency} {fmt(tx.amount)}</div>
                    <div className="text-sm">{new Date(tx.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center font-bold uppercase text-gray-500">No transactions yet</div>
        )}
      </Card>
    </div>
  );
}
