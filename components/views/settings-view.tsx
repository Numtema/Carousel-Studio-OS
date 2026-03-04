'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { User, CreditCard, Key, Settings, Shield, Bell, LogOut } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="text-clay" />
            Settings & Profile
          </h2>
          <p className="text-text-secondary text-sm mt-1">Manage your account, billing, and API integrations.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 flex gap-8">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border text-clay font-medium transition-colors">
            <User size={18} />
            Profile
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors">
            <CreditCard size={18} />
            Billing & Usage
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors">
            <Key size={18} />
            API Keys
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors">
            <Shield size={18} />
            Security
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors">
            <Bell size={18} />
            Notifications
          </button>
          
          <div className="mt-auto pt-8">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors w-full">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Profile Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

          {/* Billing Section (Taramoney Placeholder) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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

        </div>
      </div>
    </div>
  );
}
