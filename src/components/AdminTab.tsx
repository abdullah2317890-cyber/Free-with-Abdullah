/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Transaction, PackagePlan } from '../types';
import { 
  ShieldCheck, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Check, 
  X, 
  Search, 
  Edit, 
  Settings, 
  RefreshCw, 
  Plus, 
  Minus, 
  Coins, 
  CreditCard,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { renderPaymentLogo } from './WalletTab';

interface AdminTabProps {
  currentUser: User;
  onRefreshSessionUser: () => void;
}

export default function AdminTab({ currentUser, onRefreshSessionUser }: AdminTabProps) {
  // Global States
  const [users, setUsers] = useState<User[]>([]);
  const [globalTransactions, setGlobalTransactions] = useState<Transaction[]>([]);
  
  // Settings Tab states
  const [receiverNumber, setReceiverNumber] = useState('03369917075');
  const [receiverName, setReceiverName] = useState('Deposit Shabnam Nadeem');
  const [minDeposit, setMinDeposit] = useState(200);
  const [minWithdraw, setMinWithdraw] = useState(600);
  const [simAutoApprove, setSimAutoApprove] = useState(false);

  // Search/Filter states
  const [userSearch, setUserSearch] = useState('');
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('pending');
  const [txSearch, setTxSearch] = useState('');
  
  // Tab within Admin Panel
  const [adminView, setAdminView] = useState<'dashboard' | 'payments' | 'users' | 'settings'>('dashboard');

  // Selected User to Edit
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userBalanceDiff, setUserBalanceDiff] = useState('');
  const [userPlanSelect, setUserPlanSelect] = useState<string>('none');
  const [editPassword, setEditPassword] = useState('');

  // Info notification
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load everything
  const loadAdminData = () => {
    // 1. Load users
    const storedUsers = JSON.parse(localStorage.getItem('fwa_registered_users') || '[]');
    const mappedUsers: User[] = storedUsers.map((su: any) => {
      const emailOrPhone = su.emailOrPhone;
      return {
        id: emailOrPhone,
        emailOrPhone,
        name: su.name || 'FWA Partner',
        balance: Number(localStorage.getItem(`fwa_balance_${emailOrPhone}`) || '0'),
        activePlanId: localStorage.getItem(`fwa_plan_${emailOrPhone}`),
        adWatchedToday: localStorage.getItem(`fwa_ad_watched_${emailOrPhone}`) === 'true',
        claimsCount: Number(localStorage.getItem(`fwa_claims_${emailOrPhone}`) || '0'),
        referralsCount: Number(localStorage.getItem(`fwa_ref_count_${emailOrPhone}`) || '0'),
        referralsEarned: Number(localStorage.getItem(`fwa_ref_earned_${emailOrPhone}`) || '0'),
        createdAt: su.createdAt || new Date().toISOString(),
      };
    });
    setUsers(mappedUsers);

    // 2. Load global transactions
    // Since historically transactions were stored only on per-user basis, we aggregate them as backup or use global file
    let aggregatedTxs: Transaction[] = JSON.parse(localStorage.getItem('fwa_global_transactions') || '[]');
    
    if (aggregatedTxs.length === 0) {
      // Aggregate from existing users as a fallback migration
      mappedUsers.forEach((u) => {
        const userTxs = JSON.parse(localStorage.getItem(`fwa_txs_${u.emailOrPhone}`) || '[]');
        userTxs.forEach((utx: any) => {
          if (!aggregatedTxs.some((atx) => atx.id === utx.id)) {
            aggregatedTxs.push({ ...utx, userEmailOrPhone: u.emailOrPhone });
          }
        });
      });
      // Sort desc by timestamp
      aggregatedTxs.sort((a, b) => b.timestamp - a.timestamp);
      localStorage.setItem('fwa_global_transactions', JSON.stringify(aggregatedTxs));
    }
    
    setGlobalTransactions(aggregatedTxs);

    // 3. Load general configuration
    const config = JSON.parse(localStorage.getItem('fwa_platform_config') || '{}');
    if (config.receiverNumber) setReceiverNumber(config.receiverNumber);
    if (config.receiverName) setReceiverName(config.receiverName);
    if (config.minDeposit !== undefined) setMinDeposit(config.minDeposit);
    if (config.minWithdraw !== undefined) setMinWithdraw(config.minWithdraw);
    if (config.simAutoApprove !== undefined) setSimAutoApprove(config.simAutoApprove);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  // Transaction Actions
  const handleApproveTransaction = (tx: Transaction) => {
    const userEmail = tx.userEmailOrPhone || '';
    if (!userEmail) {
      triggerToast('No user linked to this transaction', 'error');
      return;
    }

    // 1. Update in globally tracked list
    const updatedGlobal = globalTransactions.map((gt) => {
      if (gt.id === tx.id) {
        return { ...gt, status: 'completed' as const };
      }
      return gt;
    });
    setGlobalTransactions(updatedGlobal);
    localStorage.setItem('fwa_global_transactions', JSON.stringify(updatedGlobal));

    // 2. Update user's personal list
    const userTxs: Transaction[] = JSON.parse(localStorage.getItem(`fwa_txs_${userEmail}`) || '[]');
    const updatedUserTxs = userTxs.map((utx) => {
      if (utx.id === tx.id) {
        return { ...utx, status: 'completed' as const };
      }
      return utx;
    });
    localStorage.setItem(`fwa_txs_${userEmail}`, JSON.stringify(updatedUserTxs));

    // 3. Balance effects
    if (tx.type === 'deposit') {
      const currentBal = Number(localStorage.getItem(`fwa_balance_${userEmail}`) || '0');
      const newBal = currentBal + tx.amount;
      localStorage.setItem(`fwa_balance_${userEmail}`, newBal.toString());
      
      // Send dynamic referral commission to referrer if there was a referrer for this user
      // 15% commission on deposit
      const referrerCode = localStorage.getItem(`fwa_referred_by_${userEmail}`);
      if (referrerCode) {
        const referralBonus = Math.floor(tx.amount * 0.15);
        const referrerBal = Number(localStorage.getItem(`fwa_balance_${referrerCode}`) || '0');
        localStorage.setItem(`fwa_balance_${referrerCode}`, (referrerBal + referralBonus).toString());
        
        const refComm = Number(localStorage.getItem(`fwa_ref_earned_${referrerCode}`) || '0');
        localStorage.setItem(`fwa_ref_earned_${referrerCode}`, (refComm + referralBonus).toString());

        // Log referrer deposit commission transaction
        const refTx: Transaction = {
          id: 'tx-ref-dep-' + Math.random().toString(36).substring(2, 9),
          type: 'deposit',
          amount: referralBonus,
          method: 'bank_transfer',
          accountNumber: 'OMG10_REFERRAL_COMMISSION',
          accountTitle: `Deposit Referral: ${userEmail}`,
          status: 'completed',
          timestamp: Date.now(),
          userEmailOrPhone: referrerCode
        };
        const refTxsUser: Transaction[] = JSON.parse(localStorage.getItem(`fwa_txs_${referrerCode}`) || '[]');
        localStorage.setItem(`fwa_txs_${referrerCode}`, JSON.stringify([refTx, ...refTxsUser]));

        // Add to global
        const oldGlobal = JSON.parse(localStorage.getItem('fwa_global_transactions') || '[]');
        localStorage.setItem('fwa_global_transactions', JSON.stringify([refTx, ...oldGlobal]));
      }
    }
    // If it was withdrawal, the balance was already deducted during submitting. So we don't deduct again

    triggerToast(`Approved Rs. ${tx.amount} request successfully! Balances sync complete.`);
    loadAdminData();
    onRefreshSessionUser();
  };

  const handleRejectTransaction = (tx: Transaction) => {
    const userEmail = tx.userEmailOrPhone || '';
    if (!userEmail) {
      triggerToast('No user linked to this transaction', 'error');
      return;
    }

    // 1. Update global store
    const updatedGlobal = globalTransactions.map((gt) => {
      if (gt.id === tx.id) {
        return { ...gt, status: 'rejected' as const };
      }
      return gt;
    });
    setGlobalTransactions(updatedGlobal);
    localStorage.setItem('fwa_global_transactions', JSON.stringify(updatedGlobal));

    // 2. Update user's personal store
    const userTxs: Transaction[] = JSON.parse(localStorage.getItem(`fwa_txs_${userEmail}`) || '[]');
    const updatedUserTxs = userTxs.map((utx) => {
      if (utx.id === tx.id) {
        return { ...utx, status: 'rejected' as const };
      }
      return utx;
    });
    localStorage.setItem(`fwa_txs_${userEmail}`, JSON.stringify(updatedUserTxs));

    // 3. Reversal if it was a withdrawal
    if (tx.type === 'withdrawal') {
      const currentBal = Number(localStorage.getItem(`fwa_balance_${userEmail}`) || '0');
      const refundedBal = currentBal + tx.amount;
      localStorage.setItem(`fwa_balance_${userEmail}`, refundedBal.toString());
    }

    triggerToast(`Rejected payment request! Reversal executed.`);
    loadAdminData();
    onRefreshSessionUser();
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      receiverNumber,
      receiverName,
      minDeposit,
      minWithdraw,
      simAutoApprove
    };
    localStorage.setItem('fwa_platform_config', JSON.stringify(config));
    triggerToast('Platform parameters successfully registered and synchronized.');
  };

  // User details save
  const handleSaveUserEdit = () => {
    if (!editingUser) return;
    const email = editingUser.emailOrPhone;

    // Apply balance adjustment
    if (userBalanceDiff.trim() !== '') {
      const amountDiff = Number(userBalanceDiff);
      if (!isNaN(amountDiff)) {
        const curBal = Number(localStorage.getItem(`fwa_balance_${email}`) || '0');
        localStorage.setItem(`fwa_balance_${email}`, (curBal + amountDiff).toString());
      }
    }

    // Apply active plan changes
    if (userPlanSelect !== 'no-change') {
      if (userPlanSelect === 'clear') {
        localStorage.removeItem(`fwa_plan_${email}`);
      } else {
        localStorage.setItem(`fwa_plan_${email}`, userPlanSelect);
      }
    }

    // Apply password adjustment
    if (editPassword.trim() !== '') {
      const storedUsers = JSON.parse(localStorage.getItem('fwa_registered_users') || '[]');
      const updatedCreds = storedUsers.map((su: any) => {
        if (su.emailOrPhone.toLowerCase() === email.toLowerCase()) {
          return { ...su, password: editPassword };
        }
        return su;
      });
      localStorage.setItem('fwa_registered_users', JSON.stringify(updatedCreds));
    }

    // Clear and reload
    setEditingUser(null);
    setUserBalanceDiff('');
    setUserPlanSelect('no-change');
    setEditPassword('');
    triggerToast(`User specifications updated: ${email}`);
    loadAdminData();
    onRefreshSessionUser();
  };

  // System Wide Calculations
  const totalBalances = users.reduce((acc, u) => acc + u.balance, 0);
  const pendingDeposits = globalTransactions.filter((tx) => tx.type === 'deposit' && tx.status === 'pending');
  const pendingWithdrawals = globalTransactions.filter((tx) => tx.type === 'withdrawal' && tx.status === 'pending');
  
  const totalPendingDepositsVal = pendingDeposits.reduce((acc, tx) => acc + tx.amount, 0);
  const totalPendingWithdrawalsVal = pendingWithdrawals.reduce((acc, tx) => acc + tx.amount, 0);

  // Search Results Filters
  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.emailOrPhone.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTxs = globalTransactions.filter((tx) => {
    const matchesFilter = txFilter === 'all' || tx.status === txFilter;
    const searchString = txSearch.toLowerCase();
    const matchesSearch = 
      (tx.accountNumber && tx.accountNumber.toLowerCase().includes(searchString)) ||
      (tx.accountTitle && tx.accountTitle.toLowerCase().includes(searchString)) ||
      (tx.id && tx.id.toLowerCase().includes(searchString)) ||
      (tx.userEmailOrPhone && tx.userEmailOrPhone.toLowerCase().includes(searchString));
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="admin-workspace-view" className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-800 animate-slide-up mb-12">
      
      {/* Toast Notification */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 py-3 px-4 rounded-xl shadow-lg border text-xs font-bold animate-bounce ${
          msg.type === 'success' ? 'bg-emerald-800 text-emerald-100 border-emerald-600' : 'bg-rose-900 text-rose-100 border-rose-600'
        }`}>
          <span>{msg.text}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-rose-500 p-2.5 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Abdullah Command Center</h2>
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/70 py-1 px-2.5 rounded-lg border border-amber-900">
                ACTIVE ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage deposits, withdrawal approvals, users ledger and system states.</p>
          </div>
        </div>

        {/* Inner Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-950 rounded-xl p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setAdminView('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminView === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stats & KPIs
          </button>
          <button
            type="button"
            onClick={() => setAdminView('payments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 relative ${
              adminView === 'payments' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Payments
            {(pendingDeposits.length + pendingWithdrawals.length) > 0 && (
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setAdminView('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminView === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Users Ledger
          </button>
          <button
            type="button"
            onClick={() => setAdminView('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminView === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parameters
          </button>
        </div>
      </div>

      {/* DASHBOARD STATS VIEW */}
      {adminView === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Estimated Liability</span>
                <p className="text-xl font-bold tracking-tight text-white mt-1">Rs. {totalBalances.toLocaleString()}</p>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" /> Active Customers: {users.length}
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pending Deposits</span>
                <p className="text-xl font-bold tracking-tight text-emerald-400 mt-1">Rs. {totalPendingDepositsVal.toLocaleString()}</p>
              </div>
              <div className="text-[10px] text-emerald-500 mt-2 flex items-center justify-between">
                <span>{pendingDeposits.length} Requests pending</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pending Withdrawals</span>
                <p className="text-xl font-bold tracking-tight text-rose-400 mt-1">Rs. {totalPendingWithdrawalsVal.toLocaleString()}</p>
              </div>
              <div className="text-[10px] text-rose-500 mt-2 flex items-center justify-between">
                <span>{pendingWithdrawals.length} Requests pending</span>
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Claim Activities</span>
                <p className="text-xl font-bold tracking-tight text-blue-400 mt-1">
                  {users.reduce((acc, u) => acc + u.claimsCount, 0)} Total
                </p>
              </div>
              <div className="text-[10px] text-blue-500 mt-2">
                Across all verified partners
              </div>
            </div>

          </div>

          {/* Quick Tasks Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Pending Deposits Alert Queue</h3>
              {pendingDeposits.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-600">No deposit requests waiting currently.</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pendingDeposits.slice(0, 5).map((d) => (
                    <div key={d.id} className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800/80 rounded-xl text-xs">
                      <div>
                        <p className="font-bold text-white">{d.userEmailOrPhone}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{d.method} · Account: {d.accountTitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-emerald-400">Rs {d.amount}</span>
                        <button
                          type="button"
                          onClick={() => handleApproveTransaction(d)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingDeposits.length > 5 && (
                    <button 
                      type="button" 
                      onClick={() => setAdminView('payments')} 
                      className="text-[11px] text-amber-400 hover:underline w-full text-center py-1 mt-1 block"
                    >
                      View all {pendingDeposits.length} pending deposits
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Pending Withdrawals Queue</h3>
              {pendingWithdrawals.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-600">No withdrawals pending. All processed.</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pendingWithdrawals.slice(0, 5).map((w) => (
                    <div key={w.id} className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800/80 rounded-xl text-xs">
                      <div>
                        <p className="font-bold text-white">{w.userEmailOrPhone}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{w.method} · Title: {w.accountTitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-rose-400">Rs {w.amount}</span>
                        <button
                          type="button"
                          onClick={() => handleApproveTransaction(w)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingWithdrawals.length > 5 && (
                    <button 
                      type="button" 
                      onClick={() => setAdminView('payments')} 
                      className="text-[11px] text-rose-400 hover:underline w-full text-center py-1 mt-1 block"
                    >
                      View all {pendingWithdrawals.length} pending withdrawals
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* PAYMENTS REVIEW CONTROLLER */}
      {adminView === 'payments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              {(['pending', 'completed', 'rejected', 'all'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTxFilter(opt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    txFilter === opt ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                id="tx-search-field"
                type="text"
                placeholder="Search tx title, number, user..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="w-full sm:w-60 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {filteredTxs.length === 0 ? (
            <div className="bg-slate-950 p-12 text-center rounded-2xl border border-slate-850">
              <span className="text-xs text-slate-500">No payment records match current criteria.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTxs.map((tx) => (
                <div key={tx.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    {renderPaymentLogo(tx.method, 'w-11 h-11')}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase py-0.5 px-2 rounded-md ${
                          tx.type === 'deposit' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-900/60' : 'bg-amber-950/80 text-amber-300 border border-amber-900/60'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">ID: {tx.id}</span>
                        <span className="text-[10px] text-slate-400">({new Date(tx.timestamp).toLocaleString()})</span>
                      </div>
                      
                      <div className="text-xs text-slate-300">
                        Requested by: <strong className="font-bold text-white font-mono">{tx.userEmailOrPhone}</strong>
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Account Number: <strong className="text-slate-200 font-mono">{tx.accountNumber}</strong></span>
                        <span>Title: <strong className="text-slate-200">{tx.accountTitle}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-900 md:border-0 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-white">Rs. {tx.amount.toLocaleString()}</div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize block mt-0.5 ${
                        tx.status === 'completed' ? 'bg-emerald-900/80 text-emerald-200' :
                        tx.status === 'rejected' ? 'bg-rose-950/80 text-rose-300' : 'bg-amber-900/80 text-amber-200 animate-pulse'
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    {tx.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApproveTransaction(tx)}
                          className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 hover:scale-105 active:scale-95 duration-100 p-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-emerald-500/30"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectTransaction(tx)}
                          className="bg-rose-950 hover:bg-rose-900 text-rose-300 duration-100 p-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-rose-800/40"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS MANAGEMENT MATRIX */}
      {adminView === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <input
                id="user-search-field"
                type="text"
                placeholder="Search users by name, contact, phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Found: {filteredUsers.length}</span>
          </div>

          {/* Users Table */}
          <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-855 text-slate-400 select-none">
                  <th className="py-3.5 px-4 font-bold">User Principal</th>
                  <th className="py-3.5 px-4 font-bold">Balance</th>
                  <th className="py-3.5 px-4 font-bold">Active package</th>
                  <th className="py-3.5 px-4 font-bold">Stats</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {u.name}
                        {u.emailOrPhone === 'Abdullah@231' && (
                          <span className="bg-amber-600/20 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded text-[8px] font-black uppercase">Root</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-tight">{u.emailOrPhone}</div>
                      <p className="text-[9px] text-slate-600 mt-0.5">Member since: {new Date(u.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-3 px-4 font-bold font-mono text-emerald-400">
                      Rs. {u.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-300">
                      {u.activePlanId ? (
                        <span className="bg-indigo-950/80 text-indigo-300 px-2.5 py-0.5 rounded-lg border border-indigo-900/40 font-mono text-[10px] uppercase">
                          {u.activePlanId.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-slate-500 select-none">No active plan</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <div className="text-[10px]">Claims: <span className="font-bold font-mono text-slate-200">{u.claimsCount}</span></div>
                      <div className="text-[10px]">Referrals: <span className="font-bold font-mono text-slate-200">{u.referralsCount}</span> <span className="text-emerald-500">(Earned Rs. {u.referralsEarned})</span></div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setUserPlanSelect(u.activePlanId || 'clear');
                        }}
                        className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Editor Modal Popup Form */}
          {editingUser && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 animate-slide-up text-slate-200 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Adjust User Profile Specs</h3>
                    <p className="text-[11px] text-slate-400">Editing parameters for {editingUser.emailOrPhone}</p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  
                  {/* Balance adjuster */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Adjust Wallet Balance
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <Coins className="w-4 h-4 text-emerald-500" />
                      <input
                        id="bal-diff-field"
                        type="number"
                        placeholder="e.g. +500 to add, -300 to deduct"
                        value={userBalanceDiff}
                        onChange={(e) => setUserBalanceDiff(e.target.value)}
                        className="bg-transparent text-sm text-white focus:outline-none flex-1 font-mono"
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 block leading-tight">
                      Current balance: <strong className="text-emerald-500">Rs. {editingUser.balance}</strong>
                    </span>
                  </div>

                  {/* Assign Plan */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Override Plan Association
                    </label>
                    <select
                      id="plan-select-dropdown"
                      value={userPlanSelect}
                      onChange={(e) => setUserPlanSelect(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="no-change">-- Keep Unchanged --</option>
                      <option value="clear">Assign Plan: None / No Active package</option>
                      <option value="iron">Iron Plan (Price: 500 Rs, Profit: 50 Rs/day)</option>
                      <option value="bronze">Bronze Plan (Price: 1000 Rs, Profit: 100 Rs/day)</option>
                      <option value="silver">Silver Plan (Price: 2000 Rs, Profit: 200 Rs/day)</option>
                      <option value="gold">Gold Plan (Price: 5000 Rs, Profit: 500 Rs/day)</option>
                      <option value="platinum">Platinum Plan (Price: 10000 Rs, Profit: 1000 Rs/day)</option>
                      <option value="diamond">Diamond Plan (Price: 20000 Rs, Profit: 2100 Rs/day)</option>
                      <option value="crown">Crown VIP Plan (Price: 35000 Rs, Profit: 3800 Rs/day)</option>
                      <option value="royal">Royal VIP Plan (Price: 50000 Rs, Profit: 5600 Rs/day)</option>
                      <option value="prestige">Prestige Plan (Price: 75000 Rs, Profit: 8500 Rs/day)</option>
                      <option value="apex">Apex Super VIP Plan (Price: 100000 Rs, Profit: 12000 Rs/day)</option>
                    </select>
                  </div>

                  {/* Override Password */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Overwrite Account Password
                    </label>
                    <input
                      id="pass-override-field"
                      type="text"
                      placeholder="Enter new raw password to override"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2.5">
                    <button
                      type="button"
                      onClick={handleSaveUserEdit}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-bold text-xs pointer duration-150 transition-all text-center"
                    >
                      Apply Adjusted Specifications
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Dismiss
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLATFORM CONFIG SETTINGS CONTROLLER */}
      {adminView === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
          
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
            <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5 mb-1">
              <Settings className="w-4 h-4" /> Global Payment Gateways Configurator
            </h3>
            
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Updating these fields reflects everywhere in the client-side screens immediately, including minimum dynamic bounds and recipient metadata cards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 select-none">
                  Receiver Phone Number (Active)
                </label>
                <input
                  id="config-receiver-number"
                  type="text"
                  required
                  value={receiverNumber}
                  onChange={(e) => setReceiverNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl py-2 px-3 font-mono text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 select-none">
                  Receiver Account Title Name
                </label>
                <input
                  id="config-receiver-name"
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl py-2 px-3 font-sans text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 select-none">
                  Minimum Deposit Limit (Rs.)
                </label>
                <input
                  id="config-min-deposit"
                  type="number"
                  required
                  min={1}
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl py-2 px-3 font-mono text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 select-none">
                  Minimum Withdrawal Limit (Rs.)
                </label>
                <input
                  id="config-min-withdraw"
                  type="number"
                  required
                  min={1}
                  value={minWithdraw}
                  onChange={(e) => setMinWithdraw(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl py-2 px-3 font-mono text-white text-xs"
                />
              </div>
            </div>

            {/* Test Simulation Modes */}
            <div className="border-t border-slate-900 pt-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">System Simulation Automation</p>
                <p className="text-[10px] text-slate-500">When enabled, any payment requests made by users will bypass review pending queue and auto-approve inside 5 seconds automatically.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-automation-checkbox"
                  type="checkbox"
                  checked={simAutoApprove}
                  onChange={(e) => setSimAutoApprove(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white" />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              id="save-config-btn"
              type="submit"
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 active:scale-95 duration-100 transition-all font-bold text-xs text-slate-950 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply Dynamic Settings Configuration</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
