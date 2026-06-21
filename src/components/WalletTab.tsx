/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Transaction, User } from '../types';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Landmark, Plus, Minus, CreditCard } from 'lucide-react';

export const renderPaymentLogo = (id: string, sizeClass = "w-10 h-10") => {
  switch (id) {
    case 'easypaisa':
      return (
        <div className={`${sizeClass} rounded-xl bg-white flex items-center justify-center shadow-inner border border-emerald-100 overflow-hidden flex-shrink-0`}>
          <svg viewBox="0 0 120 120" className="w-9 h-9">
            <rect width="120" height="120" rx="20" fill="#ffffff" />
            <circle cx="60" cy="60" r="44" fill="#39B54A" />
            <path d="M60,25 C79.33,25 95,40.67 95,60 C95,71.5 89.5,81.8 81,88 C81,65 65,42 60,25 Z" fill="#8DC63F" />
            <path d="M60,25 C40.67,25 25,40.67 25,60 C25,71.5 30.5,81.8 39,88 C39,65 55,42 60,25 Z" fill="#ffffff" />
            <circle cx="60" cy="65" r="16" fill="#39B54A" />
          </svg>
        </div>
      );
    case 'jazzcash':
      return (
        <div className={`${sizeClass} rounded-xl bg-[#1d1a39] flex items-center justify-center shadow-inner border border-stone-800 overflow-hidden relative flex-shrink-0`}>
          <div className="absolute top-0 left-0 w-3.5 h-full bg-gradient-to-b from-[#E11D48] via-[#F59E0B] to-[#EF4444] transform -skew-x-12 -translate-x-1" />
          <div className="absolute top-0 left-2.5 w-1.5 h-full bg-[#fbbf24] transform -skew-x-12 -translate-x-1.5" />
          <div className="flex flex-col items-center justify-center pl-1 z-10">
            <span className="text-[10px] font-black text-[#fbbf24] tracking-tighter leading-none uppercase">JAZZ</span>
            <span className="text-[8px] font-black text-white tracking-widest leading-none">CASH</span>
          </div>
        </div>
      );
    case 'sadapay':
      return (
        <div className={`${sizeClass} rounded-xl bg-[#FF5E5B] flex flex-col items-center justify-center shadow-inner overflow-hidden relative border border-[#FF705A] flex-shrink-0`}>
          <span className="text-white font-extrabold text-[11px] tracking-tight lowercase">sada</span>
          <span className="text-[7px] text-[#FFE4E1] font-extrabold tracking-widest leading-none uppercase -mt-0.5">pay</span>
        </div>
      );
    case 'nayapay':
      return (
        <div className={`${sizeClass} rounded-xl bg-[#0052CC] flex flex-col items-center justify-center shadow-inner overflow-hidden relative border border-blue-700 flex-shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-5 h-5 -mb-0.5">
            <path d="M 30 55 C 30 35, 55 35, 55 55 C 55 75, 70 75, 70 55" fill="none" stroke="#F97316" strokeWidth="14" strokeLinecap="round" />
            <path d="M 70 45 C 70 65, 45 65, 45 45 C 45 25, 30 25, 30 45" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <span className="text-[6px] font-bold text-white tracking-wider leading-none uppercase">NAYA</span>
        </div>
      );
    case 'opay':
      return (
        <div className={`${sizeClass} rounded-xl bg-[#00B050] flex flex-col items-center justify-center shadow-inner overflow-hidden relative border border-[#009E47] flex-shrink-0`}>
          <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
            <div className="rounded-full w-3.5 h-3.5 border-[3.5px] border-[#00B050] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#FFC000]" />
            </div>
          </div>
          <span className="text-[7px] font-black text-white tracking-widest uppercase mt-0.5">OPAY</span>
        </div>
      );
    case 'bank_transfer':
    default:
      return (
        <div className={`${sizeClass} rounded-xl bg-[#0F172A] flex items-center justify-center shadow-inner overflow-hidden relative border border-slate-800 flex-shrink-0`}>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
          <svg viewBox="0 0 100 100" className="w-5 h-5 text-emerald-400">
            <path d="M50 15 L20 35 L80 35 Z" fill="currentColor" />
            <rect x="25" y="40" width="8" height="30" fill="currentColor" />
            <rect x="41" y="40" width="8" height="30" fill="currentColor" />
            <rect x="57" y="40" width="8" height="30" fill="currentColor" />
            <rect x="73" y="40" width="8" height="30" fill="currentColor" />
            <rect x="15" y="73" width="70" height="8" fill="currentColor" />
          </svg>
          <div className="absolute top-0.5 right-1 text-[5px] font-black text-slate-400 tracking-wider">BANK</div>
        </div>
      );
  }
};

interface WalletTabProps {
  user: User;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateTransaction: (id: string, updatedFields: Partial<Transaction>) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    brandColor: '#22c55e',
    logoText: 'easypaisa',
    shortDesc: 'Instant mobile transfer',
    accountNumber: '03369917075',
    accountTitle: 'Deposit Shabnam Nadeem',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    color: 'bg-amber-50 text-amber-900 border-amber-200',
    brandColor: '#f59e0b',
    logoText: 'JazzCash',
    shortDesc: 'Instant micro-wallet',
    accountNumber: '03369917075',
    accountTitle: 'Deposit Shabnam Nadeem',
  },
  {
    id: 'sadapay',
    name: 'Sadapay',
    color: 'bg-teal-50 text-teal-800 border-teal-200',
    brandColor: '#0d9488',
    logoText: 'SadaPay',
    shortDesc: 'Zero fees wallet',
    accountNumber: '03369917075',
    accountTitle: 'Deposit Shabnam Nadeem',
  },
  {
    id: 'nayapay',
    name: 'Nayapay',
    color: 'bg-orange-50 text-orange-800 border-orange-200',
    brandColor: '#ea580c',
    logoText: 'NayaPay',
    shortDesc: 'Modern digital wallet',
    accountNumber: '03369917075',
    accountTitle: 'Deposit Shabnam Nadeem',
  },
  {
    id: 'opay',
    name: 'Opay',
    color: 'bg-green-50 text-green-800 border-green-200',
    brandColor: '#16a34a',
    logoText: 'OPay',
    shortDesc: 'Smart payment channel',
    accountNumber: '03369917075',
    accountTitle: 'Deposit Shabnam Nadeem',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    brandColor: '#4f46e5',
    logoText: 'HBL / UBL / Meezan',
    shortDesc: 'Standard banking option',
    accountNumber: '03369917075',
    accountTitle: 'Deposit Shabnam Nadeem',
  },
];

export default function WalletTab({
  user,
  onUpdateUser,
  transactions,
  onAddTransaction,
  onUpdateTransaction,
}: WalletTabProps) {
  // Load platform settings config dynamically
  const config = JSON.parse(localStorage.getItem('fwa_platform_config') || '{}');
  const dNumber = config.receiverNumber || '03369917075';
  const dName = config.receiverName || 'Deposit Shabnam Nadeem';
  const minDepLimit = config.minDeposit !== undefined ? Number(config.minDeposit) : 200;
  const minWithLimit = config.minWithdraw !== undefined ? Number(config.minWithdraw) : 600;
  const simAutomationOn = config.simAutoApprove || false;

  const dynamicPaymentMethods = PAYMENT_METHODS.map(pm => ({
    ...pm,
    accountNumber: dNumber,
    accountTitle: dName
  }));

  const [activeForm, setActiveForm] = useState<'deposit' | 'withdrawal'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState(dynamicPaymentMethods[0]);
  const [amount, setAmount] = useState<number>(200);
  const [typedMethod, setTypedMethod] = useState(dynamicPaymentMethods[0].id);

  const availableMethods = activeForm === 'deposit'
    ? dynamicPaymentMethods.filter((m) => ['easypaisa', 'jazzcash', 'sadapay'].includes(m.id))
    : dynamicPaymentMethods;

  const currentSelectedMethod = availableMethods.some((m) => m.id === selectedMethod.id)
    ? availableMethods.find((m) => m.id === selectedMethod.id)!
    : availableMethods[0];
  
  // Deposit fields
  const [depositTrxId, setDepositTrxId] = useState('');
  const [depositSenderNumber, setDepositSenderNumber] = useState('');
  const [depositAccountTitle, setDepositAccountTitle] = useState('');

  // Withdrawal fields
  const [withdrawalNumber, setWithdrawalNumber] = useState('');
  const [withdrawalTitle, setWithdrawalTitle] = useState('');

  // Errors/Success states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMethodChange = (methodId: string) => {
    const found = dynamicPaymentMethods.find((m) => m.id === methodId);
    if (found) {
      setSelectedMethod(found);
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (amount < minDepLimit) {
      setError(`Minimum deposit is Rs. ${minDepLimit.toLocaleString()}.`);
      return;
    }
    if (!depositSenderNumber.trim()) {
      setError('Please provide your sender account or phone number.');
      return;
    }
    if (!depositAccountTitle.trim()) {
      setError('Please provide your sender account title name.');
      return;
    }
    if (!depositTrxId.trim()) {
      setError('Please provide the transaction ID (TRX ID).');
      return;
    }

    // Add transaction
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount,
      method: currentSelectedMethod.id as any,
      accountNumber: depositSenderNumber,
      accountTitle: depositAccountTitle,
      status: 'pending',
      txId: depositTrxId,
      timestamp: Date.now(),
    };

    onAddTransaction(newTx);
    setSuccess(simAutomationOn 
      ? 'Deposit request submitted! Automatic simulator will approve inside 4s.' 
      : 'Deposit request submitted successfully for central review!'
    );
    
    // Clear deposit inputs
    setDepositSenderNumber('');
    setDepositAccountTitle('');
    setDepositTrxId('');

    // Trigger dummy delay logic so that they can see instant approval for test
    if (simAutomationOn) {
      setTimeout(() => {
        onUpdateTransaction(newTx.id, { status: 'completed' });
        onUpdateUser({ balance: user.balance + amount });
      }, 4000);
    }
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (amount < minWithLimit) {
      setError(`Minimum withdrawal limit is Rs. ${minWithLimit.toLocaleString()}.`);
      return;
    }
    if (user.balance < amount) {
      setError('Insufficient balance to request this withdrawal.');
      return;
    }
    if (!withdrawalNumber.trim()) {
      setError('Please provide your account number or phone.');
      return;
    }
    if (!withdrawalTitle.trim()) {
      setError('Please provide your account title name.');
      return;
    }

    // Deduct instantly the withdrawal amount
    onUpdateUser({ balance: user.balance - amount });

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      type: 'withdrawal',
      amount,
      method: currentSelectedMethod.id as any,
      accountNumber: withdrawalNumber,
      accountTitle: withdrawalTitle,
      status: 'pending',
      timestamp: Date.now(),
    };

    onAddTransaction(newTx);
    setSuccess(simAutomationOn 
      ? 'Withdrawal request accepted! Automatic simulation processes inside 6s.' 
      : 'Withdrawal request queued successfully for central review!'
    );
    setWithdrawalNumber('');
    setWithdrawalTitle('');

    // Automatically complete after a short while for pristine flow representation
    if (simAutomationOn) {
      setTimeout(() => {
        onUpdateTransaction(newTx.id, { status: 'completed' });
      }, 6000);
    }
  };

  // Helper actions to instantly approve for manual interactive testing
  const handleInstantAction = (tx: Transaction, approved: boolean) => {
    if (tx.status !== 'pending') return;

    if (approved) {
      onUpdateTransaction(tx.id, { status: 'completed' });
      if (tx.type === 'deposit') {
        onUpdateUser({ balance: user.balance + tx.amount });
      }
    } else {
      onUpdateTransaction(tx.id, { status: 'rejected' });
      if (tx.type === 'withdrawal') {
        onUpdateUser({ balance: user.balance + tx.amount });
      }
    }
  };

  return (
    <div id="wallet-section-container" className="space-y-6 font-sans">
      
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Balance card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-50/55 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Plus className="w-64 h-64" />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">
                Available Wallet Balance
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight">
                Rs. {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
              <Landmark className="w-5 h-5 text-emerald-100" />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-emerald-100">
            <div>
              <span className="opacity-75">Account Holder:</span>
              <p className="font-bold text-white">{user.name}</p>
            </div>
            <div className="text-right">
              <span className="opacity-75">Status:</span>
              <p className="font-bold text-white flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                Active Partner
              </p>
            </div>
          </div>
        </div>

        {/* Quick Limits Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600 w-5 h-5" /> Transaction Authorization
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-sm">
                <span className="text-slate-500 font-medium">Minimum Allowed Deposit</span>
                <span className="font-bold text-emerald-600 font-mono">Rs. {minDepLimit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-sm">
                <span className="text-slate-500 font-medium">Minimum Allowed Withdrawal</span>
                <span className="font-bold text-rose-600 font-mono">Rs. {minWithLimit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-slate-500 font-medium">Verification Status</span>
                <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                  simAutomationOn 
                    ? 'text-emerald-800 bg-emerald-50' 
                    : 'text-amber-800 bg-amber-50'
                }`}>
                  {simAutomationOn ? 'Auto-Approve Simulator' : 'Manual Central Review'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>
              {simAutomationOn 
                ? 'Automatic quick simulations process requests within 5 seconds for easy testing!' 
                : 'Transactions are routed for review. Log in as Abdullah@231 to approve or reject them!'}
            </span>
          </div>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button
          id="btn-switch-deposit"
          type="button"
          className={`w-1/2 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
            activeForm === 'deposit'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => {
            setActiveForm('deposit');
            setError('');
            setSuccess('');
          }}
        >
          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          Deposit Funds
        </button>
        <button
          id="btn-switch-withdrawal"
          type="button"
          className={`w-1/2 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
            activeForm === 'withdrawal'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => {
            setActiveForm('withdrawal');
            setError('');
            setSuccess('');
          }}
        >
          <ArrowDownLeft className="w-4 h-4 text-rose-500" />
          Withdraw Earnings
        </button>
      </div>

      {/* Main Form container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        
        {/* Error / Success Feedback */}
        {error && (
          <div id="wallet-error-msg" className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-sm font-medium mb-5">
            {error}
          </div>
        )}
        {success && (
          <div id="wallet-success-msg" className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-sm font-medium mb-5">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Method Chooser */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              1. Choose Payment Wallet
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {availableMethods.map((m) => {
                const isSelected = currentSelectedMethod.id === m.id;
                return (
                  <button
                    id={`payment-method-${m.id}`}
                    key={m.id}
                    type="button"
                    onClick={() => handleMethodChange(m.id)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/15 bg-emerald-50/20'
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Stylized Wallet Logo representation */}
                      {renderPaymentLogo(m.id)}
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{m.name}</p>
                        <p className="text-xs text-slate-500 leading-none mt-0.5">{m.shortDesc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white scale-110">
                        <svg className="w-3 h-3 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive details & Input fields */}
          <div className="lg:col-span-7 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            {activeForm === 'deposit' ? (
              <form onSubmit={handleDepositSubmit} className="space-y-5">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Official Support Payment Details
                  </span>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-slate-500">Wallet Provider:</span>
                    <div className="flex items-center gap-1.5">
                      {renderPaymentLogo(currentSelectedMethod.id, "w-6 h-6")}
                      <span className="text-sm font-bold text-slate-900">{currentSelectedMethod.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-slate-500">Account Title:</span>
                    <span className="text-sm font-bold text-slate-900">{currentSelectedMethod.accountTitle}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-slate-500">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-emerald-700 font-mono tracking-wider">{currentSelectedMethod.accountNumber}</span>
                      <button
                        id="copy-payment-details-btn"
                        type="button"
                        onClick={() => navigator.clipboard.writeText(currentSelectedMethod.accountNumber)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-bold"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 bg-amber-50 text-[11px] text-amber-800 rounded-xl leading-relaxed flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Send exactly the amount you intend to request. Deposits are auto-confirmed via TRX proof within minutes!</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    2. Submit Payment Proof
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Deposit Amount (Rs.)
                    </label>
                    <input
                      id="deposit-amount-input"
                      type="number"
                      required
                      min="200"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Minimum deposit Rs. 200</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Your Sender Account / Mobile No.
                      </label>
                      <input
                        id="deposit-sender-number-input"
                        type="text"
                        required
                        placeholder="e.g. 03001234567"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        value={depositSenderNumber}
                        onChange={(e) => setDepositSenderNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Your Account Title Name
                      </label>
                      <input
                        id="deposit-sender-title-input"
                        type="text"
                        required
                        placeholder="e.g. Abdullah Khan"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        value={depositAccountTitle}
                        onChange={(e) => setDepositAccountTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Transaction Identification Hash (TRX ID Proof)
                    </label>
                    <input
                      id="deposit-trxid-input"
                      type="text"
                      required
                      placeholder="e.g. 811652895101"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      value={depositTrxId}
                      onChange={(e) => setDepositTrxId(e.target.value)}
                    />
                  </div>

                  <button
                    id="submit-deposit-form-btn"
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Submit Deposit Notice
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleWithdrawalSubmit} className="space-y-5">
                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-xs text-rose-800 leading-relaxed flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Withdrawal Verification Rules:</span>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5">
                      <li>Minimum withdrawal limit is Rs. 600.</li>
                      <li>Double check details. Handled securely right to your mobile block.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Provide Payout Account
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Withdrawal Amount (Rs.)
                    </label>
                    <input
                      id="withdraw-amount-input"
                      type="number"
                      required
                      min="600"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Minimum cash-out Rs. 600</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Payout Mobile No. / Account Number
                      </label>
                      <input
                        id="withdraw-number-input"
                        type="text"
                        required
                        placeholder="e.g. 03120000000"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                        value={withdrawalNumber}
                        onChange={(e) => setWithdrawalNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Your Full Account Title
                      </label>
                      <input
                        id="withdraw-title-input"
                        type="text"
                        required
                        placeholder="e.g. Abdullah Farooq"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                        value={withdrawalTitle}
                        onChange={(e) => setWithdrawalTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    id="submit-withdraw-form-btn"
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer"
                  >
                    Confirm & Cash Out
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Transaction History Logs */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div id="tx-history-header" className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold flex items-center gap-2 text-base">
            Recent Ledger Activity
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2.5 py-1 rounded-lg">
            {transactions.length} Records
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">No transaction records found in this simulation.</p>
            <p className="text-[11px] text-slate-400/80 mt-1">Initiate a Deposit or a Withdrawal above to start tracking entries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="tbl-transaction-ledger" className="min-w-full divide-y divide-slate-100 text-sm text-slate-700">
              <thead>
                <tr className="text-xs uppercase text-slate-400">
                  <th className="py-3 px-4 text-left font-bold">Ref ID</th>
                  <th className="py-3 px-4 text-left font-bold">Type</th>
                  <th className="py-3 px-4 text-left font-bold">Payment Channel</th>
                  <th className="py-3 px-4 text-right font-bold">Amount</th>
                  <th className="py-3 px-4 text-center font-bold">State</th>
                  <th className="py-3 px-4 text-right font-bold">Action (Manual Test)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-xs text-slate-500">
                      {tx.id}
                      {tx.txId && <div className="text-[10px] text-slate-400/90 leading-none">TRX: {tx.txId}</div>}
                    </td>
                    <td className="py-3 px-4">
                      {tx.type === 'deposit' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg text-xs font-bold uppercase">
                          <Plus className="w-3 h-3" /> Deposit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg text-xs font-bold uppercase">
                          <Minus className="w-3 h-3" /> Payout
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {renderPaymentLogo(tx.method, "w-6 h-6")}
                        <div>
                          <div className="font-bold text-slate-800 text-sm capitalize">{tx.method.replace('_', ' ')}</div>
                          <div className="text-[10px] text-slate-400 font-mono leading-none">{tx.accountNumber} ({tx.accountTitle})</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold font-mono">
                      Rs. {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {tx.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl text-xs font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Declined
                        </span>
                      )}
                      {tx.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl text-xs font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5 animate-spin" /> Verifying
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tx.status === 'pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            id={`approve-trx-${tx.id}`}
                            type="button"
                            onClick={() => handleInstantAction(tx, true)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded-lg shadow-sm cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            id={`decline-trx-${tx.id}`}
                            type="button"
                            onClick={() => handleInstantAction(tx, false)}
                            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1 px-2.5 rounded-lg cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Logged & Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
