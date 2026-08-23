/**
 * Serverless API Handler for Payoneer Checkout Sessions & Status Verification
 */

const PAYONEER_MERCHANT_CODE = process.env.VITE_PAYONEER_MERCHANT_CODE || 'cvpilot_merchant_sandbox';
const PAYONEER_API_USERNAME = process.env.VITE_PAYONEER_API_USERNAME || '';
const PAYONEER_API_PASSWORD = process.env.PAYONEER_API_PASSWORD || '';
const PAYONEER_PAYMENT_LINK = process.env.VITE_PAYONEER_PAYMENT_LINK;

const PAYONEER_BASE_URL = process.env.PAYONEER_ENV === 'live' 
  ? 'https://api.live.payoneer.com/v1' 
  : 'https://api.sandbox.payoneer.com/v1';

const PAYONEER_CHECKOUT_BASE = process.env.PAYONEER_ENV === 'live'
  ? 'https://checkout.payoneer.com'
  : 'https://checkout.sandbox.payoneer.com';

/**
 * Create a Payoneer Checkout session server-side
 */
export async function createPayoneerCheckoutSession(currency: string = 'USD', amount: number = 5.0, returnUrl?: string) {
  if (PAYONEER_PAYMENT_LINK) {
    return { redirectUrl: PAYONEER_PAYMENT_LINK };
  }

  if (!PAYONEER_API_USERNAME || !PAYONEER_API_PASSWORD) {
    return { redirectUrl: PAYONEER_PAYMENT_LINK || 'https://payoneer.me/cvpilot' };
  }

  const auth = Buffer.from(`${PAYONEER_API_USERNAME}:${PAYONEER_API_PASSWORD}`).toString('base64');

  const response = await fetch(`${PAYONEER_BASE_URL}/accounts/${PAYONEER_MERCHANT_CODE}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify({
      transactionId: `CVP-${Date.now()}`,
      country: 'US',
      currency: currency,
      amount: amount,
      payment: {
        reference: 'CV PILOT Pro Membership - Unlimited CVs & AI Features',
      },
      callback: {
        returnUrl: returnUrl || 'https://cvpilot.space/?payment=success',
        cancelUrl: 'https://cvpilot.space/?payment=cancelled',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Payoneer Checkout session creation failed: ${errorText}`);
  }

  const data = await response.json();
  const redirectUrl = data.redirectUrl || data.links?.redirect || `${PAYONEER_CHECKOUT_BASE}/paymentpage?token=${data.sessionToken}`;
  return { redirectUrl, sessionToken: data.sessionToken };
}

/**
 * Serverless HTTP Handler
 */
export async function handlePayoneerRequest(req: { method: string; body: any }) {
  try {
    const { action, currency, amount, returnUrl } = req.body || {};

    if (action === 'create-session') {
      const session = await createPayoneerCheckoutSession(currency || 'USD', parseFloat(amount || '5.00'), returnUrl);
      return { status: 200, body: session };
    }

    return { status: 400, body: { error: 'Invalid Payoneer action specified' } };
  } catch (error: any) {
    console.error('[Payoneer API Error]:', error);
    return { status: 500, body: { error: error.message || 'Payoneer internal server error' } };
  }
}
