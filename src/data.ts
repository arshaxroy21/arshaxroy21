/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Customer, Transaction, SystemLog, SystemSettings } from './types';

// سه محصول مد نظر کاربر
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'دوره جامع توسعه وب و هوش مصنوعی',
    description: 'کامل‌ترین دوره آموزشی برنامه‌نویسی مدرن، یادگیری عمیق توسعه وب فول‌استک به همراه ساخت اپلیکیشن‌های هوشمند متصل به مدل‌های زبانی بزرگ.',
    price: 4500000,
    category: 'آموزشی',
    features: [
      'بیش از ۶۰ ساعت آموزش ویدیویی پروژه محور',
      'پشتیبانی اختصاصی در دیسکورد و تلگرام',
      'منتورینگ آنلاین هفتگی و رفع اشکال',
      'گواهی معتبر دو زبانه پایان دوره'
    ],
    iconName: 'GraduationCap'
  },
  {
    id: 'prod-2',
    name: 'سامانه ابری مدیریت فروش و ارتباط با مشتری (CRM)',
    description: 'نرم‌افزار یکپارچه تحت وب برای مدیریت سرنخ‌های فروش، تحلیل پیشرفته تعامل با مشتریان، صدور فاکتورهای رسمی دیجیتال و اتوماسیون وظایف.',
    price: 8900000,
    category: 'نرم‌افزار ابری',
    features: [
      'کاربری نامحدود و دسترسی همزمان تیم‌ها',
      'فضای ذخیره‌سازی ابری ایمن ۱۰۰ گیگابایتی',
      'داشبورد هوشمند تحلیل داده و گزارش‌گیری',
      'قابلیت اتصال به پنل پیامکی و درگاه‌های بانکی'
    ],
    iconName: 'CloudLightning'
  },
  {
    id: 'prod-3',
    name: 'مشاوره اختصاصی استراتژی رشد و توسعه کسب‌وکار',
    description: 'یک دوره مربیگری فشرده خصوصی با مشاوران ارشد به همراه آنالیز رقبای بازار، تدوین بیزینس پلن (Business Plan) و بهینه‌سازی جریان‌های درآمدی.',
    price: 12500000,
    category: 'خدمات تخصصی',
    features: [
      '۴ جلسه آنلاین یا حضوری عمیق (۲ ساعته)',
      'ارائه سند جامع بیزینس پلن و نقشه راه اختصاصی',
      'آنالیز وضعیت سئو، مارکتینگ و فرآیندهای مالی',
      'ارزیابی و معرفی فرصت‌های جذب سرمایه'
    ],
    iconName: 'Briefcase'
  }
];

// مشتریان اولیه نمونه
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'سهراب بهرامی',
    phone: '09121234567',
    email: 'sohrab.bahrami@example.com',
    company: 'هلدینگ توسعه پارس',
    joinedDate: '1405/02/10',
    status: 'active',
    notes: 'مشتری قدیمی، علاقه‌مند به دریافت خدمات ابری و توسعه فنی.'
  },
  {
    id: 'cust-2',
    fullName: 'فرزانه احمدی',
    phone: '09199876543',
    email: 'f.ahmadi@tapesh-startup.ir',
    company: 'استارتاپ نوآوران تپش',
    joinedDate: '1405/03/15',
    status: 'active',
    notes: 'استارتاپ حوزه سلامت دیجیتال. نیاز مبرم به سیستم‌های خودکار ارتباط با مشتریان.'
  },
  {
    id: 'cust-3',
    fullName: 'امیرحسین رضایی',
    phone: '09355554433',
    email: 'amir.rez@gmail.com',
    company: 'فریلنسر',
    joinedDate: '1405/03/28',
    status: 'active',
    notes: 'برنامه‌نویس آزادکار. خواهان ارتقای سطح علمی در حوزه هوش مصنوعی.'
  },
  {
    id: 'cust-4',
    fullName: 'سارا کریمی',
    phone: '09112223344',
    email: 'karimi.sara@nikan-agency.com',
    company: 'آژانس خلاقیت نیکان',
    joinedDate: '1405/01/20',
    status: 'inactive',
    notes: 'شرکت در حالت تعلیق موقت پروژه‌ها. قبلا یک جلسه مشاوره رزرو کرده بود.'
  }
];

// تراکنش‌های اولیه نمونه
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    customerId: 'cust-1',
    customerName: 'سهراب بهرامی',
    productId: 'prod-2',
    productName: 'سامانه ابری مدیریت فروش و ارتباط با مشتری (CRM)',
    amount: 8900000,
    date: '1405/03/01',
    status: 'approved',
    paymentMethod: 'درگاه آنلاین',
    salesApprovalDate: '1405/03/02',
    financeApprovalDate: '1405/03/02',
    trackingCode: 'TRX-589632'
  },
  {
    id: 'tx-2',
    customerId: 'cust-2',
    customerName: 'فرزانه احمدی',
    productId: 'prod-3',
    productName: 'مشاوره اختصاصی استراتژی رشد و توسعه کسب‌وکار',
    amount: 12500000,
    date: '1405/03/18',
    status: 'approved',
    paymentMethod: 'کارت به کارت',
    salesApprovalDate: '1405/03/19',
    financeApprovalDate: '1405/03/20',
    trackingCode: 'TRX-104859'
  },
  {
    id: 'tx-3',
    customerId: 'cust-3',
    customerName: 'امیرحسین رضایی',
    productId: 'prod-1',
    productName: 'دوره جامع توسعه وب و هوش مصنوعی',
    amount: 4500000,
    date: '1405/03/29',
    status: 'pending',
    paymentMethod: 'درگاه آنلاین',
    trackingCode: 'TRX-742910'
  },
  {
    id: 'tx-4',
    customerId: 'cust-1',
    customerName: 'سهراب بهرامی',
    productId: 'prod-1',
    productName: 'دوره جامع توسعه وب و هوش مصنوعی',
    amount: 4500000,
    date: '1405/03/25',
    status: 'rejected',
    paymentMethod: 'اعتباری',
    salesApprovalDate: '1405/03/26',
    trackingCode: 'TRX-850119'
  },
  {
    id: 'tx-5',
    customerId: 'cust-2',
    customerName: 'فرزانه احمدی',
    productId: 'prod-2',
    productName: 'سامانه ابری مدیریت فروش و ارتباط با مشتری (CRM)',
    amount: 8900000,
    date: '1405/03/30',
    status: 'pending',
    paymentMethod: 'کارت به کارت',
    trackingCode: 'TRX-931102'
  }
];

// لاگ‌های سیستم اولیه نمونه
export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    timestamp: '1405/03/01 ۱۰:۱۵',
    userRole: 'customer',
    userName: 'سهراب بهرامی',
    action: 'ثبت سفارش جدید',
    details: 'محصول سامانه ابری CRM سفارش داده شد.',
    category: 'customer'
  },
  {
    id: 'log-2',
    timestamp: '1405/03/02 ۱۱:۳۰',
    userRole: 'sales_manager',
    userName: 'محمدرضا علوی (مدیر فروش)',
    action: 'تایید نهایی فروش',
    details: 'تراکنش TRX-589632 مربوط به سهراب بهرامی تایید شد.',
    category: 'sales'
  },
  {
    id: 'log-3',
    timestamp: '1405/03/02 ۱۱:۴۵',
    userRole: 'finance_manager',
    userName: 'نرگس تهرانی (مدیر مالی)',
    action: 'تایید دریافت وجه تراکنش',
    details: 'واریز وجه مبلغ ۸,۹۰۰,۰۰۰ تومان از سهراب بهرامی تایید شد.',
    category: 'finance'
  },
  {
    id: 'log-4',
    timestamp: '1405/03/15 ۱۴:۲۰',
    userRole: 'admin',
    userName: 'مدیر کل سیستم',
    action: 'ثبت کاربر جدید',
    details: 'کاربر فرزانه احمدی با شماره تماس 09199876543 افزوده شد.',
    category: 'system'
  },
  {
    id: 'log-5',
    timestamp: '1405/03/26 ۰۹:۱۰',
    userRole: 'sales_manager',
    userName: 'محمدرضا علوی (مدیر فروش)',
    action: 'رد سفارش مشتری',
    details: 'سفارش دوره آموزشی سهراب بهرامی به دلیل مغایرت پرداخت رد شد.',
    category: 'sales'
  }
];

// تنظیمات پایه سیستم
export const INITIAL_SETTINGS: SystemSettings = {
  allowNewRegistrations: true,
  autoApproveFreeOrders: false,
  taxRatePercent: 9,
  currencySymbol: 'تومان'
};
