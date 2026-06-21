/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  emailOrPhone: string;
  name: string;
  balance: number;
  activePlanId: string | null;
  adWatchedToday: boolean;
  claimsCount: number;
  referralsCount: number;
  referralsEarned: number;
  createdAt: string;
  isAdmin?: boolean;
}

export interface PackagePlan {
  id: string;
  name: string;
  price: number;
  dailyProfit: number;
  adLimit: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: 'easypaisa' | 'jazzcash' | 'sadapay' | 'nayapay' | 'opay' | 'bank_transfer';
  accountNumber: string;
  accountTitle: string;
  status: 'completed' | 'pending' | 'rejected';
  txId?: string;
  timestamp: number;
  userEmailOrPhone?: string;
}
