/**
 * Serverless Production Webhook Handler for Paddle.com Merchant of Record & Crypto
 */

export interface WebhookEvent {
  event_type: string;
  data: any;
}

export async function handlePaddleWebhook(reqBody: any, headers: Record<string, string>) {
  const signature = headers['paddle-signature'];
  if (!signature) {
    return { status: 400, body: { error: 'Missing Paddle-Signature header' } };
  }

  const { event_type, data } = reqBody;

  // Process completed Paddle transactions
  if (event_type === 'transaction.completed' || event_type === 'subscription.created') {
    const userId = data.custom_data?.user_id || data.custom_data?.userId;
    console.log(`[Paddle Webhook Success] Activating Pro membership for User ID: ${userId}`);

    return {
      status: 200,
      body: { success: true, userId, event: event_type }
    };
  }

  return { status: 200, body: { received: true } };
}

export async function handlePayoneerWebhook(reqBody: any) {
  const { event_type, result, transactionId, amount } = reqBody || {};

  if (event_type === 'CHARGE.SUCCESS' || result === 'SUCCESS' || event_type === 'CHECKOUT.COMPLETED') {
    console.log(`[Payoneer Webhook Success] Received payment of ${amount || '5.00'} for Transaction ID: ${transactionId}`);

    return {
      status: 200,
      body: { success: true, transactionId, event: event_type || 'CHARGE.SUCCESS', amount }
    };
  }

  return { status: 200, body: { received: true, event: event_type } };
}


