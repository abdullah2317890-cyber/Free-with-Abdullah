/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Transaction } from './types';
import AuthScreen from './components/AuthScreen';
import WalletTab from './components/WalletTab';
import PackagesTab from './components/PackagesTab';
import AdsTab from './components/AdsTab';
import ReferralTab from './components/ReferralTab';
import ProfileTab from './components/ProfileTab';
import AdminTab from './components/AdminTab';
import Footer from './components/Footer';
import { Sparkles, Power, Users, Landmark, Wallet, Award } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('wallet');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralBonusPending, setReferralBonusPending] = useState(false);

  // Check for login session and ref code on mount
  useEffect(() => {
    const session = localStorage.getItem('fwa_active_session');
    if (session) {
      const parsed = JSON.parse(session);
      // Fetch latest custom fields or defaults from storage
      const storedUsers = JSON.parse(localStorage.getItem('fwa_registered_users') || '[]');
      const storedUserObj = storedUsers.find((u: any) => u.emailOrPhone.toLowerCase() === parsed.emailOrPhone.toLowerCase());
      
      const isAdminUser = parsed.emailOrPhone.toLowerCase() === 'abdullah@231';
      const userData: User = {
        id: parsed.emailOrPhone,
        emailOrPhone: parsed.emailOrPhone,
        name: storedUserObj?.name || parsed.name || 'Abdullah Partner',
        balance: Number(localStorage.getItem(`fwa_balance_${parsed.emailOrPhone}`) || '0'),
        activePlanId: localStorage.getItem(`fwa_plan_${parsed.emailOrPhone}`),
        adWatchedToday: localStorage.getItem(`fwa_ad_watched_${parsed.emailOrPhone}`) === 'true',
        claimsCount: Number(localStorage.getItem(`fwa_claims_${parsed.emailOrPhone}`) || '0'),
        referralsCount: Number(localStorage.getItem(`fwa_ref_count_${parsed.emailOrPhone}`) || '0'),
        referralsEarned: Number(localStorage.getItem(`fwa_ref_earned_${parsed.emailOrPhone}`) || '0'),
        createdAt: storedUserObj?.createdAt || new Date().toISOString(),
        isAdmin: isAdminUser,
      };
      
      setUser(userData);

      // Load user transactions
      const txHistory = JSON.parse(localStorage.getItem(`fwa_txs_${parsed.emailOrPhone}`) || '[]');
      setTransactions(txHistory);
    }

    // Check for landing referral ref url parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref')) {
      setReferralBonusPending(true);
    }
  }, []);

  const handleRefreshCurrentUser = () => {
    if (!user) return;
    const emailOrPhone = user.emailOrPhone;
    const storedUsers = JSON.parse(localStorage.getItem('fwa_registered_users') || '[]');
    const storedUserObj = storedUsers.find((u: any) => u.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase());
    
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        name: storedUserObj?.name || prev.name,
        balance: Number(localStorage.getItem(`fwa_balance_${emailOrPhone}`) || '0'),
        activePlanId: localStorage.getItem(`fwa_plan_${emailOrPhone}`),
        claimsCount: Number(localStorage.getItem(`fwa_claims_${emailOrPhone}`) || '0'),
        referralsCount: Number(localStorage.getItem(`fwa_ref_count_${emailOrPhone}`) || '0'),
        referralsEarned: Number(localStorage.getItem(`fwa_ref_earned_${emailOrPhone}`) || '0'),
      };
    });

    const txHistory = JSON.parse(localStorage.getItem(`fwa_txs_${emailOrPhone}`) || '[]');
    setTransactions(txHistory);
  };

  const handleLoginSuccess = (emailOrPhone: string, name: string) => {
    const sessionObj = { emailOrPhone, name };
    localStorage.setItem('fwa_active_session', JSON.stringify(sessionObj));

    // Prepare state from storage
    const storedBalance = localStorage.getItem(`fwa_balance_${emailOrPhone}`);
    if (storedBalance === null) {
      // First-time signup/login gets Rs. 0 initial, but let them deposit
      localStorage.setItem(`fwa_balance_${emailOrPhone}`, '0');
    }

    const isAdminUser = emailOrPhone.toLowerCase() === 'abdullah@231';
    const userData: User = {
      id: emailOrPhone,
      emailOrPhone,
      name,
      balance: Number(localStorage.getItem(`fwa_balance_${emailOrPhone}`) || '0'),
      activePlanId: localStorage.getItem(`fwa_plan_${emailOrPhone}`),
      adWatchedToday: localStorage.getItem(`fwa_ad_watched_${emailOrPhone}`) === 'true',
      claimsCount: Number(localStorage.getItem(`fwa_claims_${emailOrPhone}`) || '0'),
      referralsCount: Number(localStorage.getItem(`fwa_ref_count_${emailOrPhone}`) || '0'),
      referralsEarned: Number(localStorage.getItem(`fwa_ref_earned_${emailOrPhone}`) || '0'),
      createdAt: new Date().toISOString(),
      isAdmin: isAdminUser,
    };

    setUser(userData);

    const txHistory = JSON.parse(localStorage.getItem(`fwa_txs_${emailOrPhone}`) || '[]');
    setTransactions(txHistory);

    // If they landed with referral link, award referee 50 rupees commission and referrer gets 50 rupees as well
    if (referralBonusPending) {
      const reward = 50;
      setUser((prevUser) => {
        if (!prevUser) return null;
        const rewardBalance = prevUser.balance + reward;
        localStorage.setItem(`fwa_balance_${emailOrPhone}`, rewardBalance.toString());
        return {
          ...prevUser,
          balance: rewardBalance,
          referralsEarned: prevUser.referralsEarned + reward,
        };
      });

      const refTx: Transaction = {
        id: 'tx-ref-welcome-' + Math.random().toString(36).substring(2, 9),
        type: 'deposit',
        amount: reward,
        method: 'bank_transfer',
        accountNumber: 'OMG10_REFERRAL_SYSTEM',
        accountTitle: 'Welcome Referral Commission',
        status: 'completed',
        timestamp: Date.now(),
        userEmailOrPhone: emailOrPhone,
      };

      setTransactions((prev) => {
        const updated = [refTx, ...prev];
        localStorage.setItem(`fwa_txs_${emailOrPhone}`, JSON.stringify(updated));
        // Also save to global transactions
        const globalTxs = JSON.parse(localStorage.getItem('fwa_global_transactions') || '[]');
        localStorage.setItem('fwa_global_transactions', JSON.stringify([refTx, ...globalTxs]));
        return updated;
      });

      setReferralBonusPending(false);
    }
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    if (!user) return;

    setUser((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...updatedFields };

      // Persist state fields to local storage keys
      if (updatedFields.balance !== undefined) {
        localStorage.setItem(`fwa_balance_${user.emailOrPhone}`, nextUser.balance.toString());
      }
      if (updatedFields.activePlanId !== undefined) {
        if (nextUser.activePlanId) {
          localStorage.setItem(`fwa_plan_${user.emailOrPhone}`, nextUser.activePlanId);
        } else {
          localStorage.removeItem(`fwa_plan_${user.emailOrPhone}`);
        }
      }
      if (updatedFields.adWatchedToday !== undefined) {
        localStorage.setItem(`fwa_ad_watched_${user.emailOrPhone}`, nextUser.adWatchedToday ? 'true' : 'false');
      }
      if (updatedFields.claimsCount !== undefined) {
        localStorage.setItem(`fwa_claims_${user.emailOrPhone}`, nextUser.claimsCount.toString());
      }
      if (updatedFields.referralsCount !== undefined) {
        localStorage.setItem(`fwa_ref_count_${user.emailOrPhone}`, nextUser.referralsCount.toString());
      }
      if (updatedFields.referralsEarned !== undefined) {
        localStorage.setItem(`fwa_ref_earned_${user.emailOrPhone}`, nextUser.referralsEarned.toString());
      }

      return nextUser;
    });
  };

  const handleAddTransaction = (newTx: Transaction) => {
    if (!user) return;
    const txWithUser = { ...newTx, userEmailOrPhone: user.emailOrPhone };
    setTransactions((prev) => {
      const updated = [txWithUser, ...prev];
      localStorage.setItem(`fwa_txs_${user.emailOrPhone}`, JSON.stringify(updated));
      return updated;
    });

    // Also push to global transaction store
    const globalTxs = JSON.parse(localStorage.getItem('fwa_global_transactions') || '[]');
    localStorage.setItem('fwa_global_transactions', JSON.stringify([txWithUser, ...globalTxs]));
  };

  const handleUpdateTransaction = (txId: string, updatedFields: Partial<Transaction>) => {
    if (!user) return;
    setTransactions((prev) => {
      const updated = prev.map((tx) => (tx.id === txId ? { ...tx, ...updatedFields } : tx));
      localStorage.setItem(`fwa_txs_${user.emailOrPhone}`, JSON.stringify(updated));
      return updated;
    });

    // Update in global transactions too
    const globalTxs: Transaction[] = JSON.parse(localStorage.getItem('fwa_global_transactions') || '[]');
    const updatedGlobal = globalTxs.map((tx) => (tx.id === txId ? { ...tx, ...updatedFields } : tx));
    localStorage.setItem('fwa_global_transactions', JSON.stringify(updatedGlobal));
  };

  const handleLogoutReset = () => {
    // Clear session but preserve registrations so user can easily log back in with same credentials
    localStorage.removeItem('fwa_active_session');
    setUser(null);
    setActiveTab('wallet');
  };

  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-inner flex items-center justify-center">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                Free With Abdullah
              </h1>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mt-0.5">
                Earner Engine Portal
              </span>
            </div>
          </div>

          {/* Mini Info Panel & Sign Out */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <div className="text-right hidden sm:block">
              <span className="text-slate-400 font-bold block text-[10px] leading-tight select-none">Welcome back,</span>
              <span className="text-slate-800 font-bold">{user.name}</span>
            </div>

            <button
              id="header-signout-btn"
              type="button"
              onClick={handleLogoutReset}
              title="Sign Out of Session"
              className="p-2 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-500 hover:text-slate-900 cursor-pointer flex items-center justify-center gap-1"
            >
              <Power className="w-4 h-4 text-rose-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Switch tabs views */}
        {activeTab === 'wallet' && (
          <WalletTab
            user={user}
            onUpdateUser={handleUpdateUser}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesTab
            user={user}
            onUpdateUser={handleUpdateUser}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {activeTab === 'ads' && (
          <AdsTab
            user={user}
            onUpdateUser={handleUpdateUser}
            onSwitchTab={(tab) => setActiveTab(tab)}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {activeTab === 'referrals' && (
          <ReferralTab
            user={user}
            onUpdateUser={handleUpdateUser}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            onUpdateUser={handleUpdateUser}
            onClearSession={handleLogoutReset}
          />
        )}

        {activeTab === 'admin' && user.isAdmin && (
          <AdminTab
            currentUser={user}
            onRefreshSessionUser={handleRefreshCurrentUser}
          />
        )}

      </main>

      {/* Footer tab bar stickened */}
      <Footer activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} user={user} />

    </div>
  );
}
