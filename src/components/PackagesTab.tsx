/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PackagePlan, User } from '../types';
import { packagePlans } from '../plansData';
import { Sparkles, CheckCircle, Flame, BadgeAlert, ArrowUpRight, Check, Rocket } from 'lucide-react';

interface PackagesTabProps {
  user: User;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  onAddTransaction: (tx: any) => void;
}

export default function PackagesTab({ user, onUpdateUser, onAddTransaction }: PackagesTabProps) {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentPlan = packagePlans.find((p) => p.id === user.activePlanId);

  const handlePurchase = (plan: PackagePlan) => {
    setSuccessMsg('');
    setErrorMsg('');

    if (user.activePlanId === plan.id) {
      setErrorMsg(`You are already subscribed to the ${plan.name}.`);
      return;
    }

    if (user.balance < plan.price) {
      setErrorMsg(`Insufficient wallet balance. You need Rs. ${plan.price - user.balance} more to buy this plan. Please deposit money in the Wallet section first.`);
      return;
    }

    // Deduct price and set plan
    const updatedBalance = user.balance - plan.price;
    onUpdateUser({
      balance: updatedBalance,
      activePlanId: plan.id,
      adWatchedToday: false, // reset so they can watch today's ad if they upgraded!
    });

    // Create a virtual transaction for purchase logging
    const purchaseTx = {
      id: 'tx-buy-' + Math.random().toString(36).substring(2, 9),
      type: 'withdrawal',
      amount: plan.price,
      method: 'bank_transfer', // direct account deduction representing internal txn
      accountNumber: 'INTERNAL_WALLET',
      accountTitle: `Subscription: ${plan.name}`,
      status: 'completed',
      timestamp: Date.now(),
    };
    onAddTransaction(purchaseTx);

    setSuccessMsg(`Plan Purchased! Congratulations, you successfully subscribed to ${plan.name}. Daily profit Rs. ${plan.dailyProfit} is unlocked via Ads!`);
  };

  return (
    <div id="packages-section-container" className="space-y-6 font-sans">
      
      {/* Intro section */}
      <div id="packages-hero-header" className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none -translate-y-5">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="max-w-2xl">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 font-extrabold text-[10px] tracking-widest uppercase border border-emerald-500/20 px-2.5 py-1 rounded-full mb-3">
            Abdullah High Yield Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Pick Your Perfect Earning Engine
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Select one of the 10 flexible earnings plans. Your subscription directly influences the profits credited when completing daily micro-ad tasks. Higher tier packages yield massive scaling returns!
          </p>
          
          {currentPlan ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 py-2 px-4 rounded-2xl text-xs font-bold font-mono">
              <Check className="w-4 h-4 font-extrabold text-emerald-400" />
              CURRENTLY ACTIVE: {currentPlan.name} (Rs. {currentPlan.dailyProfit}/day)
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 py-2 px-4 rounded-2xl text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-400" />
              You currently have no active package. Choose Plan 1 or Plan 2 below to unlock earnings!
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div id="package-success" className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-sm font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div id="package-error" className="bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl p-4 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packagePlans.map((plan, index) => {
          const isActive = user.activePlanId === plan.id;
          const isAffordable = user.balance >= plan.price;
          
          // Custom styles depending on plan tiers to establish visual variation
          let cardBg = "bg-white border-slate-100 hover:border-slate-200";
          let badgeTheme = "bg-slate-100 text-slate-700";
          let priceColor = "text-slate-900";
          let buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer";

          if (index === 0) {
            badgeTheme = "bg-[#22c55e]/10 text-emerald-700";
          } else if (index === 1) {
            badgeTheme = "bg-sky-50 text-sky-700";
          } else if (index >= 2 && index <= 4) {
            badgeTheme = "bg-amber-100 text-amber-800";
          } else if (index >= 5 && index <= 8) {
            // Highly visual Premium packages
            cardBg = "bg-gradient-to-b from-white to-slate-50 border-emerald-100/70 hover:border-emerald-300/80 shadow-md shadow-slate-100";
            badgeTheme = "bg-emerald-100 text-emerald-800 font-extrabold";
            priceColor = "text-emerald-900";
          } else if (index === 9) {
            // Plan 10: Premium King!
            cardBg = "bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40 shadow-xl text-white";
            badgeTheme = "bg-emerald-500 text-black font-black";
            priceColor = "text-emerald-400";
            buttonClass = "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold cursor-pointer";
          }

          return (
            <div
              id={`package-plan-${plan.id}`}
              key={plan.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${cardBg} ${
                isActive ? 'ring-3 ring-emerald-500/80' : ''
              }`}
            >
              <div>
                <div id="plan-card-upper" className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeTheme}`}>
                    PLAN {index + 1}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 bg-emerald-500 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full animate-bounce">
                      Active
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-extrabold ${index === 9 ? 'text-white' : 'text-slate-800'} tracking-tight mb-2`}>
                  {plan.name}
                </h3>

                <div id="plan-pricing" className="border-t border-b border-slate-100/50 my-3 py-3 flex justify-between items-baseline">
                  <span className={`${index === 9 ? 'text-slate-400' : 'text-slate-500'} text-xs font-semibold`}>Price:</span>
                  <div className="text-right">
                    <span className={`text-2xl font-black ${priceColor} font-mono`}>
                      Rs. {plan.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div id="plan-perks" className="space-y-2 mt-4 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`${index === 9 ? 'text-slate-300' : 'text-slate-500'} font-medium`}>Daily Profit:</span>
                    <span className="font-extrabold text-emerald-500 font-mono text-sm">
                      Rs. {plan.dailyProfit} / day
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`${index === 9 ? 'text-slate-300' : 'text-slate-500'} font-medium`}>Ads to Watch:</span>
                    <span className="font-extrabold text-slate-800 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded-lg">
                      {plan.adLimit} Instant Ad
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`${index === 9 ? 'text-slate-300' : 'text-slate-500'} font-medium`}>Return Interval:</span>
                    <span className={`font-bold ${index === 9 ? 'text-emerald-300' : 'text-emerald-600'}`}>Every 24 Hours</span>
                  </div>
                </div>
              </div>

              <div>
                {isActive ? (
                  <button
                    id={`active-subscribed-btn-${plan.id}`}
                    type="button"
                    disabled
                    className="w-full flex justify-center py-2.5 px-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl"
                  >
                    Successfully Subscribed
                  </button>
                ) : (
                  <button
                    id={`buy-plan-btn-${plan.id}`}
                    type="button"
                    onClick={() => handlePurchase(plan)}
                    className={`w-full flex justify-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${buttonClass}`}
                  >
                    {isAffordable ? 'Subscribe Now' : `Insufficient Funds (Rs. ${plan.price})`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
