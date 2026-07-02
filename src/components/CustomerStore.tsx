/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  CloudLightning, 
  Briefcase, 
  ShoppingCart, 
  UserPlus, 
  History, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  CreditCard, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Sparkles,
  Search,
  Check
} from 'lucide-react';
import { Product, Customer, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerStoreProps {
  customers: Customer[];
  products: Product[];
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onAddCustomer: (c: Customer) => void;
  onAddLog: (action: string, details: string, category: 'system' | 'sales' | 'finance' | 'customer', userName: string) => void;
}

export default function CustomerStore({
  customers,
  products,
  transactions,
  onAddTransaction,
  onAddCustomer,
  onAddLog
}: CustomerStoreProps) {
  // Authentication & Session
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new registration
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regNotes, setRegNotes] = useState('');

  // Purchase state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'درگاه آنلاین' | 'کارت به کارت' | 'اعتباری'>('درگاه آنلاین');
  const [purchaseSuccessCode, setPurchaseSuccessCode] = useState<string | null>(null);

  // Filter customers for search login
  const activeCustomers = customers.filter(c => c.status === 'active');
  const filteredCustomers = activeCustomers.filter(c => 
    c.fullName.includes(searchQuery) || 
    c.phone.includes(searchQuery) || 
    (c.company && c.company.includes(searchQuery))
  );

  // Format money helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Icon switcher helper
  const renderProductIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-blue-600' };
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'CloudLightning': return <CloudLightning {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      default: return <ShoppingCart {...props} />;
    }
  };

  // Handle registration submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regEmail) {
      alert('لطفاً فیلدهای اجباری (نام، تلفن، ایمیل) را پر کنید.');
      return;
    }

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      fullName: regName,
      phone: regPhone,
      email: regEmail,
      company: regCompany || undefined,
      joinedDate: new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
      status: 'active',
      notes: regNotes
    };

    onAddCustomer(newCust);
    setCurrentCustomer(newCust);
    setIsRegistering(false);
    onAddLog(
      'ثبت نام مشتری جدید',
      `مشتری جدید "${newCust.fullName}" ثبت نام کرد و وارد فروشگاه شد.`,
      'customer',
      newCust.fullName
    );

    // Clear form
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegCompany('');
    setRegNotes('');
  };

  // Handle purchase submission
  const handlePurchase = () => {
    if (!currentCustomer || !selectedProduct) return;

    const trackingCode = 'TRX-' + Math.floor(100000 + Math.random() * 900000);
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      customerId: currentCustomer.id,
      customerName: currentCustomer.fullName,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      amount: selectedProduct.price,
      date: new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
      status: 'pending',
      paymentMethod,
      trackingCode
    };

    onAddTransaction(newTx);
    onAddLog(
      'ثبت سفارش محصول',
      `سفارش محصول "${selectedProduct.name}" با روش پرداخت "${paymentMethod}" ثبت شد. کد پیگیری: ${trackingCode}`,
      'customer',
      currentCustomer.fullName
    );

    setPurchaseSuccessCode(trackingCode);
    setSelectedProduct(null);
  };

  // Filter transaction history for current customer
  const customerTransactions = currentCustomer
    ? transactions.filter(t => t.customerId === currentCustomer.id)
    : [];

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#f1f5f9] p-3 md:p-5 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner/Header */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-lg p-4 md:p-5 text-white border border-[#334155] shadow-xs mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-5">
            <ShoppingCart className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
              بخش کاربری و فروشگاه مشتریان
            </span>
            <h1 className="text-lg md:text-xl font-bold mt-1.5 tracking-tight">فروشگاه اختصاصی و پنل ثبت سفارش</h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              به عنوان مشتری می‌توانید مشخصات خود را ثبت کنید، یکی از سه محصول برتر ما را انتخاب نموده و خرید خود را جهت تایید نهایی ثبت نمایید.
            </p>
          </div>
        </div>

        {/* Auth / Selection Barrier */}
        {!currentCustomer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            
            {/* Box 1: Select Existing Client */}
            <div className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">انتخاب مشتری قبلی</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">وارد حساب کاربری قبلی خود شوید تا خرید جدید ثبت کنید.</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجوی نام یا شماره همراه..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-8 pl-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Customers List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-150 border border-slate-200 rounded">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(cust => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        setCurrentCustomer(cust);
                        onAddLog('ورود مشتری', `مشتری "${cust.fullName}" وارد سیستم فروشگاه شد.`, 'customer', cust.fullName);
                      }}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-blue-50/50 text-right transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 text-xs">{cust.fullName}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex gap-2">
                          <span>{cust.phone}</span>
                          {cust.company && <span>• {cust.company}</span>}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                        <span>انتخاب</span>
                        <ArrowRight className="w-3 h-3 rotate-180" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    هیچ مشتری فعالی پیدا نشد.
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Register New Client */}
            <div className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 rounded text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">ثبت نام مشتری جدید</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">اطلاعات خود را در سامانه ثبت کنید تا حساب شما فوراً فعال شود.</p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: سهراب بهرامی"
                    className="w-full px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">شماره همراه <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="مثال: 09121234567"
                      className="w-full px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">آدرس ایمیل <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">نام شرکت / سازمان (اختیاری)</label>
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="مثال: هلدینگ پارسیان"
                    className="w-full px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 font-sans">توضیحات یا نیازها (اختیاری)</label>
                  <textarea
                    rows={1}
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    placeholder="مثال: علاقه‌مند به دریافت مشاوره دیجیتال مارکتینگ..."
                    className="w-full px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ثبت نام و ورود به فروشگاه</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            
            {/* Logged in header / Profile Switcher */}
            <div className="bg-white rounded-lg p-3.5 shadow-2xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">مشتری وارد شده:</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-slate-850 text-sm">{currentCustomer.fullName}</span>
                    {currentCustomer.company && (
                      <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                        <Building className="w-2.5 h-2.5" />
                        {currentCustomer.company}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> {currentCustomer.phone}</span>
                    <span className="flex items-center gap-0.5" dir="ltr"><Mail className="w-2.5 h-2.5" /> {currentCustomer.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onAddLog('خروج مشتری', `مشتری "${currentCustomer.fullName}" خارج شد.`, 'customer', currentCustomer.fullName);
                    setCurrentCustomer(null);
                    setPurchaseSuccessCode(null);
                  }}
                  className="px-3 py-1.5 border border-slate-200 hover:border-red-200 hover:text-red-600 text-slate-600 text-[10px] font-bold rounded transition-all"
                >
                  تغییر مشتری / خروج
                </button>
              </div>
            </div>

            {/* Purchase Success Alert */}
            {purchaseSuccessCode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-600 text-white rounded-full">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">خرید با موفقیت ثبت شد!</h4>
                    <p className="text-[10px] text-blue-700 mt-0.5">
                      سفارش شما با موفقیت در سیستم ثبت گردید. این تراکنش منتظر تایید مدیر فروش و مدیر مالی است.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-blue-100 px-3 py-1 rounded text-center self-stretch sm:self-auto flex flex-col justify-center">
                  <span className="text-[8px] text-slate-400">کد پیگیری تراکنش</span>
                  <span className="font-mono text-xs font-bold text-blue-700 tracking-wide mt-0.5">{purchaseSuccessCode}</span>
                </div>
              </motion.div>
            )}

            {/* Core Section: 3 Products and Transaction History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left & Middle: Products grid (2 cols on large screen) */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>محصولات برتر قابل سفارش (۳ خدمت هوشمند)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products.map(product => (
                    <div 
                      key={product.id}
                      className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200">
                            {product.category}
                          </span>
                          <div className="p-1 bg-blue-50 rounded">
                            {renderProductIcon(product.iconName)}
                          </div>
                        </div>

                        {/* Info */}
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{product.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{product.description}</p>

                        {/* Features */}
                        <div className="mt-3.5 space-y-1.5">
                          <span className="text-[9px] font-bold text-slate-400 block mb-0.5">مزایا و جزئیات:</span>
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                              <Check className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Buy Button & Pricing */}
                      <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between gap-1.5">
                        <div>
                          <div className="text-[9px] text-slate-400">قیمت نهایی:</div>
                          <div className="text-xs font-bold text-slate-800 font-sans mt-0.5">{formatPrice(product.price)}</div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setPurchaseSuccessCode(null);
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>خرید خدمت</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty state or additional helper */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-6 h-6 text-slate-400 mb-2" />
                    <h5 className="font-bold text-slate-700 text-xs">محصولات ویژه سفارشی</h5>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                      این ۳ خدمت به عنوان هسته اصلی سیستم طراحی شده‌اند. برای خرید اختصاصی سازمان‌ها، با مدیر فروش در ارتباط باشید.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Col: Transaction History */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>سابقه خریدهای شما</span>
                </h3>

                <div className="bg-white rounded-lg p-3 shadow-2xs border border-slate-200 space-y-3 max-h-[500px] overflow-y-auto">
                  {customerTransactions.length > 0 ? (
                    customerTransactions.map(tx => (
                      <div key={tx.id} className="border-b border-slate-100 last:border-none pb-2.5 last:pb-0">
                        <div className="flex justify-between items-start gap-1.5">
                          <h5 className="font-bold text-slate-800 text-[11px] leading-tight">{tx.productName}</h5>
                          
                          {/* Status pill */}
                          {tx.status === 'approved' && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              تایید نهایی
                            </span>
                          )}
                          {tx.status === 'pending' && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              درحال بررسی
                            </span>
                          )}
                          {tx.status === 'rejected' && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold shrink-0">
                              <XCircle className="w-2.5 h-2.5" />
                              رد شده
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-sans">
                          <span>مبلغ: {formatPrice(tx.amount)}</span>
                          <span>تاریخ: {tx.date}</span>
                        </div>

                        <div className="mt-1.5 bg-slate-50 border border-slate-150 rounded p-1.5 flex items-center justify-between text-[9px] text-slate-500 font-sans">
                          <span>پرداخت: {tx.paymentMethod}</span>
                          <span className="font-mono">کد: {tx.trackingCode}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <Clock className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                      هنوز هیچ سفارشی ثبت نکرده‌اید.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Purchase Confirmation Modal / Bottom Drawer */}
        <AnimatePresence>
          {selectedProduct && currentCustomer && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl border border-slate-200 text-right"
                dir="rtl"
              >
                {/* Modal Header */}
                <div className="p-3.5 bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-650 text-white rounded">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-xs sm:text-sm">فرم خرید خدمت هوشمند</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">لطفاً شیوه پرداخت خود را جهت ثبت و تایید نهایی مشخص کنید.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 space-y-3">
                  {/* Product Details Mini Panel */}
                  <div className="bg-blue-50/40 rounded border border-blue-100 p-3">
                    <span className="text-[9px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-bold">{selectedProduct.category}</span>
                    <h5 className="font-bold text-slate-800 text-xs mt-1">{selectedProduct.name}</h5>
                    <div className="flex justify-between items-center text-[11px] text-slate-600 mt-3 font-sans">
                      <span>مبلغ قابل پرداخت:</span>
                      <span className="font-bold text-blue-700 text-xs">{formatPrice(selectedProduct.price)}</span>
                    </div>
                  </div>

                  {/* Customer Mini Panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2 flex justify-between text-[11px] text-slate-600">
                    <span>ثبت فاکتور بنام مشتری:</span>
                    <span className="font-bold text-slate-800">{currentCustomer.fullName}</span>
                  </div>

                  {/* Payment Method Option */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1.5">روش پرداخت سفارش:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['درگاه آنلاین', 'کارت به کارت', 'اعتباری'] as const).map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2 rounded border text-[10px] font-bold transition-all text-center flex flex-col items-center gap-1 ${
                            paymentMethod === method 
                              ? 'border-blue-600 bg-blue-50 text-blue-700' 
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          {method === 'درگاه آنلاین' && <CreditCard className="w-3.5 h-3.5" />}
                          {method === 'کارت به کارت' && <ShoppingCart className="w-3.5 h-3.5" />}
                          {method === 'اعتباری' && <User className="w-3.5 h-3.5" />}
                          <span>{method}</span>
                        </button>
                      ))}
                    </div>
                    {paymentMethod === 'کارت به کارت' && (
                      <p className="text-[9px] text-amber-700 mt-2 bg-amber-50 p-2 rounded border border-amber-200 leading-normal">
                        * واریز وجه را به شماره کارت ۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸ بنام شرکت ثبت نموده و منتظر تایید بخش مالی بمانید.
                      </p>
                    )}
                    {paymentMethod === 'اعتباری' && (
                      <p className="text-[9px] text-indigo-700 mt-2 bg-indigo-50 p-2 rounded border border-indigo-200 leading-normal">
                        * خرید اعتباری ویژه مشتریان طلایی و تایید شده توسط مدیر سیستم می‌باشد.
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-150 flex gap-2">
                  <button
                    onClick={handlePurchase}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تایید و ثبت نهایی سفارش</span>
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-750 rounded text-[11px] font-bold transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
