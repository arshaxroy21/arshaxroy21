/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  ShieldAlert, 
  FileCheck, 
  Search, 
  Filter, 
  Edit, 
  BookOpen,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Customer, Transaction, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SalesManagerDashboardProps {
  customers: Customer[];
  transactions: Transaction[];
  products: Product[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
  onAddLog: (action: string, details: string, category: 'system' | 'sales' | 'finance' | 'customer', userName: string) => void;
}

export default function SalesManagerDashboard({
  customers,
  transactions,
  products,
  onUpdateTransaction,
  onUpdateCustomer,
  onAddLog
}: SalesManagerDashboardProps) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Format currency helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // 1. Calculations & Metrics
  const pendingOrders = transactions.filter(t => t.status === 'pending');
  const salesApprovedCount = transactions.filter(t => t.salesApprovalDate).length;
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length;

  // Total sales volume (approved or pending)
  const totalSalesVolume = transactions
    .filter(t => t.status !== 'rejected')
    .reduce((sum, t) => sum + t.amount, 0);

  // 2. Prepare Chart Data (Sales per product)
  const productSalesMap = products.map(prod => {
    const totalQty = transactions.filter(t => t.productId === prod.id && t.status !== 'rejected').length;
    const totalVal = transactions
      .filter(t => t.productId === prod.id && t.status !== 'rejected')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: prod.name.length > 25 ? prod.name.substring(0, 25) + '...' : prod.name,
      'تعداد فروش': totalQty,
      'ارزش فروش (تومان)': totalVal,
      price: prod.price
    };
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.fullName.includes(customerSearch) || c.phone.includes(customerSearch) || (c.company && c.company.includes(customerSearch));
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handle Sales Approval/Rejection
  const handleSalesAction = (txId: string, action: 'approve' | 'reject') => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    const todayString = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

    if (action === 'approve') {
      const updates: Partial<Transaction> = {
        salesApprovalDate: todayString
      };

      // If finance is also approved, set transaction status to 'approved'
      if (tx.financeApprovalDate) {
        updates.status = 'approved';
      }

      onUpdateTransaction(txId, updates);
      onAddLog(
        'تایید فروش سفارش',
        `سفارش با کد پیگیری ${tx.trackingCode} توسط مدیر فروش تایید علمی/فنی شد.`,
        'sales',
        'محمدرضا علوی (مدیر فروش)'
      );
    } else {
      onUpdateTransaction(txId, {
        status: 'rejected'
      });
      onAddLog(
        'رد سفارش',
        `سفارش با کد پیگیری ${tx.trackingCode} توسط مدیر فروش رد شد.`,
        'sales',
        'محمدرضا علوی (مدیر فروش)'
      );
    }
  };

  // Save customer notes
  const saveCustomerNotes = () => {
    if (!selectedCustomer) return;
    onUpdateCustomer(selectedCustomer.id, { notes: tempNotes });
    onAddLog(
      'بروزرسانی یادداشت مشتری',
      `یادداشت‌های مشتری "${selectedCustomer.fullName}" به روز رسانی شد.`,
      'sales',
      'محمدرضا علوی (مدیر فروش)'
    );
    setSelectedCustomer({ ...selectedCustomer, notes: tempNotes });
    alert('یادداشت مشتری با موفقیت ذخیره شد.');
  };

  // Toggle Customer status
  const toggleCustomerStatus = (cust: Customer) => {
    const nextStatus = cust.status === 'active' ? 'inactive' : 'active';
    onUpdateCustomer(cust.id, { status: nextStatus });
    onAddLog(
      'تغییر وضعیت مشتری',
      `وضعیت مشتری "${cust.fullName}" به "${nextStatus === 'active' ? 'فعال' : 'غیرفعال'}" تغییر یافت.`,
      'sales',
      'محمدرضا علوی (مدیر فروش)'
    );
    if (selectedCustomer?.id === cust.id) {
      setSelectedCustomer({ ...selectedCustomer, status: nextStatus });
    }
  };

  // Custom colors for chart bars
  const CHART_COLORS = ['#3b82f6', '#0d9488', '#4f46e5'];

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#f1f5f9] p-3 md:p-5 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Banner/Header */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-lg p-4 md:p-5 text-white border border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="bg-blue-500/25 text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                میز کار مدیریت فروش
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold mt-1.5 tracking-tight">داشبورد آنالیز و تاییدات فروش</h1>
            <p className="text-slate-300 text-[11px] mt-1 max-w-xl">
              تایید صلاحیت قراردادها، بررسی نیازهای مشتریان، ارزیابی فروش سه محصول و هماهنگی با واحد حسابداری مالی.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-lg flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold shadow-xs">
              م‌ع
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-100 leading-tight">محمدرضا علوی</div>
              <div className="text-[9px] text-slate-400 mt-0.5 font-medium">مدیر ارشد فروش و بازاریابی</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">کل سفارش‌های جاری</span>
              <h3 className="text-lg font-bold text-slate-800 mt-0.5 font-sans">{transactions.length}</h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">سفارش‌های در حال بررسی</span>
              <h3 className="text-lg font-bold text-amber-650 mt-0.5 font-sans">{pendingOrders.length}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">تایید فنی فروش‌شده</span>
              <h3 className="text-lg font-bold text-blue-600 mt-0.5 font-sans">{salesApprovedCount}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-450 font-medium">پایپ‌لاین مالی فعال</span>
              <h3 className="text-[11px] font-bold text-slate-800 mt-1 font-sans truncate" title={formatPrice(totalSalesVolume)}>
                {formatPrice(totalSalesVolume)}
              </h3>
            </div>
            <div className="p-2 bg-teal-50 text-teal-650 rounded">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Pending Approval Section */}
        <div className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>در انتظار تایید صلاحیت فروش ({pendingOrders.length} سفارش)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold border-b border-slate-200">
                  <th className="p-2.5">مشتری</th>
                  <th className="p-2.5">نام محصول</th>
                  <th className="p-2.5">مبلغ قرارداد</th>
                  <th className="p-2.5">روش پرداخت</th>
                  <th className="p-2.5">وضعیت تایید فروش</th>
                  <th className="p-2.5">وضعیت تایید مالی</th>
                  <th className="p-2.5 text-center">عملیات مدیریت فروش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-[11px]">
                {pendingOrders.length > 0 ? (
                  pendingOrders.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2.5">
                        <div className="font-bold text-slate-800">{tx.customerName}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">تاریخ: {tx.date}</div>
                      </td>
                      <td className="p-2.5 text-slate-700 max-w-[180px] truncate" title={tx.productName}>
                        {tx.productName}
                      </td>
                      <td className="p-2.5 font-bold text-slate-800 font-sans">{formatPrice(tx.amount)}</td>
                      <td className="p-2.5">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] border border-slate-200">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="p-2.5">
                        {tx.salesApprovalDate ? (
                          <span className="text-blue-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            تایید شد ({tx.salesApprovalDate})
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            در انتظار تایید فروش
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        {tx.financeApprovalDate ? (
                          <span className="text-teal-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            دریافت وجه تایید شده
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            منتظر تراکنش مالی
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {!tx.salesApprovalDate ? (
                            <>
                              <button
                                onClick={() => handleSalesAction(tx.id, 'approve')}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold flex items-center gap-0.5 border border-blue-200 transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>تایید صلاحیت</span>
                              </button>
                              <button
                                onClick={() => handleSalesAction(tx.id, 'reject')}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold flex items-center gap-0.5 border border-rose-200 transition-colors"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>رد سفارش</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">مرحله فروش تایید شده</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                      هیچ سفارش جدیدی در انتظار بررسی فروش نیست.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts & Customer Relations Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Chart column (2 cols wide) */}
          <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-2xs border border-slate-200 space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>محبوبیت و توزیع تعداد فروش محصولات سه گانه</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              این نمودار نشان می‌دهد هر یک از سه محصول از دیدگاه واحد بازاریابی و فروش چه تعداد سفارش موفق یا جاری جذب کرده‌اند.
            </p>

            <div className="h-48 w-full font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesMap} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#475569' }} width={110} />
                  <Tooltip 
                    contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: '10px', borderRadius: '4px', borderColor: '#e2e8f0' }}
                    formatter={(value: any) => [`${value} عدد`, 'تعداد سفارش']}
                  />
                  <Bar dataKey="تعداد فروش" barSize={16} radius={[0, 4, 4, 0]}>
                    {productSalesMap.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer CRM and interaction notes (1 col) */}
          <div className="bg-white rounded-lg p-4 shadow-2xs border border-slate-200 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>یادداشت‌ها و وضعیت مشتریان</span>
              </h2>

              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute right-2.5 top-2" />
                <input
                  type="text"
                  placeholder="جستجوی مشتری..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pr-7.5 pl-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Status filtering */}
              <div className="flex gap-1 text-[9px]">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 py-0.5 rounded border transition-colors ${filterStatus === 'all' ? 'bg-slate-800 border-slate-800 text-white font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  همه ({customers.length})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-2 py-0.5 rounded border transition-colors ${filterStatus === 'active' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  فعال ({customers.filter(c => c.status === 'active').length})
                </button>
                <button
                  onClick={() => setFilterStatus('inactive')}
                  className={`px-2 py-0.5 rounded border transition-colors ${filterStatus === 'inactive' ? 'bg-slate-100 border-slate-200 text-slate-600 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  غیرفعال ({customers.filter(c => c.status === 'inactive').length})
                </button>
              </div>

              {/* Customers mini list */}
              <div className="space-y-1 max-h-40 overflow-y-auto border border-slate-200 rounded p-1 bg-slate-50">
                {filteredCustomers.map(cust => (
                  <div
                    key={cust.id}
                    onClick={() => {
                      setSelectedCustomer(cust);
                      setTempNotes(cust.notes || '');
                    }}
                    className={`p-1.5 rounded cursor-pointer transition-all flex items-center justify-between text-[11px] ${
                      selectedCustomer?.id === cust.id 
                        ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-3xs' 
                        : 'hover:bg-white text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>{cust.fullName}</span>
                        {cust.company && <span className="text-[8px] text-slate-400 font-normal">({cust.company})</span>}
                      </div>
                      <div className="text-[9px] text-slate-400">{cust.phone}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cust.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCustomerStatus(cust);
                        }}
                        className="p-0.5 hover:bg-slate-200 rounded text-[8px] text-slate-500 font-bold"
                      >
                        {cust.status === 'active' ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected customer interaction notes form */}
            {selectedCustomer ? (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 animate-fade-in">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-800 flex items-center gap-0.5">
                    <MessageSquare className="w-3 h-3 text-blue-600" />
                    <span>پیگیری: {selectedCustomer.fullName}</span>
                  </span>
                  <span className="text-[9px] text-slate-400">عضویت: {selectedCustomer.joinedDate}</span>
                </div>
                <textarea
                  rows={1.5}
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="نکات پیگیری یا نیازهای مشتری را یادداشت کنید..."
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none font-sans"
                />
                <button
                  type="button"
                  onClick={saveCustomerNotes}
                  className="w-full py-1 bg-slate-900 text-white rounded text-[10px] font-bold hover:bg-slate-800 transition-all"
                >
                  ذخیره یادداشت پیگیری
                </button>
              </div>
            ) : (
              <div className="mt-3 p-3 text-center text-[9px] text-slate-450 bg-slate-50 rounded border border-dashed border-slate-200">
                جهت نگارش یادداشت‌های پیگیری، یک مشتری را از بالا انتخاب کنید.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
