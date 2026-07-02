/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Receipt, 
  FileText, 
  ShieldCheck, 
  RefreshCw,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { Transaction, Customer } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FinanceManagerDashboardProps {
  transactions: Transaction[];
  customers: Customer[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onAddLog: (action: string, details: string, category: 'system' | 'sales' | 'finance' | 'customer', userName: string) => void;
}

export default function FinanceManagerDashboard({
  transactions,
  customers,
  onUpdateTransaction,
  onAddLog
}: FinanceManagerDashboardProps) {
  const [selectedTxForInvoice, setSelectedTxForInvoice] = useState<Transaction | null>(null);

  // Format currency helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // 1. Calculations & Metrics
  const approvedTransactions = transactions.filter(t => t.status === 'approved');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  // Total Revenue (Only fully approved transactions)
  const totalRevenue = approvedTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Pending Revenue (Awaiting approval)
  const totalPendingRevenue = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Average Order Value (AOV)
  const averageOrderValue = approvedTransactions.length > 0 
    ? Math.round(totalRevenue / approvedTransactions.length) 
    : 0;

  // Estimated Value Added Tax (VAT 9%)
  const estimatedTax = Math.round(totalRevenue * 0.09);

  // 2. Chart Data: Monthly Revenue or Transaction Date Trend
  const dateRevenueMap: Record<string, { total: number; approved: number }> = {};
  transactions.forEach(t => {
    const date = t.date;
    if (!dateRevenueMap[date]) {
      dateRevenueMap[date] = { total: 0, approved: 0 };
    }
    dateRevenueMap[date].total += t.amount;
    if (t.status === 'approved') {
      dateRevenueMap[date].approved += t.amount;
    }
  });

  const chartData = Object.keys(dateRevenueMap).map(date => ({
    date,
    'کل مبالغ سفارشات': dateRevenueMap[date].total,
    'درآمد وصول شده': dateRevenueMap[date].approved
  })).sort((a, b) => a.date.localeCompare(b.date));

  // 3. Chart Data: Payment Methods Distribution
  const paymentMethodCount: Record<string, number> = {
    'درگاه آنلاین': 0,
    'کارت به کارت': 0,
    'اعتباری': 0
  };
  transactions.forEach(t => {
    if (t.status !== 'rejected') {
      paymentMethodCount[t.paymentMethod] = (paymentMethodCount[t.paymentMethod] || 0) + 1;
    }
  });

  const pieData = Object.keys(paymentMethodCount).map(key => ({
    name: key,
    value: paymentMethodCount[key]
  }));

  const PIE_COLORS = ['#0d9488', '#d97706', '#0284c7'];

  // Process Financial Approval
  const handleFinanceAction = (txId: string, action: 'approve' | 'reject') => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    const todayString = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

    if (action === 'approve') {
      const updates: Partial<Transaction> = {
        financeApprovalDate: todayString
      };

      // If sales is also approved, finalize transaction status to 'approved'
      if (tx.salesApprovalDate) {
        updates.status = 'approved';
      }

      onUpdateTransaction(txId, updates);
      onAddLog(
        'تایید مالی تراکنش',
        `دریافت فیش واریزی کد پیگیری ${tx.trackingCode} به ارزش ${formatPrice(tx.amount)} توسط مدیر مالی تایید نهایی شد.`,
        'finance',
        'نرگس تهرانی (مدیر مالی)'
      );
    } else {
      onUpdateTransaction(txId, {
        status: 'rejected'
      });
      onAddLog(
        'رد مالی تراکنش',
        `تراکنش مالی کد پیگیری ${tx.trackingCode} به دلیل عدم واریز یا نقص مدارک رد شد.`,
        'finance',
        'نرگس تهرانی (مدیر مالی)'
      );
    }
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#f1f5f9] p-3 md:p-5 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#115e59] to-[#0f172a] rounded-lg p-4 md:p-5 text-white border border-[#14b8a6]/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
              <span className="bg-teal-500/20 text-teal-300 text-[9px] font-bold px-2 py-0.5 rounded border border-teal-500/30">
                سیستم یکپارچه حسابداری و مدیریت مالی
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold mt-1.5 tracking-tight">پنل مدیریت مالی و صدور فاکتور</h1>
            <p className="text-teal-100/80 text-[11px] mt-1 max-w-xl">
              تایید اسناد واریزی بانکی، صدور فاکتور رسمی با احتساب مالیات ارزش افزوده و آنالیز درآمدهای وصول‌شده شرکت.
            </p>
          </div>
          <div className="bg-[#0f172a]/70 border border-teal-800/40 p-2.5 rounded-lg flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white text-xs font-bold shadow-xs">
              ن‌ت
            </div>
            <div>
              <div className="text-[11px] font-bold text-teal-100 leading-tight">نرگس تهرانی</div>
              <div className="text-[9px] text-teal-300 mt-0.5 font-medium">مدیر امور مالی و بودجه</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">کل درآمد وصول شده</span>
              <h3 className="text-sm font-bold text-emerald-600 mt-0.5 font-sans">{formatPrice(totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">درآمد در حال انتظار (معلق)</span>
              <h3 className="text-sm font-bold text-amber-600 mt-0.5 font-sans">{formatPrice(totalPendingRevenue)}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">میانگین ارزش سفارش (AOV)</span>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5 font-sans">{formatPrice(averageOrderValue)}</h3>
            </div>
            <div className="p-2 bg-teal-50 text-teal-600 rounded">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">مالیات بر ارزش افزوده (۹٪)</span>
              <h3 className="text-sm font-bold text-slate-700 mt-0.5 font-sans">{formatPrice(estimatedTax)}</h3>
            </div>
            <div className="p-2 bg-slate-50 text-slate-650 rounded">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Payment Verification Queue */}
        <div className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-teal-600" />
              <span>صف بررسی فیش‌های واریزی و تراکنش‌های بانکی</span>
            </h2>
            <span className="bg-teal-50 text-teal-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
              {pendingTransactions.length} تراکنش معلق نیازمند بررسی مالی
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold border-b border-slate-200">
                  <th className="p-2.5">مشتری</th>
                  <th className="p-2.5">کد پیگیری</th>
                  <th className="p-2.5">محصول خریده شده</th>
                  <th className="p-2.5">روش پرداخت</th>
                  <th className="p-2.5">مبلغ نهایی</th>
                  <th className="p-2.5">وضعیت تایید فروش</th>
                  <th className="p-2.5 text-center">عملیات حسابداری</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-[11px]">
                {pendingTransactions.length > 0 ? (
                  pendingTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-800">{tx.customerName}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-500 text-[10px]">{tx.trackingCode}</td>
                      <td className="p-2.5 text-slate-600">{tx.productName}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          tx.paymentMethod === 'درگاه آنلاین' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : tx.paymentMethod === 'کارت به کارت'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-slate-800 font-sans">{formatPrice(tx.amount)}</td>
                      <td className="p-2.5">
                        {tx.salesApprovalDate ? (
                          <span className="text-blue-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            تایید فروش شده ({tx.salesApprovalDate})
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            منتظر نظر مدیر فروش
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {!tx.financeApprovalDate ? (
                            <>
                              <button
                                onClick={() => handleFinanceAction(tx.id, 'approve')}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded font-bold flex items-center gap-0.5 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>تایید دریافت</span>
                              </button>
                              <button
                                onClick={() => handleFinanceAction(tx.id, 'reject')}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold flex items-center gap-0.5 border border-rose-200 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>رد سند</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-emerald-600 font-bold text-[10px]">بخش مالی تایید شد</span>
                          )}
                          <button
                            onClick={() => setSelectedTxForInvoice(tx)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1 rounded border border-slate-200 transition-colors"
                            title="مشاهده فاکتور"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                      هیچ تراکنش معلقی برای بررسی اسناد مالی وجود ندارد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Charts & Invoice Printing Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Revenue over time (Bar chart) */}
          <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-2xs border border-slate-200 space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-650" />
              <span>جریان درآمد شرکت به تفکیک تاریخ‌ها</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              مقایسه ارزش کل سفارشات ثبت‌شده با مبالغی که تایید دریافت وجه نهایی (وصول‌شده) دریافت کرده‌اند.
            </p>

            <div className="h-48 w-full font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: '10px', borderRadius: '4px', borderColor: '#e2e8f0' }}
                    formatter={(value: any) => [formatPrice(value), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                  <Bar dataKey="کل مبالغ سفارشات" fill="#cbd5e1" radius={[3, 3, 0, 0]} name="کل مبالغ سفارشات" />
                  <Bar dataKey="درآمد وصول شده" fill="#0d9488" radius={[3, 3, 0, 0]} name="درآمد وصول شده (تایید مالی)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods Distribution Chart (Pie chart) */}
          <div className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <CreditCard className="w-4 h-4 text-teal-650" />
                <span>سهم روش‌های پرداخت</span>
              </h2>
              <p className="text-[10px] text-slate-400 leading-normal">
                بررسی سهم تراکنش‌های بانکی برخط، کارت‌به‌کارت و اعتباری کل فاکتورها.
              </p>

              <div className="h-32 w-full flex items-center justify-center mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '9px', direction: 'rtl' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] text-slate-600 font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value} سفارش</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Invoice Modal */}
        {selectedTxForInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-3">
            <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl border border-slate-300 text-right font-sans" dir="rtl">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <Receipt className="text-teal-650 w-4 h-4" />
                  <h4 className="font-bold text-slate-800 text-xs">پیش‌فاکتور رسمی دیجیتال</h4>
                </div>
                <button 
                  onClick={() => setSelectedTxForInvoice(null)}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold hover:bg-slate-200/50 px-2 py-1 rounded transition-colors"
                >
                  بستن پنجره
                </button>
              </div>

              {/* Invoice Printable Body */}
              <div className="p-5 space-y-4">
                
                {/* Invoice Meta */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-dashed border-slate-200 pb-3 font-sans">
                  <div>
                    <div>کد رهگیری: <span className="font-bold text-slate-800">{selectedTxForInvoice.trackingCode}</span></div>
                    <div className="mt-0.5">تاریخ فاکتور: {selectedTxForInvoice.date}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-teal-700">سامانه خدمات هوشمند</div>
                    <div className="mt-0.5">واحد امور مالی و حسابداری</div>
                  </div>
                </div>

                {/* Customer and Vendor Meta */}
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
                    <span className="text-slate-400 block mb-0.5">خریدار:</span>
                    <div className="font-bold text-slate-800">{selectedTxForInvoice.customerName}</div>
                    <div className="text-slate-500">شماره تراکنش: {selectedTxForInvoice.id}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
                    <span className="text-slate-400 block mb-0.5">فروشنده:</span>
                    <div className="font-bold text-slate-800">سامانه خدمات سازمانی سه گانه</div>
                    <div className="text-slate-500">محل شرکت: ساختمان مرکزی، واحد مالی</div>
                  </div>
                </div>

                {/* Order Table summary */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-right text-[10px]">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-2">شرح محصول / خدمت</th>
                        <th className="p-2 text-left">مبلغ خام</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-semibold text-slate-800">{selectedTxForInvoice.productName}</td>
                        <td className="p-2 text-left font-bold font-sans">{formatPrice(selectedTxForInvoice.amount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="space-y-1 border-t border-slate-200 pt-3 text-[10px] font-sans">
                  <div className="flex justify-between text-slate-500">
                    <span>مبلغ کل خالص:</span>
                    <span>{formatPrice(selectedTxForInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>مالیات ارزش افزوده (۹٪):</span>
                    <span>{formatPrice(Math.round(selectedTxForInvoice.amount * 0.09))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1.5 text-xs">
                    <span>مبلغ کل ناخالص (قابل پرداخت):</span>
                    <span className="text-teal-700">{formatPrice(Math.round(selectedTxForInvoice.amount * 1.09))}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>چاپ فاکتور رسمی</span>
                </button>
                <button
                  onClick={() => setSelectedTxForInvoice(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold rounded transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
