/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'sales_manager' | 'finance_manager' | 'admin';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in Tomans (تومان)
  category: string;
  features: string[];
  iconName: string; // lucide icon name reference
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  amount: number; // in Tomans
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'درگاه آنلاین' | 'کارت به کارت' | 'اعتباری';
  salesApprovalDate?: string;
  financeApprovalDate?: string;
  trackingCode: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userRole: UserRole | 'سیستم';
  userName: string;
  action: string;
  details: string;
  category: 'system' | 'sales' | 'finance' | 'customer';
}

export interface SystemSettings {
  allowNewRegistrations: boolean;
  autoApproveFreeOrders: boolean;
  taxRatePercent: number; // e.g. 9%
  currencySymbol: string; // e.g. "تومان"
}
