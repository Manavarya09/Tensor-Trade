export const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Default user ID used across all API calls
export const DEFAULT_USER_ID = 'dashboard_user';

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
  volume: string;
  market_cap: string;
  shariah: boolean;
  sector: string;
  debt_ratio: number;
  halal_revenue: number;
  rating: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  shariah: boolean;
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
  holdings: string[];
  compliance: string;
}

export interface ShariahStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  shariah_compliant: boolean;
  sector: string;
  debt_ratio: number;
  halal_revenue: number;
  rating: string;
}

export interface Policy {
  id: string;
  name: string;
  type: string;
  policy_type?: string;
  rules: string[];
  status: 'active' | 'inactive';
  performance: string;
  last_modified: string;
  created_at: string;
}

export interface PortfolioSummary {
  total_value: number;
  cash_balance: number;
  wallet_balance: number;
  invested_value: number;
  total_pnl: number;
  total_pnl_percent: number;
  holdings_count: number;
  holdings: PortfolioHolding[];
  currency: string;
  token_symbol: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  pnl: number;
  pnl_percent: number;
  shariah: boolean;
  sector: string;
}

// ─── API functions ──────────────────────────────────────────

export function getStocks() {
  return apiFetch('/api/stocks');
}

export function getWatchlist(userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/watchlist/${userId}`);
}

export function addToWatchlist(symbol: string, userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/watchlist/${userId}/${symbol}`, { method: 'POST' });
}

export function removeFromWatchlist(symbol: string, userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/watchlist/${userId}/${symbol}`, { method: 'DELETE' });
}

export function getWallet(userId = DEFAULT_USER_ID): Promise<WalletSummary> {
  return apiFetch(`/api/wallet/${userId}`);
}

export function getWalletTransactions(userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/wallet/transactions/${userId}`);
}

export function topUpWallet(amount: number, note: string, userId = DEFAULT_USER_ID) {
  return apiFetch('/api/wallet/topup', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, amount, note }),
  });
}

export function executeTrade(
  symbol: string,
  action: 'buy' | 'sell',
  quantity: number,
  userId = DEFAULT_USER_ID,
) {
  return apiFetch('/api/trade', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, symbol, action, quantity }),
  });
}

export function getPortfolio(userId = DEFAULT_USER_ID): Promise<PortfolioSummary> {
  return apiFetch(`/api/portfolio/${userId}`);
}

export function getCuratedPortfolios() {
  return apiFetch('/api/investments/portfolios');
}

export function getShariahScreener(halalOnly: boolean) {
  return apiFetch(`/api/investments/screener?halal_only=${halalOnly}`);
}

export function investInPortfolio(portfolioId: string, amount: number, userId = DEFAULT_USER_ID) {
  return apiFetch('/api/investments/invest', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, portfolio_id: portfolioId, amount }),
  });
}

export function getPolicies(userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/policies/${userId}`);
}

export function createPolicy(
  data: { name: string; policy_type: string; rules: string[] },
  userId = DEFAULT_USER_ID,
) {
  return apiFetch('/api/policies', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, ...data }),
  });
}

// Backend uses POST for toggle
export function togglePolicy(policyId: string, userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/policies/${userId}/${policyId}/toggle`, { method: 'POST' });
}

export function deletePolicy(policyId: string, userId = DEFAULT_USER_ID) {
  return apiFetch(`/api/policies/${userId}/${policyId}`, { method: 'DELETE' });
}
