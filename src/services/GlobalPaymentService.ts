import { md5 } from '../utils/md5';

export interface CurrencyConfig {
  code: 'USD' | 'LKR';
  symbol: string;
  amount: number;
  monthlyText: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', amount: 10.00, monthlyText: '$10.00 / month', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'LKR', symbol: 'LKR ', amount: 2000, monthlyText: 'LKR 2,000 / month', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
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
    badge: 'ACTIVE • Live Gateway',
    description: 'PayHere live checkout is enabled. Pay securely with Credit/Debit Cards, eZ Cash, mCash & Sampath Vishwa.',
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
    const formattedAmount = currency.amount >= 1000 
      ? currency.amount.toLocaleString('en-US') 
      : currency.amount.toFixed(2).replace(/\.00$/, '');
    return `${currency.symbol}${formattedAmount}`;
  }

  /**
   * Automatically detect if the user is visiting from Sri Lanka.
   * Checks browser timezone (e.g. Asia/Colombo), browser languages (si, ta-LK, en-LK),
   * and cached GeoIP data.
   */
  static isSriLankanUser(): boolean {
    if (typeof window === 'undefined') return false;

    // 1. TimeZone check (instant, reliable, zero network latency)
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone === 'Asia/Colombo') {
        return true;
      }
    } catch {
      // ignore
    }

    // 2. Browser language / locale check
    try {
      const languages = navigator.languages || [navigator.language];
      for (const lang of languages) {
        const l = lang.toLowerCase();
        if (l === 'si' || l.startsWith('si-') || l.endsWith('-lk') || l.includes('lk')) {
          return true;
        }
      }
    } catch {
      // ignore
    }

    // 3. Cached GeoIP check
    try {
      const cachedCountry = localStorage.getItem('cvpilot_detected_country');
      if (cachedCountry === 'LK') {
        return true;
      }
    } catch {
      // ignore
    }

    return false;
  }

  /**
   * Get the default currency for the current visitor:
   * 1. If user previously manually clicked a currency, use their preference.
   * 2. If user is in Sri Lanka (Asia/Colombo timezone or LK locale), default to LKR.
   * 3. For all other international visitors, default to USD.
   */
  static getDefaultCurrency(): CurrencyConfig {
    if (typeof window !== 'undefined') {
      try {
        const savedCode = localStorage.getItem('cvpilot_preferred_currency');
        if (savedCode) {
          const match = SUPPORTED_CURRENCIES.find(c => c.code === savedCode);
          if (match) return match;
        }
      } catch {
        // ignore
      }
    }

    const isLK = this.isSriLankanUser();
    const targetCode = isLK ? 'LKR' : 'USD';
    return SUPPORTED_CURRENCIES.find(c => c.code === targetCode) || SUPPORTED_CURRENCIES[0];
  }

  /**
   * Returns supported currencies ordered with the user's primary currency first
   */
  static getDisplayCurrencies(): CurrencyConfig[] {
    const defaultCurr = this.getDefaultCurrency();
    const primary = SUPPORTED_CURRENCIES.find(c => c.code === defaultCurr.code) || SUPPORTED_CURRENCIES[0];
    const secondary = SUPPORTED_CURRENCIES.find(c => c.code !== defaultCurr.code) || SUPPORTED_CURRENCIES[1];
    return [primary, secondary];
  }

  /**
   * Save user's manual currency choice
   */
  static setPreferredCurrency(currency: CurrencyConfig) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cvpilot_preferred_currency', currency.code);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Lightweight background GeoIP lookup to further verify region
   */
  static initGeoDetection(onUpdate?: (currency: CurrencyConfig) => void) {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('cvpilot_detected_country')) return;

    fetch('https://api.country.is', { signal: AbortSignal.timeout(3000) })
      .then(res => res.json())
      .then(data => {
        if (data?.country) {
          localStorage.setItem('cvpilot_detected_country', data.country);
          if (!localStorage.getItem('cvpilot_preferred_currency') && onUpdate) {
            const isLK = data.country === 'LK';
            const curr = SUPPORTED_CURRENCIES.find(c => c.code === (isLK ? 'LKR' : 'USD'));
            if (curr) onUpdate(curr);
          }
        }
      })
      .catch(() => {
        // Fallback silently to timezone detection
      });
  }

  /**
   * PayHere Payment Gateway Configuration
   * Auto-detects Sandbox mode vs Live environment
   */
  static getPayHereConfig() {
    // Clear any legacy local storage overrides to ensure .env is strictly honored
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cvpilot_payhere_merchant_id');
      localStorage.removeItem('cvpilot_payhere_secret');
    }

    const env = (import.meta.env.VITE_PAYHERE_ENV || 'live').toLowerCase();
    
    // Strict Merchant ID: 261034
    const merchantId = (import.meta.env.VITE_PAYHERE_MERCHANT_ID || '261034').trim();
    // Strict Merchant Secret for MD5 signature calculation
    const merchantSecret = (import.meta.env.VITE_PAYHERE_SECRET || 'MzkyMzE3OTkzODM1OTcyNDMyMTYzODUyOTgzNjQ0MTIwNDA4Nzc5Ng==').trim();

    const isExplicitSandbox = env === 'sandbox' || env === 'test';
    const isSandboxDefault = merchantId === '1220000';
    const isLive = !isExplicitSandbox && !isSandboxDefault;

    const actionUrl = isLive
      ? 'https://www.payhere.lk/pay/checkout'
      : 'https://sandbox.payhere.lk/pay/checkout';

    return {
      isLive,
      isSandboxDefault,
      envName: isLive ? 'LIVE PRODUCTION' : 'SANDBOX (Test Mode)',
      merchantId,
      merchantSecret,
      actionUrl,
    };
  }

  static saveCustomPayHereCredentials(merchantId: string, secret: string) {
    if (typeof window !== 'undefined') {
      if (merchantId) localStorage.setItem('cvpilot_payhere_merchant_id', merchantId.trim());
      else localStorage.removeItem('cvpilot_payhere_merchant_id');

      if (secret) localStorage.setItem('cvpilot_payhere_secret', secret.trim());
      else localStorage.removeItem('cvpilot_payhere_secret');
    }
  }

  /**
   * Generates MD5 Hash Security Signature for PayHere Checkout
   * Format: MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(merchant_secret))).toUpperCase()
   */
  static generatePayHereHash(merchantId: string, orderId: string, amountStr: string, currencyCode: string, merchantSecret: string): string {
    if (!merchantSecret) return '';
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const rawString = merchantId + orderId + amountStr + currencyCode + hashedSecret;
    return md5(rawString).toUpperCase();
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
    const orderId = `CVP-${Date.now()}`;
    const nameParts = (params.userName || 'CV Pilot User').trim().split(' ');

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = config.actionUrl;
    form.target = '_self'; // Redirect in same window to prevent popup blocker dismissal

    const prodOrigin = import.meta.env.VITE_PUBLIC_URL || 'https://cvpilot.space';
    const notifyUrl = `${prodOrigin}/api/webhooks`;

    const fields: Record<string, string> = {
      merchant_id: config.merchantId,
      return_url: `${window.location.origin}/?payment=success`,
      cancel_url: `${window.location.origin}/?payment=cancelled`,
      notify_url: notifyUrl,
      order_id: orderId,
      items: 'CVPilot Pro Monthly Membership',
      currency: curr.code,
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

    if (config.merchantSecret) {
      const hash = this.generatePayHereHash(config.merchantId, orderId, amountStr, curr.code, config.merchantSecret);
      if (hash) {
        fields.hash = hash;
      }
    }

    Object.entries(fields).forEach(([key, val]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }
}
