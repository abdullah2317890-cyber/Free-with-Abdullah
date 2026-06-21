/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { Share2, Copy, Users, Sparkles, Check, Gift, ArrowRight } from 'lucide-react';

interface ReferralTabProps {
  user: User;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  onAddTransaction: (tx: Transaction) => void;
}

export default function ReferralTab({ user, onUpdateUser, onAddTransaction }: ReferralTabProps) {
  const [copied, setCopied] = useState(false);
  const [simName, setSimName] = useState('');
  const [simPhone, setSimPhone] = useState('');
  const [feedback, setFeedback] = useState('');

  // unique referral code based on base64/hex of emailOrPhone
  const referralCode = btoa(user.emailOrPhone).substring(0, 8);
  const referralLink = `${window.location.protocol}//${window.location.host}?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateReferralInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');

    if (!simName.trim()) {
      setFeedback('Please enter a fake name to simulate a friend.');
      return;
    }
    
    // Simulate a successful friend signup & plan purchase which yields the Rs. 50
    const rewardAmount = 50;
    
    // Update active user state
    onUpdateUser({
      balance: user.balance + rewardAmount,
      referralsCount: (user.referralsCount || 0) + 1,
      referralsEarned: (user.referralsEarned || 0) + rewardAmount,
    });

    // Write referral transaction record
    const refTx: Transaction = {
      id: 'tx-ref-' + Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount: rewardAmount,
      method: 'bank_transfer',
      accountNumber: simPhone.trim() || '03332221110',
      accountTitle: `Referral Bonus: ${simName}`,
      status: 'completed',
      timestamp: Date.now(),
    };
    onAddTransaction(refTx);

    setFeedback(`Success! ${simName} registered and subscribed using your link. You instantly received a Rs. 50 partner commission!`);
    setSimName('');
    setSimPhone('');
  };

  return (
    <div id="referrals-section-container" className="space-y-6 font-sans">
      
      {/* Referral Program Hero Card */}
      <div id="referral-banner" className="bg-gradient-to-br from-[#0d9488] to-[#115e59] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-4">
          <Gift className="w-48 h-48" />
        </div>

        <div className="max-w-2xl">
          <span className="inline-block bg-white/10 text-emerald-300 font-extrabold text-[10px] tracking-widest uppercase border border-white/20 px-2.5 py-1 rounded-full mb-3">
            Earn Rs. 50 Commission per Refer
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Abdullah's Referral Network
          </h2>
          <p className="text-teal-100 text-sm leading-relaxed mb-4">
            Share your unique referral link block with partners, friends, or family groups. Each time a friend signs up under your custom link, you are instantly rewarded a <span className="font-bold underline text-white">Rs. 50 commission</span> sent directly to your deposit balance wallet!
          </p>

          <div id="quick-refer-stats" className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <span className="text-teal-200 text-xs font-semibold block leading-tight">Total Friends Invited</span>
              <span className="text-2xl font-black font-mono block mt-1">{user.referralsCount || 0} Partners</span>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <span className="text-teal-200 text-xs font-semibold block leading-tight">Total Referral Profits</span>
              <span className="text-2xl font-black font-mono text-emerald-300 block mt-1">Rs. {user.referralsEarned || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy link card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2 text-base">
          <Share2 className="text-emerald-600 w-5 h-5" /> Your Custom Referral Credentials
        </h3>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Copy your link below to send to prospects on Whatsapp, Facebook, or Telegram.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center overflow-hidden">
            <span className="text-xs font-mono text-slate-500 truncate select-all">
              {referralLink}
            </span>
          </div>
          
          <button
            id="copy-referral-link-btn"
            type="button"
            onClick={copyLink}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 font-bold" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Custom Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Sandbox referral simulator to let the user play with it */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div id="sim-referral-header" className="flex items-center gap-2 mb-3">
          <Sparkles className="text-emerald-600 w-5 h-5" />
          <h3 className="text-slate-800 font-bold text-base">
            Simulate Brand-Partner Registration
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Test the commissions instantly in your workspace without opening a separate device. Fill out your imaginary friend's name below to simulate them registering and subscribing via your referral link:
        </p>

        {feedback && (
          <div id="simulation-referral-feedback" className="bg-teal-50 border border-teal-100 text-teal-800 p-4 rounded-2xl text-xs font-semibold mb-4 leading-relaxed">
            {feedback}
          </div>
        )}

        <form onSubmit={simulateReferralInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Friend's Name
            </label>
            <input
              id="sim-referral-name"
              type="text"
              required
              placeholder="e.g. Abdullah's friend"
              value={simName}
              onChange={(e) => setSimName(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Friend's Phone (optional)
            </label>
            <input
              id="sim-referral-phone"
              type="text"
              placeholder="e.g. 03413344551"
              value={simPhone}
              onChange={(e) => setSimPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <button
            id="submit-sim-referral-btn"
            type="submit"
            className="w-full flex justify-center items-center gap-1.5 py-2 px-4 shadow-sm text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Simulate Partner Signup <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
