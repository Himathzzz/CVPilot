/**
 * Global Payment Service - Payoneer Checkout & Crypto Engine
 * Tailored for global payouts and instant subscriptions.
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

export const PAYONEER_PAYMENT_URL = import.meta.env.VITE_PAYONEER_PAYMENT_LINK || 'https://payoneer.me/cvpilot';

export type PaymentGatewayId = 'payhere' | 'payoneer' | 'crypto';

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
  },
  {
    id: 'payoneer',
    name: 'Payoneer & Cards',
    badge: 'Instant Access • Global Merchant',
    description: 'Pay securely using your Credit/Debit Card (Visa, MasterCard, Amex) or Payoneer Account via Payoneer Checkout.',
    icon: 'credit_card',
    supportedMethods: ['Payoneer Checkout', 'Visa', 'MasterCard', 'Amex', 'Debit Cards'],
    developerPayoutNote: 'Instant Settlement directly to Payoneer Balance',
    isMerchantOfRecord: false
  },
  {
    id: 'crypto',
    name: 'Crypto / Web3 (USDT)',
    badge: 'Zero Border Friction',
    description: 'Pay instantly using USDT (TRC-20) with instant blockchain verification.',
    icon: 'currency_bitcoin',
    supportedMethods: ['USDT (TRC-20)', 'USDC (Polygon)', 'Binance Pay'],
    developerPayoutNote: 'Direct Web3 Wallet Transfer (Instant Settlement)',
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
   * Returns Payoneer Merchant Code configured in environment
   */
  static getPayoneerMerchantCode(): string {
    return import.meta.env.VITE_PAYONEER_MERCHANT_CODE || 'cvpilot_merchant_sandbox';
  }

  /**
   * Helper to get supported Payoneer ISO currency and amount.
   * Converts unsupported currencies like LKR or INR to standard USD for Payoneer Checkout.
   */
  static getPayoneerCurrencyInfo(currency: CurrencyConfig): { currencyCode: string; amount: string } {
    if (currency.code === 'USD' || currency.code === 'EUR' || currency.code === 'GBP') {
      return { currencyCode: currency.code, amount: currency.amount.toFixed(2) };
    }
    return { currencyCode: 'USD', amount: '5.00' };
  }

  /**
   * Returns developer Sandbox credentials for testing
   */
  static getPayoneerSandboxInfo() {
    return {
      merchantCode: import.meta.env.VITE_PAYONEER_MERCHANT_CODE || 'cvpilot_sandbox_code',
      apiUsername: import.meta.env.VITE_PAYONEER_API_USERNAME || 'sandbox_api_user@cvpilot.com'
    };
  }

  /**
   * Generates a Payoneer REST Checkout Order session URL using official API credentials or hosted payment link fallback.
   * Auto-detects Sandbox vs Live environment based on credential validation.
   */
  static async createPayoneerOrderUrl(currencyCode: string = 'USD', amount: string = '5.00'): Promise<string> {
    const merchantCode = this.getPayoneerMerchantCode();
    const apiUsername = import.meta.env.VITE_PAYONEER_API_USERNAME || '';
    const apiPassword = import.meta.env.PAYONEER_API_PASSWORD || '';
    const customPaymentLink = import.meta.env.VITE_PAYONEER_PAYMENT_LINK;

    if (customPaymentLink) {
      return customPaymentLink;
    }

    if (apiUsername && apiPassword) {
      const auth = btoa(`${apiUsername}:${apiPassword}`);
      const endpoints = [
        {
          base: 'https://api.sandbox.payoneer.com/v1',
          checkoutBase: 'https://checkout.sandbox.payoneer.com'
        },
        {
          base: 'https://api.live.payoneer.com/v1',
          checkoutBase: 'https://checkout.payoneer.com'
        }
      ];

      for (const ep of endpoints) {
        try {
          const response = await fetch(`${ep.base}/accounts/${merchantCode}/checkout/sessions`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              transactionId: `CVP-${Date.now()}`,
              country: 'US',
              currency: currencyCode,
              amount: parseFloat(amount),
              payment: {
                reference: 'CV PILOT Pro Membership - Unlimited CVs & AI Features'
              },
              callback: {
                returnUrl: `${window.location.origin}/?payment=success`,
                cancelUrl: `${window.location.origin}/?payment=cancelled`,
                notificationUrl: `${window.location.origin}/api/webhooks`
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.redirectUrl) return data.redirectUrl;
            if (data.links?.redirect) return data.links.redirect;
            if (data.sessionToken) return `${ep.checkoutBase}/paymentpage?token=${data.sessionToken}`;
          }
        } catch (err) {
          console.warn(`[Payoneer ${ep.base} notice]:`, err);
        }
      }
    }

    // Direct Payoneer Hosted Checkout / Request Payment fallback
    return PAYONEER_PAYMENT_URL;
  }

  /**
   * Crypto Deposit Address & QR Info
   */
  static getCryptoDepositInfo() {
    return {
      usdtAddressTRC20: 'TYD4xQ9sU83hV1kZ8n3mXwR5L2p4q7vW1y',
      usdcPolygonAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TYD4xQ9sU83hV1kZ8n3mXwR5L2p4q7vW1y',
      instructions: 'Transfer $5.00 USDT via TRC-20 or Polygon USDC. Enter your transaction hash below to verify and activate Pro instantly.'
    };
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



