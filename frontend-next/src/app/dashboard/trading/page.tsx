'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeTrade, getStocks, getWallet, getWatchlist, Stock, topUpWallet, WatchlistItem } from '@/lib/api';

export default function TradingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrading, setIsTrading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [currency, setCurrency] = useState('AED');
  const [tokenSymbol, setTokenSymbol] = useState('TTK');

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unexpected error';

  const goToAnalyze = (symbol: string) => {
    router.push(`/dashboard/analyze?asset=${symbol}`);
  };

  const upcomingIPOs = [
    {
      company: 'TechVision AI',
      symbol: 'TVAI',
      priceRange: 'AED 66-AED 81',
      date: '2026-02-20',
      shares: '15M',
      valuation: 'AED 12.85B',
      description: 'Leading AI infrastructure company'
    },
    {
      company: 'GreenPower Solutions',
      symbol: 'GRPW',
      priceRange: 'AED 92-AED 110',
      date: '2026-02-25',
      shares: '20M',
      valuation: 'AED 19.08B',
      description: 'Renewable energy technology'
    },
    {
      company: 'BioMed Innovations',
      symbol: 'BIOM',
      priceRange: 'AED 117-AED 139',
      date: '2026-03-01',
      shares: '12M',
      valuation: 'AED 17.62B',
      description: 'Biotech research and development'
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [stocksRes, watchlistRes, walletRes] = await Promise.all([getStocks(), getWatchlist(), getWallet()]);
        setStocks(stocksRes.stocks);
        setWatchlist(watchlistRes.watchlist);
        setWalletBalance(walletRes.token_balance);
        setCurrency(walletRes.currency);
        setTokenSymbol(walletRes.token_symbol);
      } catch (error: unknown) {
        alert(`Failed to load trading data: ${getErrorMessage(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) {
      return stocks;
    }
    const query = searchQuery.toLowerCase();
    return stocks.filter(
      (stock) => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  const filteredWatchlist = useMemo(() => {
    if (!searchQuery.trim()) {
      return watchlist;
    }
    const query = searchQuery.toLowerCase();
    return watchlist.filter(
      (stock) => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
    );
  }, [watchlist, searchQuery]);

  const handleTrade = async (symbol: string) => {
    const actionInput = window.prompt('Enter action: BUY or SELL', 'BUY');
    if (!actionInput) {
      return;
    }

    const normalizedAction = actionInput.trim().toLowerCase();
    if (normalizedAction !== 'buy' && normalizedAction !== 'sell') {
      alert('Invalid action. Please enter BUY or SELL.');
      return;
    }

    const quantityInput = window.prompt(`Enter quantity to ${normalizedAction.toUpperCase()} ${symbol}`, '1');
    if (!quantityInput) {
      return;
    }

    const quantity = Number(quantityInput);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert('Quantity must be a positive whole number.');
      return;
    }

    try {
      setIsTrading(true);
      const result = await executeTrade(symbol, normalizedAction as 'buy' | 'sell', quantity);
      setWalletBalance(result.token_balance ?? result.cash_balance);
      if (result.currency) {
        setCurrency(result.currency);
      }
      if (result.token_symbol) {
        setTokenSymbol(result.token_symbol);
      }
      alert(
        `${result.trade.action.toUpperCase()} ${result.trade.quantity} ${result.trade.symbol} @ ${currency} ${result.trade.price.toFixed(2)}\nWallet balance: ${currency} ${(result.token_balance ?? result.cash_balance).toFixed(2)} (${tokenSymbol})`
      );
    } catch (error: unknown) {
      alert(`Trade failed: ${getErrorMessage(error)}`);
    } finally {
      setIsTrading(false);
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
      const result = await topUpWallet(amount, 'Manual top-up from trading page');
      setWalletBalance(result.token_balance);
      setCurrency(result.currency);
      setTokenSymbol(result.token_symbol);
      alert(`Wallet topped up by ${result.currency} ${amount.toFixed(2)}. New balance: ${result.currency} ${result.token_balance.toFixed(2)}`);
    } catch (error: unknown) {
      alert(`Top-up failed: ${getErrorMessage(error)}`);
    }
  };

  return (
    <div className="space-y-6">
        <Card className="p-6 border-4 border-black">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold uppercase">Virtual Wallet</h3>
              <p className="text-sm mt-1">Balance: {currency} {walletBalance.toFixed(2)} ({tokenSymbol})</p>
            </div>
            <Button size="sm" onClick={handleTopUp}>TOP UP</Button>
          </div>
        </Card>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH STOCKS..."
            className="flex-1 px-4 py-3 border-4 border-black font-bold text-sm uppercase placeholder-gray-500 focus:outline-none"
          />
          <Button variant="outline">
            FILTERS
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-black">
          {['stocks', 'ipos', 'watchlist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold uppercase text-sm border-r-4 border-black ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stocks Tab */}
        {activeTab === 'stocks' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Live Market</h2>
            {isLoading && <p className="text-sm font-bold uppercase mb-4">Loading market data...</p>}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-black">
                    <th className="text-left font-bold uppercase text-xs py-3 px-4">Symbol</th>
                    <th className="text-left font-bold uppercase text-xs py-3 px-4">Name</th>
                    <th className="text-right font-bold uppercase text-xs py-3 px-4">Price</th>
                    <th className="text-right font-bold uppercase text-xs py-3 px-4">Change</th>
                    <th className="text-right font-bold uppercase text-xs py-3 px-4">Volume</th>
                    <th className="text-right font-bold uppercase text-xs py-3 px-4">Market Cap</th>
                    <th className="text-center font-bold uppercase text-xs py-3 px-4">Shariah</th>
                    <th className="text-right font-bold uppercase text-xs py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <tr key={index} className="border-b-2 border-black hover:bg-black hover:text-white">
                      <td className="py-4 px-4 font-bold">{stock.symbol}</td>
                      <td className="py-4 px-4">{stock.name}</td>
                      <td className="py-4 px-4 text-right font-bold">{currency} {stock.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-bold">
                        {stock.change > 0 ? '+' : ''}{stock.change}%
                      </td>
                      <td className="py-4 px-4 text-right">{stock.volume}</td>
                      <td className="py-4 px-4 text-right">{stock.market_cap}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 font-bold text-xs border-2 border-black ${stock.shariah ? 'bg-black text-white' : 'bg-white text-black'}`}>
                          {stock.shariah ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={() => goToAnalyze(stock.symbol)}>ANALYZE</Button>
                          <Button size="sm" variant="outline" onClick={() => handleTrade(stock.symbol)} disabled={isTrading}>TRADE</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* IPOs Tab */}
        {activeTab === 'ipos' && (
          <div className="space-y-6">
            <Card className="p-6 border-8 border-black">
              <h3 className="text-xl font-bold uppercase mb-2">Upcoming IPOs</h3>
              <p className="text-sm">AI-POWERED IPO ANALYSIS</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingIPOs.map((ipo, index) => (
                <Card key={index} className="p-6">
                  <div className="space-y-4">
                    <div className="border-b-4 border-black pb-3">
                      <div className="text-xs font-bold uppercase mb-1">{ipo.symbol}</div>
                      <div className="text-xl font-bold">{ipo.company}</div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-bold">PRICE RANGE</span>
                        <span>{ipo.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">DATE</span>
                        <span>{ipo.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">SHARES</span>
                        <span>{ipo.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">VALUATION</span>
                        <span className="font-bold">{ipo.valuation}</span>
                      </div>
                    </div>

                    <div className="border-t-4 border-black pt-3">
                      <p className="text-sm">{ipo.description}</p>
                    </div>

                    <Button className="w-full" onClick={() => alert(`Interest recorded for ${ipo.symbol}. We will notify you before ${ipo.date}.`)}>INDICATE INTEREST</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Your Watchlist</h2>
            <div className="space-y-4">
              {filteredWatchlist.map((stock, index) => (
                <div key={index} className="flex items-center justify-between border-4 border-black p-4">
                  <div>
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-sm">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{currency} {stock.price.toFixed(2)}</div>
                    <div className="text-sm font-bold">
                      {stock.change > 0 ? '+' : ''}{stock.change}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => goToAnalyze(stock.symbol)}>ANALYZE</Button>
                    <Button size="sm" variant="outline" onClick={() => handleTrade(stock.symbol)} disabled={isTrading}>TRADE</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
  );
}
