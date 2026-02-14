'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import {
  CuratedPortfolio,
  getCuratedPortfolios,
  getShariahScreener,
  getWallet,
  investInPortfolio,
  ShariahStock,
  topUpWallet,
} from '@/lib/api';

export default function InvestmentsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [stocks, setStocks] = useState<ShariahStock[]>([]);
  const [investmentOptions, setInvestmentOptions] = useState<CuratedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [investingId, setInvestingId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState('AED');
  const [tokenSymbol, setTokenSymbol] = useState('TTK');

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unexpected error';

  const shariahPrinciples = [
    {
      title: 'No Interest',
      description: 'Companies must not engage in interest-based lending or borrowing'
    },
    {
      title: 'No Gambling',
      description: 'No investment in gambling, betting, or speculative businesses'
    },
    {
      title: 'No Prohibited Goods',
      description: 'Excludes alcohol, pork, tobacco, weapons, and adult entertainment'
    },
    {
      title: 'Debt Ratio Limit',
      description: 'Total debt must be less than 33% of market capitalization'
    },
    {
      title: 'Pure Income',
      description: 'Interest income must be less than 5% of total revenue'
    },
    {
      title: 'Ethical Business',
      description: 'Companies must conduct business ethically and transparently'
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [portfolioRes, screenerRes] = await Promise.all([
          getCuratedPortfolios(),
          getShariahScreener(false),
        ]);
        const walletRes = await getWallet();
        setInvestmentOptions(portfolioRes.portfolios);
        setStocks(screenerRes.stocks);
        setWalletBalance(walletRes.token_balance);
        setCurrency(walletRes.currency);
        setTokenSymbol(walletRes.token_symbol);
      } catch (error: unknown) {
        alert(`Failed to load investment data: ${getErrorMessage(error)}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadScreener = async () => {
      try {
        const screenerRes = await getShariahScreener(activeFilter === 'halal');
        setStocks(screenerRes.stocks);
      } catch (error: unknown) {
        alert(`Failed to update screener: ${getErrorMessage(error)}`);
      }
    };

    loadScreener();
  }, [activeFilter]);

  const handleInvest = async (option: CuratedPortfolio) => {
    const amountInput = window.prompt(
      `Enter amount to invest in ${option.name} (minimum ${currency} ${option.min_investment})`,
      String(option.min_investment)
    );

    if (!amountInput) {
      return;
    }

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    try {
      setInvestingId(option.id);
      const result = await investInPortfolio(option.id, amount);
      setWalletBalance(result.token_balance ?? result.cash_balance);
      if (result.currency) {
        setCurrency(result.currency);
      }
      if (result.token_symbol) {
        setTokenSymbol(result.token_symbol);
      }
      alert(`Investment successful: ${currency} ${amount.toFixed(2)} in ${option.name}`);
    } catch (error: unknown) {
      alert(`Investment failed: ${getErrorMessage(error)}`);
    } finally {
      setInvestingId(null);
    }
  };

  const handleTopUp = async () => {
    const amountInput = window.prompt(`Enter ${currency} amount to add to wallet`, '10000');
    if (!amountInput) {
      return;
    }

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    try {
      const result = await topUpWallet(amount, 'Manual top-up from investments page');
      setWalletBalance(result.token_balance);
      setCurrency(result.currency);
      setTokenSymbol(result.token_symbol);
      alert(`Wallet topped up by ${result.currency} ${amount.toFixed(2)}`);
    } catch (error: unknown) {
      alert(`Top-up failed: ${getErrorMessage(error)}`);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="border-4 border-black p-6">
          <h2 className="text-2xl font-bold uppercase">Shariah-Compliant Investments</h2>
          <p className="text-sm mt-1">ETHICALLY INVEST ACCORDING TO ISLAMIC FINANCE PRINCIPLES</p>
          {walletBalance !== null && <p className="text-sm font-bold mt-3">WALLET BALANCE: {currency} {walletBalance.toFixed(2)} ({tokenSymbol})</p>}
          <div className="mt-3">
            <Button size="sm" onClick={handleTopUp}>TOP UP WALLET</Button>
          </div>
        </div>

        {/* Shariah Principles */}
        <Card className="p-6 border-8 border-black">
          <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Islamic Investment Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shariahPrinciples.map((principle, index) => (
              <div key={index} className="border-4 border-black p-4">
                <h4 className="font-bold uppercase mb-2">{principle.title}</h4>
                <p className="text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Curated Portfolios */}
        <div>
          <h3 className="text-xl font-bold uppercase mb-4">Curated Halal Portfolios</h3>
          {loading && <p className="text-sm font-bold uppercase mb-3">Loading portfolios...</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investmentOptions.map((option, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="border-b-4 border-black pb-3">
                    <h4 className="text-lg font-bold uppercase">{option.name}</h4>
                    <p className="text-sm mt-2">{option.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b-2 border-black py-2">
                      <span className="font-bold">MIN INVESTMENT</span>
                      <span>{currency} {option.min_investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-2">
                      <span className="font-bold">EXPECTED RETURN</span>
                      <span className="font-bold">{option.expected_return}</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-2">
                      <span className="font-bold">RISK LEVEL</span>
                      <span>{option.risk_level}</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-2">
                      <span className="font-bold">HOLDINGS</span>
                      <span>{option.holdings.length}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-bold">COMPLIANCE</span>
                      <span className="font-bold">{option.compliance}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleInvest(option)}
                    disabled={investingId === option.id}
                  >
                    {investingId === option.id ? 'PROCESSING...' : 'INVEST NOW'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stock Screener */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
            <h3 className="text-xl font-bold uppercase">Shariah Stock Screener</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 font-bold text-xs uppercase border-4 border-black ${
                  activeFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setActiveFilter('halal')}
                className={`px-4 py-2 font-bold text-xs uppercase border-4 border-black ${
                  activeFilter === 'halal' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                HALAL ONLY
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Symbol</th>
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Name</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Price</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Change</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Debt Ratio</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Halal Revenue</th>
                  <th className="text-center font-bold uppercase text-xs py-3 px-4">Rating</th>
                  <th className="text-center font-bold uppercase text-xs py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr key={index} className="border-b-2 border-black hover:bg-black hover:text-white">
                    <td className="py-4 px-4 font-bold">{stock.symbol}</td>
                    <td className="py-4 px-4">{stock.name}</td>
                    <td className="py-4 px-4 text-right font-bold">{currency} {stock.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold">
                      {stock.change > 0 ? '+' : ''}{stock.change}%
                    </td>
                    <td className="py-4 px-4 text-right">{stock.debt_ratio}%</td>
                    <td className="py-4 px-4 text-right">{stock.halal_revenue}%</td>
                    <td className="py-4 px-4 text-center font-bold">{stock.rating}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 font-bold text-xs border-2 border-black ${
                        stock.shariah_compliant ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {stock.shariah_compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
  );
}
