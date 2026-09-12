/**
 * Serverless Production Webhook Handler for PayHere (payhere.lk) Payment Gateway
 */
import crypto from 'crypto';

export interface WebhookEvent {
  event_type: string;
  data: any;
}

export async function handlePayHereWebhook(reqBody: any, headers: Record<string, string>) {
  const merchantSecret = process.env.PAYHERE_SECRET || process.env.VITE_PAYHERE_SECRET || '';
  const { 
    event_type, 
    data, 
    merchant_id, 
    order_id, 
    payhere_amount, 
    payhere_currency, 
    status_code, 
    md5sig,
    custom_1 
  } = reqBody || {};

  // If merchant secret is set, verify md5sig payload signature
  if (merchantSecret && md5sig && merchant_id && order_id && payhere_amount && payhere_currency && status_code !== undefined) {
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const rawString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const expectedSig = crypto.createHash('md5').update(rawString).digest('hex').toUpperCase();

    if (md5sig.toUpperCase() !== expectedSig) {
      console.warn(`[PayHere Webhook] Invalid signature match for Order ID: ${order_id}`);
      return { status: 400, body: { error: 'Invalid PayHere signature verification failed' } };
    }
  }

  // Process completed PayHere transactions (status_code 2 indicates successful payment in PayHere)
  if (status_code === 2 || status_code === '2' || event_type === 'PAYMENT_SUCCESS') {
    const userId = custom_1 || data?.custom_1 || data?.custom_data?.userId;
    if (!userId) {
      return { status: 400, body: { error: 'Missing userId/email in webhook payload' } };
    }
    console.log(`[PayHere Webhook Success] Activating Pro membership for User/Email: ${userId}, Order ID: ${order_id}`);

    return {
      status: 200,
      body: { success: true, userId, orderId: order_id, status: 'PRO_ACTIVATED' }
    };
  }

  return { status: 200, body: { received: true, status_code } };
}

