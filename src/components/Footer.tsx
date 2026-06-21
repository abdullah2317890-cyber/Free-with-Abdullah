/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wallet, Package, Film, Users, Trophy, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface FooterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: User | null;
}

export default function Footer({ activeTab, onTabChange, user }: FooterProps) {
  const tabs = [
    { id: 'wallet', name: 'Wallet / Pays', icon: Wallet },
    { id: 'packages', name: 'Packages', icon: Package },
    { id: 'ads', name: 'Ads Watch', icon: Film },
    { id: 'referrals', name: 'Referrals', icon: Users },
    { id: 'profile', name: 'Profit / Help', icon: Trophy },
  ];

  if (user && user.isAdmin) {
    tabs.push({ id: 'admin', name: 'Admin Hub', icon: ShieldCheck });
  }

  return (
    <footer id="app-sticky-footer" className="bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 z-50 shadow-lg font-sans">
      <div className={`${user && user.isAdmin ? 'max-w-lg' : 'max-w-md'} mx-auto px-2 sm:px-4 py-1.5 flex justify-between items-center`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`footer-tab-btn-${tab.id}`}
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 cursor-pointer group flex-1"
            >
              <div
                className={`p-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 scale-110'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-bold mt-1.5 transition-colors ${
                  isActive ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
