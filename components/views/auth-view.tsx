'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, KeyRound, Loader2, Key, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { useTheme } from 'next-themes';

type AuthStep = 'login' | 'register' | 'forgot_password' | 'otp_verification' | 'reset_password';

export function AuthView() {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { setIsAuthenticated } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    await action();
    setIsLoading(false);
  };

  const handleLogin = () => handleAuthAction(async () => {
    setIsAuthenticated(true);
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-surface border-r border-border">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-clay/20 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-screen" />
          <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-clay flex items-center justify-center shadow-lg shadow-clay/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">Carousel Studio OS</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary leading-tight">
              Design viral carousels at the speed of thought.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              The premier directed creative operating system. Generate, orchestrate, and publish high-converting visual content with AI-native workflows.
            </p>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-sm text-text-secondary font-mono">
          © {new Date().getFullYear()} Numtema Agency. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <div className="w-full max-w-md relative">
          <AnimatePresence mode="wait">
            {/* LOGIN */}
            {step === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-text-primary">Welcome back</h2>
                  <p className="text-text-secondary">Enter your details to access your workspace.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@agency.com" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-secondary">Password</label>
                      <button onClick={() => setStep('forgot_password')} className="text-xs font-medium text-clay hover:text-[#A34629] transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleLogin}
                    disabled={isLoading || !email || !password}
                    className="w-full bg-clay hover:bg-[#A34629] text-white rounded-xl py-3 mt-2 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-clay/20"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                    {!isLoading && <ArrowRight size={18} />}
                  </button>
                </div>

                <p className="text-center text-sm text-text-secondary mt-4">
                  Don't have an account?{' '}
                  <button onClick={() => setStep('register')} className="font-medium text-text-primary hover:text-clay transition-colors">
                    Create one
                  </button>
                </p>
              </motion.div>
            )}

            {/* REGISTER */}
            {step === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-text-primary">Create an account</h2>
                  <p className="text-text-secondary">Start creating viral carousels in minutes.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-text-secondary">First Name</label>
                      <input 
                        type="text" 
                        placeholder="John" 
                        className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-text-secondary">Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Doe" 
                        className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="email" 
                        placeholder="hello@agency.com" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAuthAction(() => { setStep('login'); return Promise.resolve(); })}
                    disabled={isLoading}
                    className="w-full bg-clay hover:bg-[#A34629] text-white rounded-xl py-3 mt-2 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-clay/20"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
                  </button>
                </div>

                <p className="text-center text-sm text-text-secondary mt-4">
                  Already have an account?{' '}
                  <button onClick={() => setStep('login')} className="font-medium text-text-primary hover:text-clay transition-colors">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {step === 'forgot_password' && (
              <motion.div
                key="forgot_password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <button onClick={() => setStep('login')} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors">
                  <ArrowLeft size={16} />
                </button>
                
                <div>
                  <div className="w-12 h-12 bg-clay/10 rounded-2xl flex items-center justify-center mb-6">
                    <KeyRound size={24} className="text-clay" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-text-primary">Reset password</h2>
                  <p className="text-text-secondary">Enter your email and we'll send you a 6-digit verification code to reset your password.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@agency.com" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAuthAction(() => { setStep('otp_verification'); return Promise.resolve(); })}
                    disabled={isLoading || !email}
                    className="w-full bg-text-primary hover:bg-text-secondary text-background rounded-xl py-3 mt-2 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Code'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP VERIFICATION */}
            {step === 'otp_verification' && (
              <motion.div
                key="otp_verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <button onClick={() => setStep('forgot_password')} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors">
                  <ArrowLeft size={16} />
                </button>
                
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-text-primary">Check your email</h2>
                  <p className="text-text-secondary">We sent a 6-digit verification code to <span className="font-medium text-text-primary">{email || 'your email'}</span>.</p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 bg-surface border border-border rounded-xl text-center text-xl font-bold focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay transition-all"
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => handleAuthAction(() => { setStep('reset_password'); return Promise.resolve(); })}
                    disabled={isLoading || otp.some(d => d === '')}
                    className="w-full bg-clay hover:bg-[#A34629] text-white rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-clay/20"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Code'}
                  </button>
                </div>

                <p className="text-center text-sm text-text-secondary mt-2">
                  Didn't receive the email?{' '}
                  <button className="font-medium text-text-primary hover:text-clay transition-colors">
                    Click to resend
                  </button>
                </p>
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {step === 'reset_password' && (
              <motion.div
                key="reset_password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <Key size={24} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-text-primary">Set new password</h2>
                  <p className="text-text-secondary">Your new password must be different from previously used passwords.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-clay transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAuthAction(() => { setStep('login'); return Promise.resolve(); })}
                    disabled={isLoading}
                    className="w-full bg-clay hover:bg-[#A34629] text-white rounded-xl py-3 mt-2 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-clay/20"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
