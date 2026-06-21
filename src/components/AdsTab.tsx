/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User, PackagePlan } from '../types';
import { packagePlans } from '../plansData';
import { Play, CheckCircle, ShieldAlert, Sparkles, Clock, ExternalLink, Award } from 'lucide-react';

interface AdsTabProps {
  user: User;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  onSwitchTab: (tab: string) => void;
  onAddTransaction: (tx: any) => void;
}

export default function AdsTab({ user, onUpdateUser, onSwitchTab, onAddTransaction }: AdsTabProps) {
  const activePlan = packagePlans.find((p) => p.id === user.activePlanId);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [adLinkOpened, setAdLinkOpened] = useState(false);
  const [claimedToday, setClaimedToday] = useState(user.adWatchedToday);
  const [sessionSuccess, setSessionSuccess] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize state if parent state changes
  useEffect(() => {
    setClaimedToday(user.adWatchedToday);
  }, [user.adWatchedToday]);

  const AD_URL = "https://omg10.com/4/11166685";

  const startTask = () => {
    if (!activePlan) return;
    if (claimedToday) return;

    setIsRunning(true);
    setTimeLeft(30);
    setSessionSuccess('');
    
    // Automatically open in a helper window/tab for full sponsor count as well if user supports it
    try {
      window.open(AD_URL, '_blank', 'noopener,noreferrer');
      setAdLinkOpened(true);
    } catch (e) {
      // safe fallback if popup is blocked
      setAdLinkOpened(false);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Completed, keep state in finished stage until they click Claim
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const claimProfit = () => {
    if (!activePlan) return;
    
    const profitAmount = activePlan.dailyProfit;
    const updatedBalance = user.balance + profitAmount;
    
    onUpdateUser({
      balance: updatedBalance,
      adWatchedToday: true,
      claimsCount: (user.claimsCount || 0) + 1,
    });

    // Log virtual entry for clarity
    const profitTx = {
      id: 'tx-ad-' + Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount: profitAmount,
      method: 'bank_transfer',
      accountNumber: 'OMG10_AD_NETWORK',
      accountTitle: `Daily Task Reward for ${activePlan.name}`,
      status: 'completed',
      timestamp: Date.now(),
    };
    onAddTransaction(profitTx);

    setClaimedToday(true);
    setIsRunning(false);
    setSessionSuccess(`Task Completed! Rs. ${profitAmount} successfully added to your main deposit balance.`);
  };

  const forceSimulationReset = () => {
    // Reset watch state for quick simulated testing
    onUpdateUser({ adWatchedToday: false });
    setClaimedToday(false);
    setIsRunning(false);
    setSessionSuccess('Simulated next day! You can now watch and claim another ad immediately.');
  };

  return (
    <div id="ads-section-container" className="space-y-6 font-sans">
      
      {/* Active Pack Stats */}
      <div id="ads-header-banner" className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            Earnings Center
          </span>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            Sponsored Task Portal
          </h2>
        </div>
        
        {activePlan ? (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xs">
              M
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold leading-tight">Active Earning Rate</p>
              <p className="text-sm font-extrabold text-emerald-700 font-mono">
                Rs. {activePlan.dailyProfit} / daily task
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-2xl text-xs font-bold">
            No Active Package. Rewards Disabled.
          </div>
        )}
      </div>

      {sessionSuccess && (
        <div id="ads-session-success" className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-sm font-medium">
          {sessionSuccess}
        </div>
      )}

      {/* Main Sandbox */}
      {!activePlan ? (
        <div id="no-plan-ads-box" className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center max-w-lg mx-auto">
          <ShieldAlert className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
            Subscription Required
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed mt-2 mb-6">
            You must buy an earning plan before starting any tasks. Plan prices start at just Rs. 200, which pays back up to Rs. 100 on your first ad view instantly!
          </p>
          <button
            id="redirect-to-packages-btn"
            type="button"
            onClick={() => onSwitchTab('packages')}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Go to packages
          </button>
        </div>
      ) : claimedToday ? (
        <div id="claimed-ads-box" className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-black text-emerald-950">
            Daily Ad Task Completed!
          </h3>
          <p className="text-emerald-800 text-xs leading-relaxed max-w-sm mx-auto">
            You have successfully watched today's sponsored ad of your <span className="font-bold">{activePlan.name}</span> and claimed your daily profit of <span className="font-extrabold font-mono">Rs. {activePlan.dailyProfit}</span>.
          </p>

          <div className="bg-white border border-emerald-100 rounded-2xl p-3 flex justify-between items-center text-xs">
            <span className="text-slate-500">Next ad unlock in:</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">Tomorrow (24H Loop)</span>
          </div>

          <div className="pt-2">
            <button
              id="simulate-next-day-btn"
              type="button"
              onClick={forceSimulationReset}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Simulate Next Day (Unlock Ad Now)
            </button>
          </div>
        </div>
      ) : isRunning ? (
        <div id="active-ad-watching-frame" className="space-y-5">
          {/* Active timer bar */}
          <div className="bg-slate-900 text-white p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sponsored Viewing Progress</p>
                <p className="text-[11px] text-slate-400 leading-none">Do not navigate away until countdown completes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-400">Ad Reward Status:</p>
                <p className="text-sm font-extrabold text-emerald-400 font-mono">Rs. {activePlan.dailyProfit}</p>
              </div>
              
              <div className="bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl h-12 w-12 flex items-center justify-center font-mono shadow-md">
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* CSP fallback banner */}
          <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold">
              <ExternalLink className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Sponsor Redirection Protocol Active</span>
            </div>
            <p>
              We've triggered the sponsor page in your background tab. If it did not open or your browser blocks embedding, you can manually open the link:
              <a href={AD_URL} target="_blank" rel="noopener noreferrer" className="ml-1 text-emerald-700 underline font-black inline-flex items-center gap-0.5">
                {AD_URL} <ExternalLink className="w-3 h-3" />
              </a>. Keep this panel open; the 30-second profit counter continues counting below!
            </p>
          </div>

          {/* IFrame embedding */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-inner h-[400px] relative">
            {/* Embedded IFrame of requested URL */}
            <iframe
              id="sponsor-ad-iframe"
              src={AD_URL}
              title="Abdullah Sponsored Ads Server"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>

          {/* Claim Action container */}
          <div className="flex justify-center pt-3">
            {timeLeft === 0 ? (
              <button
                id="claim-profit-now-btn"
                type="button"
                onClick={claimProfit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-10 rounded-2xl text-base shadow-lg shadow-emerald-600/25 animate-bounce flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 animate-spin" />
                Claim Rs. {activePlan.dailyProfit} Daily Profit Now
              </button>
            ) : (
              <button
                id="claim-profit-waiting-btn"
                type="button"
                disabled
                className="bg-slate-200 text-slate-400 font-bold py-3.5 px-8 rounded-2xl text-xs"
              >
                Waiting for Countdown to Finish ({timeLeft} seconds remaining)
              </button>
            )}
          </div>
        </div>
      ) : (
        <div id="unstarted-ads-box" className="bg-gradient-to-br from-emerald-500 to-teal-800 text-white rounded-3xl p-8 text-center max-w-lg mx-auto space-y-6 shadow-xl">
          <Play className="w-16 h-16 text-white mx-auto animate-pulse" />
          
          <div>
            <h3 className="text-xl font-black text-white">
              Ready to Watch & Earn?
            </h3>
            <p className="text-emerald-100 text-xs leading-relaxed max-w-sm mx-auto mt-2 text-center">
              Watch 1 short sponsor ad of 30 seconds to lock in your daily profit of <span className="font-bold underline">Rs. {activePlan.dailyProfit}</span> according to your <span className="font-bold">{activePlan.name}</span>.
            </p>
          </div>

          <div className="bg-black/15 p-3 rounded-2xl text-emerald-200 text-[11px] leading-relaxed max-w-xs mx-auto">
            Sponsor Network: <span className="font-black font-mono">OMG10</span>
          </div>

          <div className="pt-2">
            <button
              id="start-task-btn"
              type="button"
              onClick={startTask}
              className="bg-white text-slate-950 hover:bg-emerald-100 font-extrabold text-sm py-3 px-8 rounded-2xl shadow-lg shadow-black/10 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              Start Task (Rs. {activePlan.dailyProfit})
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
