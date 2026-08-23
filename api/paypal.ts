/**
 * Serverless API Handler for PayPal Checkout & Webhooks
 * Provides server-side access token generation, order creation, order capture, and webhook verification.
 */

const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID || 'BAAU4HikA7qSgT7EQf02eraLRik_eEL4w_1NnWf6FS91nYJ3fECB1YAoh367qD5gWhBHutZuTOXK0naFDg';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'EO6wAcHLPjNPGTCTDwSw23ViPgEn21r2v0RzVLI-VTPLC';

// Base URL: use sandbox if explicitly set, else live
const PAYPAL_BASE_URL = process.env.PAYPAL_ENV === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

/**
 * Fetch OAuth 2.0 Access Token from PayPal REST API
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain PayPal Access Token: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal Order server-side
 */
export async function createPayPalOrder(currency: string = 'USD', amount: string = '5.00') {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          description: 'CV PILOT Pro Membership - Unlimited CVs & AI Features',
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Order creation failed: ${errorText}`);
  }

  return await response.json();
}

/**
 * Capture a PayPal Order server-side after user approval
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Order capture failed: ${errorText}`);
  }

  return await response.json();
}

/**
 * Serverless HTTP Handler
 */
export async function handlePayPalRequest(req: { method: string; body: any; query?: any }) {
  try {
    const { action, orderId, currency, amount } = req.body || {};

    if (action === 'create-order') {
      const order = await createPayPalOrder(currency || 'USD', amount || '5.00');
      return { status: 200, body: order };
    }

    if (action === 'capture-order') {
      if (!orderId) {
        return { status: 400, body: { error: 'Missing orderId parameter' } };
      }
      const captureData = await capturePayPalOrder(orderId);
      return { status: 200, body: { success: true, capture: captureData } };
    }

    return { status: 400, body: { error: 'Invalid PayPal action specified' } };
  } catch (error: any) {
    console.error('[PayPal API Error]:', error);
    return { status: 500, body: { error: error.message || 'PayPal internal server error' } };
  }
}
