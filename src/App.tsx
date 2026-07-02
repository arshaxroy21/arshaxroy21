/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  DollarSign, 
  Settings, 
  RefreshCw, 
  Database, 
  AlertCircle,
  TrendingUp,
  Activity,
  Award,
  HelpCircle
} from 'lucide-react';
import { UserRole, Product, Customer, Transaction, SystemLog, SystemSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_TRANSACTIONS, INITIAL_LOGS, INITIAL_SETTINGS } from './data';
import CustomerStore from './components/CustomerStore';
import SalesManagerDashboard from './components/SalesManagerDashboard';
import FinanceManagerDashboard from './components/FinanceManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Current view role
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // 2. Hydrated states
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  // Help panel state
  const [showHelpPanel, setShowHelpPanel] = useState(true);

  // 3. Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('crm_products');
      const storedCustomers = localStorage.getItem('crm_customers');
      const storedTransactions = localStorage.getItem('crm_transactions');
      const storedLogs = localStorage.getItem('crm_logs');
      const storedSettings = localStorage.getItem('crm_settings');

      setProducts(storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS);
      setCustomers(storedCustomers ? JSON.parse(storedCustomers) : INITIAL_CUSTOMERS);
      setTransactions(storedTransactions ? JSON.parse(storedTransactions) : INITIAL_TRANSACTIONS);
      setSystemLogs(storedLogs ? JSON.parse(storedLogs) : INITIAL_LOGS);
      setSettings(storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS);
    } catch (e) {
      console.error('Error reading localStorage, using initial mock values', e);
      setProducts(INITIAL_PRODUCTS);
      setCustomers(INITIAL_CUSTOMERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setSystemLogs(INITIAL_LOGS);
      setSettings(INITIAL_SETTINGS);
    }
  }, []);

  // 4. Synchronize states with LocalStorage whenever they change
  useEffect(() => {
    if (products.length > 0) localStorage.setItem('crm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem('crm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (systemLogs.length > 0) localStorage.setItem('crm_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem('crm_settings', JSON.stringify(settings));
  }, [settings]);

  // 5. Audit Log Logger helper
  const addLogEntry = (action: string, details: string, category: SystemLog['category'], userName: string = 'سیستم') => {
    const timestamp = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());

    const newLog: SystemLog = {
      id: 'log-' + Date.now() + Math.random().toString(36).substring(2, 5),
      timestamp,
      userRole: currentRole,
      userName,
      action,
      details,
      category
    };

    setSystemLogs(prev => [newLog, ...prev]);
  };

  // 6. State Manipulator functions
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleUpdateTransaction = (txId: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, ...updates } : tx));
  };

  const handleAddCustomer = (newCust: Customer) => {
    setCustomers(prev => [newCust, ...prev]);
  };

  const handleUpdateCustomer = (custId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === custId ? { ...c, ...updates } : c));
  };

  const handleDeleteCustomer = (custId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== custId));
    // Optionally void associated transactions or keep them
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p));
  };

  const handleUpdateSettings = (updates: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleClearLogs = () => {
    setSystemLogs([]);
  };

  // 7. Reset to default data
  const handleResetSystem = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌های ثبت‌شده را پاک کرده و سامانه را به داده‌های پیش‌فرض اولیه بازنشانی کنید؟')) {
      localStorage.clear();
      setProducts(INITIAL_PRODUCTS);
      setCustomers(INITIAL_CUSTOMERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setSystemLogs(INITIAL_LOGS);
      setSettings(INITIAL_SETTINGS);
      setCurrentRole('customer');
      alert('داده‌های سامانه با موفقیت بازنشانی شد.');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f1f5f9] flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Sticky top Navigation and Workspace Switcher */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border-b border-[#334155] shadow-xs px-4 py-2">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs">
              <Database className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-100 leading-tight">سامانه جامع مدیریت مشتریان و فروش سه محصول</h1>
              <div className="text-[9px] text-slate-400 mt-0.5 font-medium">محیط یکپارچه: مشتری، مدیر مالی، مدیر فروش و مدیر سیستم</div>
            </div>
          </div>

          {/* Quick Role Select buttons */}
          <div className="bg-[#1e293b] p-0.5 rounded-lg border border-slate-700/60 flex gap-0.5 overflow-x-auto">
            
            <button
              onClick={() => {
                setCurrentRole('customer');
                addLogEntry('تغییر نقش کاربری', 'ورود به محیط فروشگاه و ثبت سفارش مشتریان', 'customer');
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'customer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>فروشگاه و مشتری</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('sales_manager');
                addLogEntry('تغییر نقش کاربری', 'ورود به داشبورد مدیریت فروش', 'sales');
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'sales_manager'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>داشبورد مدیر فروش</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('finance_manager');
                addLogEntry('تغییر نقش کاربری', 'ورود به محیط حسابداری و مدیریت مالی', 'finance');
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'finance_manager'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>پنل مدیر مالی</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('admin');
                addLogEntry('تغییر نقش کاربری', 'ورود به مرکز مدیریت کل سیستم', 'system');
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'admin'
                  ? 'bg-slate-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مدیریت کل سیستم</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            <button
              onClick={() => setShowHelpPanel(prev => !prev)}
              className="p-1 bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-700 transition-colors"
              title="راهنمای گردش کار سیستم"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetSystem}
              className="px-2 py-1 bg-[#1e293b] hover:bg-red-950 text-slate-300 hover:text-red-300 text-[9px] font-bold rounded-md border border-slate-700 hover:border-red-900 transition-all flex items-center gap-1"
              title="بازنشانی سیستم به داده‌های پیش‌فرض"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">بازنشانی داده‌ها</span>
            </button>
          </div>

        </div>
      </header>

      {/* Workflow Explainer Banner */}
      {showHelpPanel && (
        <div className="bg-[#1e293b]/5 border-b border-slate-200 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-start sm:items-center justify-between gap-3 text-[10px] text-slate-700 leading-normal">
            <div className="flex items-start sm:items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
              <p>
                💡 <span className="font-bold text-slate-800">راهنمای فرآیند (Workflow):</span> ابتدا در <span className="font-bold text-blue-700">فروشگاه مشتری</span> سفارش ثبت کنید، سپس در <span className="font-bold text-indigo-700">داشبورد مدیر فروش</span> تایید صلاحیت قرارداد را صادر کنید و نهایتاً در <span className="font-bold text-teal-700">پنل مدیر مالی</span> دریافت وجه را تایید کنید تا تراکنش نهایی شود. <span className="font-bold text-slate-700">مدیریت سیستم</span> نیز امکان تغییر قیمت‌ها و CRUD مشتریان را بر عهده دارد.
              </p>
            </div>
            <button
              onClick={() => setShowHelpPanel(false)}
              className="text-slate-400 hover:text-slate-600 font-bold shrink-0 text-[9px] bg-slate-200/50 hover:bg-slate-200 px-1.5 py-0.5 rounded"
            >
              متوجه شدم ×
            </button>
          </div>
        </div>
      )}

      {/* Main Core Body with Animation Transitions */}
      <main className="flex-1 w-full bg-slate-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
          >
            {currentRole === 'customer' && (
              <CustomerStore
                customers={customers}
                products={products}
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
                onAddCustomer={handleAddCustomer}
                onAddLog={addLogEntry}
              />
            )}

            {currentRole === 'sales_manager' && (
              <SalesManagerDashboard
                customers={customers}
                transactions={transactions}
                products={products}
                onUpdateTransaction={handleUpdateTransaction}
                onUpdateCustomer={handleUpdateCustomer}
                onAddLog={addLogEntry}
              />
            )}

            {currentRole === 'finance_manager' && (
              <FinanceManagerDashboard
                transactions={transactions}
                customers={customers}
                onUpdateTransaction={handleUpdateTransaction}
                onAddLog={addLogEntry}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                customers={customers}
                products={products}
                systemLogs={systemLogs}
                settings={settings}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onUpdateProductPrice={handleUpdateProductPrice}
                onUpdateSettings={handleUpdateSettings}
                onAddLog={addLogEntry}
                onClearLogs={handleClearLogs}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span>طراحی شده بر اساس نیازهای ثبت اطلاعات مشتریان و خرید محصولات سه گانه</span>
          </div>
          <div className="font-mono text-slate-500">
            توسعه فنی بر بستر React و Tailwind CSS • {new Date().getFullYear()}
          </div>
        </div>
      </footer>

    </div>
  );
}
