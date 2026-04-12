export const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Types ──────────────────────────────────────────────────

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  market_cap: string;
  shariah: boolean;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface WalletSummary {
  cash_balance: number;
  token_balance: number;
  currency: string;
  token_symbol: string;
  transactions_count: number;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  timestamp: string;
}

export interface CuratedPortfolio {
  id: string;
  name: string;
  description: string;
  min_investment: number;
  expected_return: string;
  risk_level: string;
  stocks: string[];
  holdings: string[];
  compliance: string;
}

export interface ShariahStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  compliant: boolean;
  shariah_compliant: boolean;
  sector: string;
  debt_ratio: number;
  halal_revenue: number;
  rating: string;
}

export interface Policy {
  id: string;
  name: string;
  policy_type: string;
  type: string;
  rules: string[];
  status: 'active' | 'inactive';
  performance: string;
  last_modified: string;
  created_at: string;
}

// ─── API functions ──────────────────────────────────────────

export function getStocks() {
  return apiFetch('/stocks');
}

export function getWatchlist() {
  return apiFetch('/watchlist');
}

export function getWallet(): Promise<WalletSummary> {
  return apiFetch('/wallet');
}

export function getWalletTransactions() {
  return apiFetch('/wallet/transactions');
}

export function topUpWallet(amount: number, description: string) {
  return apiFetch('/wallet/topup', {
    method: 'POST',
    body: JSON.stringify({ amount, description }),
  });
}

export function executeTrade(symbol: string, action: 'buy' | 'sell', quantity: number) {
  return apiFetch('/trade', {
    method: 'POST',
    body: JSON.stringify({ symbol, action, quantity }),
  });
}

export function getCuratedPortfolios() {
  return apiFetch('/investments/portfolios');
}

export function getShariahScreener(halalOnly: boolean) {
  return apiFetch(`/investments/screener?halal_only=${halalOnly}`);
}

export function investInPortfolio(portfolioId: string, amount: number) {
  return apiFetch('/investments/invest', {
    method: 'POST',
    body: JSON.stringify({ portfolio_id: portfolioId, amount }),
  });
}

export function getPolicies() {
  return apiFetch('/policies');
}

export function createPolicy(data: { name: string; policy_type: string; rules: string[] }) {
  return apiFetch('/policies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function togglePolicy(policyId: string) {
  return apiFetch(`/policies/${policyId}/toggle`, { method: 'PATCH' });
}

export function deletePolicy(policyId: string) {
  return apiFetch(`/policies/${policyId}`, { method: 'DELETE' });
}
