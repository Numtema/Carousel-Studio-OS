'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { User, CreditCard, Key, Settings, Shield, Bell, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useAppStore } from '@/store/app-store';

type Tab = 'profile' | 'appearance' | 'billing' | 'api' | 'security' | 'notifications';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { theme, setTheme } = useTheme();
  const { setIsAuthenticated } = useAppStore();

  const tabClass = (tab: Tab) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
      activeTab === tab 
        ? 'bg-surface border border-border text-clay' 
        : 'hover:bg-surface border border-transparent hover:border-border text-text-secondary hover:text-text-primary'
    }`;

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="text-clay" />
            Settings & Profile
          </h2>
          <p className="text-text-secondary text-sm mt-1">Manage your account, billing, and system preferences.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 flex gap-8">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          <button onClick={() => setActiveTab('profile')} className={tabClass('profile')}>
            <User size={18} /> Profile
          </button>
          <button onClick={() => setActiveTab('appearance')} className={tabClass('appearance')}>
            <Monitor size={18} /> Appearance
          </button>
          <button onClick={() => setActiveTab('billing')} className={tabClass('billing')}>
            <CreditCard size={18} /> Billing & Usage
          </button>
          <button onClick={() => setActiveTab('api')} className={tabClass('api')}>
            <Key size={18} /> API Keys
          </button>
          <button onClick={() => setActiveTab('security')} className={tabClass('security')}>
            <Shield size={18} /> Security
          </button>
          <button onClick={() => setActiveTab('notifications')} className={tabClass('notifications')}>
            <Bell size={18} /> Notifications
          </button>
          
          <div className="mt-auto pt-8">
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors w-full cursor-pointer"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {activeTab === 'profile' && (
              <motion.section 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface rounded-3xl border border-border p-8"
              >
                <h3 className="text-xl font-bold mb-6">User Profile</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-background relative">
                    <Image src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-background border border-border hover:border-text-secondary rounded-full text-sm font-medium transition-colors mb-2">
                      Change Avatar
                    </button>
                    <p className="text-xs text-text-secondary">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">First Name</label>
                    <input type="text" defaultValue="Numtema" className="bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-clay transition-colors text-text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Last Name</label>
                    <input type="text" defaultValue="Agency" className="bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-clay transition-colors text-text-primary" />
                  </div>
                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <input type="email" defaultValue="numtemadigitalmarketingagency@gmail.com" className="bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-clay transition-colors text-text-primary" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="px-6 py-3 bg-clay hover:bg-[#A34629] text-white rounded-full text-sm font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </motion.section>
            )}

            {activeTab === 'appearance' && (
              <motion.section 
                key="appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface rounded-3xl border border-border p-8"
              >
                <h3 className="text-xl font-bold mb-6">Appearance</h3>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-4">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${theme === 'light' ? 'border-clay bg-clay/5' : 'border-border bg-background hover:border-text-secondary'} transition-all`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-sm">
                          <Sun size={20} />
                        </div>
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${theme === 'dark' ? 'border-clay bg-clay/5' : 'border-border bg-background hover:border-text-secondary'} transition-all`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-white shadow-sm">
                          <Moon size={20} />
                        </div>
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button 
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${theme === 'system' ? 'border-clay bg-clay/5' : 'border-border bg-background hover:border-text-secondary'} transition-all`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-800 border border-gray-500 flex items-center justify-center text-white shadow-sm">
                          <Monitor size={20} />
                        </div>
                        <span className="text-sm font-medium">System</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'billing' && (
              <motion.section 
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface rounded-3xl border border-border p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Billing & Usage</h3>
                  <span className="text-xs font-mono bg-moss/20 text-moss px-3 py-1 rounded-full border border-moss/30">Pro Plan Active</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-background border border-border rounded-2xl p-4">
                    <p className="text-sm text-text-secondary mb-1">Current Usage</p>
                    <p className="text-2xl font-bold">142 <span className="text-sm font-normal text-text-secondary">/ 500 Runs</span></p>
                  </div>
                  <div className="bg-background border border-border rounded-2xl p-4">
                    <p className="text-sm text-text-secondary mb-1">Next Billing Date</p>
                    <p className="text-2xl font-bold">Oct 12</p>
                  </div>
                  <div className="bg-background border border-border rounded-2xl p-4">
                    <p className="text-sm text-text-secondary mb-1">Amount Due</p>
                    <p className="text-2xl font-bold">$49.00</p>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center border border-border">
                      <CreditCard className="text-text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Taramoney Integration</p>
                      <p className="text-sm text-text-secondary">Manage your invoices and payment methods via Taramoney.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-surface border border-border hover:border-text-secondary rounded-full text-sm font-medium transition-colors">
                    Manage Billing
                  </button>
                </div>
              </motion.section>
            )}

            {activeTab === 'api' && (
              <motion.section 
                key="api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface rounded-3xl border border-border p-8"
              >
                <h3 className="text-xl font-bold mb-6">API Keys</h3>
                <p className="text-sm text-text-secondary mb-6">Manage your API keys for external integrations.</p>
                
                <div className="bg-background border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Gemini API Key</h4>
                    <span className="text-xs text-text-secondary">Used for text and image generation</span>
                  </div>
                  <div className="flex gap-4">
                    <input type="password" value="****************************************" readOnly className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-text-secondary focus:outline-none" />
                    <button className="px-6 py-3 bg-clay hover:bg-[#A34629] text-white rounded-xl text-sm font-medium transition-colors">
                      Update Key
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'security' && (
              <motion.section 
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface rounded-3xl border border-border p-8"
              >
                <h3 className="text-xl font-bold mb-6">Security</h3>
                <div className="flex flex-col gap-4">
                  <div className="bg-background border border-border rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-text-secondary">Update your account password regularly to keep it secure.</p>
                    </div>
                    <button className="px-4 py-2 bg-surface border border-border hover:border-text-secondary rounded-full text-sm font-medium transition-colors">
                      Update
                    </button>
                  </div>
                  <div className="bg-background border border-border rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-text-secondary">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-clay text-white rounded-full text-sm font-medium transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'notifications' && (
              <motion.section 
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface rounded-3xl border border-border p-8"
              >
                <h3 className="text-xl font-bold mb-6">Notification Preferences</h3>
                <div className="flex flex-col gap-4">
                  <div className="bg-background border border-border rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Updates</h4>
                      <p className="text-sm text-text-secondary">Receive weekly updates on your usage and new features.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-clay bg-clay checked:right-0 right-6" style={{right: 0}} />
                      <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-clay cursor-pointer"></label>
                    </div>
                  </div>
                  <div className="bg-background border border-border rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Generation Alerts</h4>
                      <p className="text-sm text-text-secondary">Get notified when a long carousel generation is complete.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-clay bg-clay checked:right-0 right-6" style={{right: 0}}/>
                      <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-clay cursor-pointer"></label>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
