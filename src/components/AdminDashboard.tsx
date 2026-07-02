/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Database, 
  Trash2, 
  Edit3, 
  UserPlus, 
  TrendingUp, 
  FileText, 
  Plus, 
  ShieldAlert, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  Activity,
  Check,
  X,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Customer, Product, SystemLog, SystemSettings } from '../types';

interface AdminDashboardProps {
  customers: Customer[];
  products: Product[];
  systemLogs: SystemLog[];
  settings: SystemSettings;
  onAddCustomer: (c: Customer) => void;
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
  onUpdateProductPrice: (id: string, newPrice: number) => void;
  onUpdateSettings: (updates: Partial<SystemSettings>) => void;
  onAddLog: (action: string, details: string, category: 'system' | 'sales' | 'finance' | 'customer', userName: string) => void;
  onClearLogs: () => void;
}

export default function AdminDashboard({
  customers,
  products,
  systemLogs,
  settings,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onUpdateProductPrice,
  onUpdateSettings,
  onAddLog,
  onClearLogs
}: AdminDashboardProps) {
  // Tabs within admin panel
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'products' | 'logs' | 'settings'>('users');

  // Customer Add/Edit State
  const [isEditingCust, setIsEditingCust] = useState<Customer | null>(null);
  const [custFormName, setCustFormName] = useState('');
  const [custFormPhone, setCustFormPhone] = useState('');
  const [custFormEmail, setCustFormEmail] = useState('');
  const [custFormCompany, setCustFormCompany] = useState('');
  const [custFormNotes, setCustFormNotes] = useState('');
  const [custFormStatus, setCustFormStatus] = useState<'active' | 'inactive'>('active');
  const [showAddForm, setShowAddForm] = useState(false);

  // Search Filter for logs
  const [logFilterCategory, setLogFilterCategory] = useState<'all' | 'system' | 'sales' | 'finance' | 'customer'>('all');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Search Filter for customers
  const [custSearchQuery, setCustSearchQuery] = useState('');

  // Format currency helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Open edit modal for customer
  const startEditCustomer = (cust: Customer) => {
    setIsEditingCust(cust);
    setCustFormName(cust.fullName);
    setCustFormPhone(cust.phone);
    setCustFormEmail(cust.email);
    setCustFormCompany(cust.company || '');
    setCustFormNotes(cust.notes || '');
    setCustFormStatus(cust.status);
    setShowAddForm(false);
  };

  // Handle Save (Add or Edit) customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFormName || !custFormPhone || !custFormEmail) {
      alert('پر کردن نام، تلفن و ایمیل الزامی است.');
      return;
    }

    if (isEditingCust) {
      // Edit mode
      onUpdateCustomer(isEditingCust.id, {
        fullName: custFormName,
        phone: custFormPhone,
        email: custFormEmail,
        company: custFormCompany || undefined,
        notes: custFormNotes || undefined,
        status: custFormStatus
      });

      onAddLog(
        'ویرایش مشخصات مشتری',
        `اطلاعات مشتری "${custFormName}" توسط مدیر سیستم بروزرسانی شد.`,
        'system',
        'مدیر کل سیستم'
      );

      setIsEditingCust(null);
    } else {
      // Add mode
      const newCust: Customer = {
        id: 'cust-' + Date.now(),
        fullName: custFormName,
        phone: custFormPhone,
        email: custFormEmail,
        company: custFormCompany || undefined,
        joinedDate: new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
        status: custFormStatus,
        notes: custFormNotes || undefined
      };

      onAddCustomer(newCust);
      onAddLog(
        'ثبت مشتری دستی',
        `مشتری جدید "${newCust.fullName}" توسط مدیر سیستم بصورت دستی افزوده شد.`,
        'system',
        'مدیر کل سیستم'
      );

      setShowAddForm(false);
    }

    // Reset Form
    setCustFormName('');
    setCustFormPhone('');
    setCustFormEmail('');
    setCustFormCompany('');
    setCustFormNotes('');
    setCustFormStatus('active');
  };

  // Cancel edit/add form
  const handleCancelForm = () => {
    setIsEditingCust(null);
    setShowAddForm(false);
    setCustFormName('');
    setCustFormPhone('');
    setCustFormEmail('');
    setCustFormCompany('');
    setCustFormNotes('');
    setCustFormStatus('active');
  };

  // Handle Product Price change
  const handlePriceUpdate = (id: string, name: string, currentVal: number) => {
    const input = prompt(`قیمت جدید را برای محصول "${name}" به تومان وارد کنید:`, currentVal.toString());
    if (input === null) return;
    const newPrice = parseInt(input);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('مبلغ وارد شده معتبر نمی‌باشد.');
      return;
    }
    onUpdateProductPrice(id, newPrice);
    onAddLog(
      'تغییر قیمت محصول',
      `قیمت محصول "${name}" به میزان ${formatPrice(newPrice)} تغییر یافت.`,
      'system',
      'مدیر کل سیستم'
    );
    alert('قیمت جدید در فروشگاه اعمال گردید.');
  };

  // Filter logs
  const filteredLogs = systemLogs.filter(log => {
    const matchesCategory = logFilterCategory === 'all' || log.category === logFilterCategory;
    const matchesSearch = log.action.includes(logSearchQuery) || log.details.includes(logSearchQuery) || log.userName.includes(logSearchQuery);
    return matchesCategory && matchesSearch;
  });

  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.fullName.includes(custSearchQuery) || 
    c.phone.includes(custSearchQuery) || 
    (c.company && c.company.includes(custSearchQuery))
  );

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#f1f5f9] p-3 md:p-5 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1e1b4b] to-[#0f172a] rounded-lg p-4 md:p-5 text-white border border-[#4338ca]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                بخش مدیریت سیستم (Root Admin)
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold mt-1.5 tracking-tight">پنل سرپرست کل و پیکربندی سیستم</h1>
            <p className="text-indigo-100/80 text-[11px] mt-1 max-w-xl">
              کنترل پایگاه داده مشتریان، تغییر نرخ خدمات سه گانه، مشاهده گزارش گزارش رویدادها و اعمال تغییرات امنیتی.
            </p>
          </div>
          <div className="bg-[#0f172a]/70 border border-indigo-800/40 p-2.5 rounded-lg flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold shadow-xs">
              SYS
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-100 leading-tight">سرپرست کل سیستم</div>
              <div className="text-[9px] text-indigo-300 mt-0.5 font-medium">دسترسی ریشه (Root Access)</div>
            </div>
          </div>
        </div>

        {/* Admin Tab Selectors */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeSubTab === 'users' 
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white rounded-t' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>مدیریت مشتریان ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeSubTab === 'products' 
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white rounded-t' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>تنظیم قیمت خدمات سه گانه</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeSubTab === 'logs' 
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white rounded-t' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>لاگ‌های امنیتی سیستم ({systemLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeSubTab === 'settings' 
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white rounded-t' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>تنظیمات عمومی</span>
          </button>
        </div>

        {/* Tab 1: Customer Database Manager (CRUD) */}
        {activeSubTab === 'users' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، تلفن یا سازمان..."
                  value={custSearchQuery}
                  onChange={(e) => setCustSearchQuery(e.target.value)}
                  className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              {!showAddForm && !isEditingCust && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ثبت مشتری جدید</span>
                </button>
              )}
            </div>

            {/* Form Drawer (for adding or editing) */}
            {(showAddForm || isEditingCust) && (
              <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-2xs animate-fade-in space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>{isEditingCust ? `ویرایش اطلاعات مشتری: ${isEditingCust.fullName}` : 'افزودن حساب کاربری مشتری'}</span>
                </h3>

                <form onSubmit={handleSaveCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">نام کامل <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={custFormName}
                      onChange={(e) => setCustFormName(e.target.value)}
                      placeholder="امیر رضایی"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">شماره همراه <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={custFormPhone}
                      onChange={(e) => setCustFormPhone(e.target.value)}
                      placeholder="09120000000"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">پست الکترونیک <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={custFormEmail}
                      onChange={(e) => setCustFormEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">نام شرکت / سازمان (اختیاری)</label>
                    <input
                      type="text"
                      value={custFormCompany}
                      onChange={(e) => setCustFormCompany(e.target.value)}
                      placeholder="شرکت مپنا"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">یادداشت‌های کاربردی مدیر سیستم</label>
                      <textarea
                        rows={1.5}
                        value={custFormNotes}
                        onChange={(e) => setCustFormNotes(e.target.value)}
                        placeholder="نکات یا نیازهای مشتری..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">وضعیت حساب</label>
                      <select
                        value={custFormStatus}
                        onChange={(e) => setCustFormStatus(e.target.value as 'active' | 'inactive')}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="active">فعال (Active)</option>
                        <option value="inactive">غیرفعال (Inactive)</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex gap-2 pt-2.5 border-t border-slate-150">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded text-[11px] font-bold transition-all"
                    >
                      ذخیره اطلاعات مشتری
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-1.5 rounded text-[11px] font-bold transition-all"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Customers Data Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-[11px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">نام کامل مشتری</th>
                      <th className="p-2.5">شماره تماس</th>
                      <th className="p-2.5">ایمیل</th>
                      <th className="p-2.5">شرکت</th>
                      <th className="p-2.5">عضویت</th>
                      <th className="p-2.5">وضعیت حساب</th>
                      <th className="p-2.5 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-700">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-800">{cust.fullName}</td>
                          <td className="p-2.5 font-mono text-slate-500">{cust.phone}</td>
                          <td className="p-2.5 font-mono text-slate-500 text-left" dir="ltr">{cust.email}</td>
                          <td className="p-2.5 font-sans">{cust.company || <span className="text-slate-300">-</span>}</td>
                          <td className="p-2.5 text-slate-400">{cust.joinedDate}</td>
                          <td className="p-2.5">
                            {cust.status === 'active' ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[9px] font-bold">
                                فعال
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[9px]">
                                غیرفعال
                              </span>
                            )}
                          </td>
                          <td className="p-2.5">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => startEditCustomer(cust)}
                                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded border border-slate-200 transition-colors"
                                title="ویرایش"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`آیا از حذف مشتری "${cust.fullName}" اطمینان دارید؟ تمامی ارجاعات حذف خواهد شد.`)) {
                                    onDeleteCustomer(cust.id);
                                    onAddLog('حذف مشتری', `مشتری "${cust.fullName}" توسط سرپرست کل حذف شد.`, 'system', 'مدیر کل سیستم');
                                  }
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded border border-slate-200 transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                          هیچ موردی پیدا نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Pricing Manager for the 3 products */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 text-xs mb-1">تغییر زنده قیمت محصولات و خدمات</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                با تغییر قیمت خدمات ۳ گانه در این بخش، هزینه ثبت سفارش در ثانیه‌ای بعد برای تمامی مشتریان مراجع در درگاه تغییر پیدا می‌کند.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg p-4 border border-slate-200 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                      {product.category}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs mt-2.5 leading-snug">{product.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
                    
                    <div className="mt-3 bg-slate-50 border border-slate-150 rounded p-2 text-center">
                      <span className="text-[9px] text-slate-400">قیمت فعلی در سیستم</span>
                      <div className="font-sans font-bold text-slate-800 text-xs mt-0.5">{formatPrice(product.price)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePriceUpdate(product.id, product.name, product.price)}
                    className="w-full mt-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-3xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>تغییر قیمت محصول</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: System Audit logs */}
        {activeSubTab === 'logs' && (
          <div className="space-y-3">
            
            {/* Filter and control panel */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-600 text-[11px]">فیلتر دسته بندی:</span>
                <div className="flex gap-1 text-[10px]">
                  {(['all', 'system', 'sales', 'finance', 'customer'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setLogFilterCategory(cat)}
                      className={`px-2 py-0.5 rounded border transition-all font-bold ${
                        logFilterCategory === cat 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'all' && 'همه لاگ‌ها'}
                      {cat === 'system' && 'سیستمی'}
                      {cat === 'sales' && 'فروش'}
                      {cat === 'finance' && 'مالی'}
                      {cat === 'customer' && 'مشتریان'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="جستجوی متن لاگ..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    if (confirm('آیا از پاکسازی تاریخچه رویدادهای سرور اطمینان دارید؟')) {
                      onClearLogs();
                      onAddLog('پاکسازی لاگ', 'تاریخچه لاگ‌های سیستمی پاک شد.', 'system', 'مدیر کل سیستم');
                    }
                  }}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded border border-red-200 transition-colors text-[10px]"
                >
                  حذف همه لاگ‌ها
                </button>
              </div>
            </div>

            {/* Logs List Container */}
            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 font-mono text-[10px] border border-slate-800 space-y-1.5 max-h-[400px] overflow-y-auto">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <div key={log.id} className="border-b border-slate-800/60 pb-1.5 last:border-none flex items-start gap-2">
                    <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 select-none ${
                      log.category === 'system' ? 'bg-indigo-900/50 text-indigo-400' :
                      log.category === 'sales' ? 'bg-emerald-900/50 text-emerald-400' :
                      log.category === 'finance' ? 'bg-teal-900/50 text-teal-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {log.category.toUpperCase()}
                    </span>
                    <div>
                      <span className="font-bold text-slate-200 ml-1">{log.userName}:</span>
                      <span className="text-amber-400 font-bold font-sans ml-1">{log.action}</span>
                      <span className="text-slate-405 font-sans leading-relaxed">{log.details}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  هیچ گزارش لاگی با فیلتر کنونی مطابقت ندارد.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 4: General Settings */}
        {activeSubTab === 'settings' && (
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-3xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-150">تنظیمات و پارامترهای بومی سامانه</h3>

            <div className="space-y-3 max-w-xl">
              
              {/* Toggle 1: Registration flag */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">امکان ثبت‌نام مشتری جدید کاربری</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">در صورت غیرفعال بودن، تنها مشتریان موجود در پایگاه‌داده دسترسی خواهند داشت.</div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ allowNewRegistrations: !settings.allowNewRegistrations });
                    onAddLog(
                      'تغییر پیکربندی ثبت نام',
                      `مجوز ثبت نام مشتریان جدید به "${!settings.allowNewRegistrations ? 'فعال' : 'غیرفعال'}" تغییر یافت.`,
                      'system',
                      'مدیر کل سیستم'
                    );
                  }}
                  className="p-1 text-slate-600 hover:text-slate-900"
                >
                  {settings.allowNewRegistrations ? (
                    <ToggleRight className="w-8 h-8 text-indigo-650" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Input Tax Rate */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">نرخ پیش‌فرض مالیات بر ارزش افزوده</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">در صدور فاکتورهای مالی واحد حسابداری به کار می‌رود.</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settings.taxRatePercent}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      onUpdateSettings({ taxRatePercent: val });
                    }}
                    className="w-12 px-1.5 py-1 bg-white border border-slate-250 rounded text-xs font-bold text-center"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">% درصد</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-700 leading-relaxed flex items-start gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  نکته امنیتی: به عنوان سرپرست کل سیستم، مسئولیت بررسی و بازرسی فعالیت‌های مالی و تاییدات فروش تماماً به عهده شماست. فعالیت کاربران به صورت خودکار در بخش لاگ‌های سیستم ثبت و آرشیو امنیتی می‌گردد.
                </span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
