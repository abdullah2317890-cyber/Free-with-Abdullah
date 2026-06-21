/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Phone, Lock, User, Wallet } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (emailOrPhone: string, name: string) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('fwa_registered_users') || '[]');

    if (isLogin) {
      // Direct Admin access intercept
      const isAdminLogin = emailOrPhone.trim() === 'Abdullah@231' && password === 'Abdullah@231';
      
      // Find user
      const user = isAdminLogin 
        ? { emailOrPhone: 'Abdullah@231', name: 'Admin Abdullah', password: 'Abdullah@231' }
        : savedUsers.find(
            (u: any) => u.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase() && u.password === password
          );

      if (user) {
        // Ensure admin user exists in saved selection
        if (isAdminLogin) {
          const adminExists = savedUsers.some((u: any) => u.emailOrPhone === 'Abdullah@231');
          if (!adminExists) {
            savedUsers.push({
              emailOrPhone: 'Abdullah@231',
              name: 'Admin Abdullah',
              password: 'Abdullah@231',
              createdAt: new Date().toISOString(),
            });
            localStorage.setItem('fwa_registered_users', JSON.stringify(savedUsers));
          }
        }
        
        setSuccess(isAdminLogin ? 'Admin logged in successfully! Entering Command Center.' : 'Logged in successfully!');
        setTimeout(() => {
          onLoginSuccess(user.emailOrPhone, user.name);
        }, 800);
      } else {
        setError('Invalid Email/Phone or Password. Please try again or Sign Up.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      // Check if user already exists
      const userExists = savedUsers.some(
        (u: any) => u.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase()
      );

      if (userExists) {
        setError('This email or phone number is already registered.');
        return;
      }

      // Save user
      const newUser = {
        emailOrPhone,
        name,
        password,
        createdAt: new Date().toISOString(),
      };

      savedUsers.push(newUser);
      localStorage.setItem('fwa_registered_users', JSON.stringify(savedUsers));

      setSuccess('Account created successfully! You can now log in.');
      setIsLogin(true);
      // Reset registration form fields except login email/phone
      setName('');
      setPassword('');
    }
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 p-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div id="auth-brand" className="flex items-center justify-center gap-3">
          <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-md shadow-emerald-200">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Free With Abdullah
          </h1>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600 font-medium tracking-wide">
          Your Ultimate Pathway to Financial Empowerment
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-3xl border border-slate-100 sm:px-10">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-4 mb-6">
            <button
              id="tab-login-btn"
              type="button"
              className={`w-1/2 pb-3 text-center text-base font-semibold border-b-2 transition-all duration-200 ${
                isLogin
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
            >
              Sign In
            </button>
            <button
              id="tab-signup-btn"
              type="button"
              className={`w-1/2 pb-3 text-center text-base font-semibold border-b-2 transition-all duration-200 ${
                !isLogin
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Notifications */}
            {error && (
              <div id="auth-error-msg" className="bg-rose-50 text-rose-700 text-sm p-4 rounded-xl font-medium border border-rose-100 animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div id="auth-success-msg" className="bg-emerald-50 text-emerald-700 text-sm p-4 rounded-xl font-medium border border-emerald-100">
                {success}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="full-name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 h-5 text-slate-400" />
                  </div>
                  <input
                    id="full-name"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm transition-all shadow-sm"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email-phone">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {emailOrPhone.match(/^[0-9+ ]+$/) ? (
                    <Phone className="h-5 h-5 text-slate-400" />
                  ) : (
                    <Mail className="h-5 h-5 text-slate-400" />
                  )}
                </div>
                <input
                  id="email-phone"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm transition-all shadow-sm"
                  placeholder="name@email.com or +923000000000"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 h-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm transition-all shadow-sm"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  id="password-visibility-toggle"
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 h-5" /> : <Eye className="h-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                id="auth-submit-btn"
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 cursor-pointer"
              >
                {isLogin ? 'Sign In Now' : 'Create Free Account'}
              </button>
            </div>
          </form>



        </div>
      </div>
    </div>
  );
}
