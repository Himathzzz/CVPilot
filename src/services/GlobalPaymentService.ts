/**
 * Global Payment Service - PayHere LK Payment Gateway Engine
 */

export interface CurrencyConfig {
  code: 'USD' | 'EUR' | 'GBP' | 'LKR' | 'INR';
  symbol: string;
  amount: number;
  monthlyText: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', amount: 5.00, monthlyText: '$5.00 / month', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', amount: 4.50, monthlyText: '€4.50 / month', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', amount: 3.99, monthlyText: '£3.99 / month', name: 'British Pound', flag: '🇬🇧' },
  { code: 'LKR', symbol: 'Rs. ', amount: 1500, monthlyText: 'Rs. 1,500 / month', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
  { code: 'INR', symbol: '₹', amount: 420, monthlyText: '₹420 / month', name: 'Indian Rupee', flag: '🇮🇳' },
];

export type PaymentGatewayId = 'payhere';

export interface PaymentGatewayInfo {
  id: PaymentGatewayId;
  name: string;
  badge: string;
  description: string;
  icon: string;
  supportedMethods: string[];
  developerPayoutNote: string;
  isMerchantOfRecord: boolean;
}

export const PAYMENT_GATEWAYS: PaymentGatewayInfo[] = [
  {
    id: 'payhere',
    name: 'PayHere LK (Credit Cards & Mobile Wallets)',
    badge: 'COMING SOON • Approval Pending',
    description: 'PayHere online checkout is currently undergoing final merchant approval and will be enabled very shortly.',
    icon: 'payments',
    supportedMethods: ['Visa', 'MasterCard', 'AMEX', 'eZ Cash', 'mCash', 'Sampath Vishwa'],
    developerPayoutNote: 'Direct Deposit to Sri Lankan Bank Account in LKR/USD',
    isMerchantOfRecord: false
  }
];

export class GlobalPaymentService {
  /**
   * Helper to format currency price for displays
   */
  static formatPrice(currency: CurrencyConfig): string {
    return `${currency.symbol}${currency.amount}`;
  }

  /**
   * PayHere Payment Gateway Configuration
   * Auto-detects Sandbox mode vs Live environment
   */
  static getPayHereConfig() {
    const env = (import.meta.env.VITE_PAYHERE_ENV || 'sandbox').toLowerCase();
    const isLive = env === 'live' || env === 'production';
    const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID || '1220000';
    const actionUrl = isLive
      ? 'https://www.payhere.lk/pay/checkout'
      : 'https://sandbox.payhere.lk/pay/checkout';

    return {
      isLive,
      envName: isLive ? 'LIVE' : 'SANDBOX (Test Mode)',
      merchantId,
      actionUrl,
    };
  }

  /**
   * Generates and submits PayHere checkout form dynamically
   */
  static submitPayHereCheckout(params: {
    userEmail?: string;
    userName?: string;
    currency?: CurrencyConfig;
  }) {
    const config = this.getPayHereConfig();
    const curr = params.currency || SUPPORTED_CURRENCIES[0];
    const amountStr = curr.amount.toFixed(2);
    const orderId = `CVP_${Date.now()}`;
    const nameParts = (params.userName || 'Architect User').split(' ');

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = config.actionUrl;
    form.target = '_blank';

    const fields: Record<string, string> = {
      merchant_id: config.merchantId,
      return_url: `${window.location.origin}/?payment=success`,
      cancel_url: `${window.location.origin}/?payment=cancelled`,
      notify_url: `${window.location.origin}/api/webhooks`,
      order_id: orderId,
      items: 'CV PILOT Pro Membership ($5/mo)',
      currency: curr.code === 'LKR' ? 'LKR' : 'USD',
      amount: amountStr,
      first_name: nameParts[0] || 'User',
      last_name: nameParts.slice(1).join(' ') || 'Customer',
      email: params.userEmail || 'user@cvpilot.space',
      phone: '0770000000',
      address: 'Main Street',
      city: 'Colombo',
      country: 'Sri Lanka',
      custom_1: params.userEmail || 'guest',
    };

    Object.entries(fields).forEach(([key, val]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}
