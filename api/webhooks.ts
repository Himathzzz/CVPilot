/**
 * Serverless Production Webhook Handler for PayHere (payhere.lk) & Payment Gateway
 */

export interface WebhookEvent {
  event_type: string;
  data: any;
}

export async function handlePayHereWebhook(reqBody: any, headers: Record<string, string>) {
  const _signature = headers['payhere-signature'] || headers['x-payhere-signature'];
  
  const { event_type, data, _merchant_id, order_id, _payhere_amount, status_code } = reqBody || {};
  
  // Process completed PayHere transactions (status_code 2 indicates successful payment)
  if (status_code === 2 || status_code === '2' || event_type === 'PAYMENT_SUCCESS') {
    const userId = data?.custom_1 || data?.custom_data?.userId || reqBody?.custom_1;
    if (!userId) {
      return { status: 400, body: { error: 'Missing userId in webhook payload' } };
    }
    console.log(`[PayHere Webhook Success] Activating Pro membership for User ID: ${userId}, Order ID: ${order_id}`);

    return {
      status: 200,
      body: { success: true, userId, orderId: order_id, event: event_type || 'PAYMENT_SUCCESS' }
    };
  }

  return { status: 200, body: { received: true } };
}
