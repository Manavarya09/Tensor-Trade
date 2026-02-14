'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  getWallet,
  getWalletTransactions,
  topUpWallet,
  WalletSummary,
  WalletTransaction,
} from '@/lib/api';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unexpected error';

  const loadWalletData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([getWallet(), getWalletTransactions()]);
      setWallet(walletRes);
      setTransactions(txRes.transactions);
    } catch (error: unknown) {
      alert(`Failed to load wallet: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

      const transactionDate = new Date(transaction.timestamp);
      const matchesFromDate = !fromDate || transactionDate >= new Date(`${fromDate}T00:00:00`);
      const matchesToDate = !toDate || transactionDate <= new Date(`${toDate}T23:59:59`);

      const matchesSearch =
        !normalizedSearch ||
        transaction.description.toLowerCase().includes(normalizedSearch) ||
        transaction.reference.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesFromDate && matchesToDate && matchesSearch;
    });
  }, [transactions, typeFilter, fromDate, toDate, searchQuery]);

  const handleTopUp = async () => {
    const amountInput = window.prompt(
      `Enter ${wallet?.currency ?? 'AED'} amount to add`,
      '10000'
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
      setIsTopUpLoading(true);
      await topUpWallet(amount, 'Wallet page manual top-up');
      await loadWalletData();
      alert(`Wallet credited by ${wallet?.currency ?? 'AED'} ${amount.toFixed(2)}`);
    } catch (error: unknown) {
      alert(`Top-up failed: ${getErrorMessage(error)}`);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-4 border-black p-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase">Virtual Wallet</h2>
          <p className="text-sm mt-1">TOKEN BALANCE, TOP-UP, AND FULL TRANSACTION HISTORY</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadWalletData}>REFRESH</Button>
          <Button size="sm" onClick={handleTopUp} disabled={isTopUpLoading}>
            {isTopUpLoading ? 'PROCESSING...' : 'TOP UP'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-4 border-black">
          <div className="text-xs font-bold uppercase">Wallet Balance</div>
          <div className="text-3xl font-bold mt-2">
            {wallet ? `${wallet.currency} ${wallet.token_balance.toFixed(2)}` : '--'}
          </div>
          <div className="text-xs mt-1 font-bold">{wallet?.token_symbol ?? 'TTK'} TOKENS</div>
        </Card>

        <Card className="p-4 border-4 border-black">
          <div className="text-xs font-bold uppercase">Currency</div>
          <div className="text-3xl font-bold mt-2">{wallet?.currency ?? 'AED'}</div>
          <div className="text-xs mt-1 font-bold">VIRTUAL TRADING CURRENCY</div>
        </Card>

        <Card className="p-4 border-4 border-black">
          <div className="text-xs font-bold uppercase">Transactions</div>
          <div className="text-3xl font-bold mt-2">{wallet?.transactions_count ?? 0}</div>
          <div className="text-xs mt-1 font-bold">TOTAL LEDGER ENTRIES</div>
        </Card>
      </div>

      <Card className="p-6 border-4 border-black">
        <h3 className="text-lg font-bold uppercase mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="SEARCH DESCRIPTION OR REF..."
            className="px-4 py-3 border-4 border-black font-bold text-sm uppercase placeholder-gray-500 focus:outline-none"
          />

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as 'all' | 'credit' | 'debit')}
            className="px-4 py-3 border-4 border-black font-bold text-sm uppercase bg-white focus:outline-none"
          >
            <option value="all">ALL TYPES</option>
            <option value="credit">CREDIT</option>
            <option value="debit">DEBIT</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="px-4 py-3 border-4 border-black font-bold text-sm uppercase focus:outline-none"
          />

          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="px-4 py-3 border-4 border-black font-bold text-sm uppercase focus:outline-none"
          />
        </div>
      </Card>

      <Card className="p-6 border-4 border-black">
        <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Transaction History</h3>

        {loading ? (
          <p className="text-sm font-bold uppercase">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-sm font-bold uppercase">No transactions match the current filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Timestamp</th>
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Type</th>
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Description</th>
                  <th className="text-left font-bold uppercase text-xs py-3 px-4">Reference</th>
                  <th className="text-right font-bold uppercase text-xs py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b-2 border-black hover:bg-black hover:text-white">
                    <td className="py-4 px-4 text-sm font-bold">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 font-bold text-xs border-2 border-black ${
                          transaction.type === 'credit' ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                      >
                        {transaction.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">{transaction.description}</td>
                    <td className="py-4 px-4 text-sm font-bold uppercase">{transaction.reference}</td>
                    <td className="py-4 px-4 text-right font-bold text-sm">
                      {wallet?.currency ?? 'AED'} {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
