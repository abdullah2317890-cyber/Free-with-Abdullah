/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, PackagePlan } from '../types';
import { packagePlans } from '../plansData';
import { Mail, Settings, RefreshCw, BarChart3, HelpCircle, ArrowRightLeft, UserCheck, ShieldClose, Lock, Trash2, ShieldCheck, MailPlus } from 'lucide-react';

interface ProfileTabProps {
  user: User;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  onClearSession: () => void;
}

export default function ProfileTab({ user, onUpdateUser, onClearSession }: ProfileTabProps) {
  const activePlan = packagePlans.find((p) => p.id === user.activePlanId);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');
  
  const [editName, setEditName] = useState(user.name);
  const [editPassword, setEditPassword] = useState('');
  const [profileSuccessCode, setProfileSuccessCode] = useState('');

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setSupportSuccess(`Your support query has been encoded & dispatched to our central administrator (Abdullah). We will reply to your account email/phone shortly!`);
    setSupportSubject('');
    setSupportMessage('');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editName,
    });
    setProfileSuccessCode('Profile details updated successfully!');
    setTimeout(() => {
      setProfileSuccessCode('');
    }, 3000);
  };

  return (
    <div id="profile-section-container" className="space-y-6 font-sans">
      
      {/* Earnings Overview Board */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-slate-900 font-extrabold text-lg tracking-tight mb-4 flex items-center gap-2">
          <BarChart3 className="text-emerald-600 w-5 h-5" /> Detailed Profit breakdown
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Wallet Balance</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono block mt-1">Rs. {user.balance.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Current Package</span>
            <span className="text-sm font-black text-slate-800 block truncate mt-2">{activePlan ? activePlan.name : 'No Active Plan'}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Passive Claim Rate</span>
            <span className="text-lg font-extrabold text-emerald-600 font-mono block mt-1">
              Rs. {activePlan ? activePlan.dailyProfit : 0} / day
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Tasks Completed</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 font-mono block mt-1">{user.claimsCount || 0} claimed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex justify-between items-center">
            <span>Direct referrals: <strong className="font-bold">{user.referralsCount || 0} friends</strong></span>
            <span>Earned commission: <strong className="font-bold text-emerald-700 font-mono">Rs. {user.referralsEarned || 0}</strong></span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-800 rounded-2xl text-xs flex justify-between items-center">
            <span>Account Verification:</span>
            <span className="font-bold text-[#4f46e5] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
              Secure & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings & Support form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Contact support to Abdullah */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="text-emerald-600 w-5 h-5 animate-pulse" />
            <h3 className="text-slate-800 font-bold text-base">Contact Official Support Team</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Have any queries about deposit verification delays, payout requests, or plan subscriptions? Contact the platform founder on Gmail:
          </p>

          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <MailPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 leading-none">Primary Founder Support Mail</span>
              <p className="text-sm font-extrabold text-emerald-950 block mt-0.5 select-all">
                abdullah2317890@gmail.com
              </p>
            </div>
          </div>

          {supportSuccess && (
            <div id="support-feedback" className="bg-teal-50 border border-teal-100 text-teal-800 p-4 rounded-2xl text-xs font-semibold mb-4">
              {supportSuccess}
            </div>
          )}

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
              <input
                id="support-subject-input"
                type="text"
                required
                placeholder="e.g. Deposit validation or custom questions"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Message Detail</label>
              <textarea
                id="support-message-input"
                rows={3}
                required
                placeholder="Briefly state your concern here..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50"
              />
            </div>
            <button
              id="submit-support-btn"
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer shadow-md transition-colors"
            >
              Dispatch Inquiry
            </button>
          </form>
        </div>

        {/* Edit profile credentials */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex-1">
            <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2 text-base">
              <Settings className="text-slate-600 w-5 h-5" /> Account Information
            </h3>

            {profileSuccessCode && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-2xl text-xs font-bold mb-3">
                {profileSuccessCode}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Profile Name</label>
                <input
                  id="profile-edit-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Login Handle</label>
                <input
                  type="text"
                  disabled
                  value={user.emailOrPhone}
                  className="block w-full px-3 py-2 border border-slate-100 rounded-xl bg-slate-100 text-slate-400 text-xs select-none"
                />
              </div>
              <button
                id="submit-profile-update-btn"
                type="submit"
                className="w-full py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Wipe data simulator */}
          <div className="bg-rose-50/40 border border-rose-100 rounded-3xl p-5 shadow-sm text-center">
            <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-widest block mb-1">
              Diagnostic Controls
            </span>
            <p className="text-[11px] text-rose-600 leading-relaxed mb-3">
              Logging out deletes your temporary browser simulator window data.
            </p>
            <button
              id="logout-wipe-data-btn"
              type="button"
              onClick={onClearSession}
              className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Log Out (Reset State)
            </button>
          </div>
        </div>

      </div>

      {/* FAQs list */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-slate-800 font-extrabold text-base mb-4 flex items-center gap-2">
          <HelpCircle className="text-indigo-600 w-5 h-5" /> "Free with Abdullah" Platform FAQ
        </h3>

        <div className="space-y-4 text-xs divide-y divide-slate-50">
          <div className="pt-3 first:pt-0">
            <h4 className="font-extrabold text-slate-800 mb-1">Q1: How do I deposit funds of Rs. 200 or more?</h4>
            <p className="text-slate-500 leading-relaxed">
              Go to the **Wallet** tab, select your preferred wallet (Easypaisa, JazzCash, Nayapay, Sadapay, Opay, or Bank), send manually to the designated agent phone/account, and input the transaction ID (TRX Hash). The system processes simulations in 5 seconds!
            </p>
          </div>
          <div className="pt-3">
            <h4 className="font-extrabold text-slate-800 mb-1">Q2: What is the maximum daily ads tasks allowed?</h4>
            <p className="text-slate-500 leading-relaxed">
              Every single pricing tier has a strict daily constraint of 1 task (1 ad watch). This is because we source high-converting premiums via OMG10 which awards up to Rs. 7,000 for Plan 10.
            </p>
          </div>
          <div className="pt-3">
            <h4 className="font-extrabold text-slate-800 mb-1">Q3: How do I cash out commission or profits?</h4>
            <p className="text-slate-500 leading-relaxed">
              When your profile's wallet reaches the minimum cash-out quota of Rs. 600, switch the tab tool to "Withdraw Earnings", specify your personal recipient payout account title + number, and cash out instantly.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
