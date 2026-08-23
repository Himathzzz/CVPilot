# Global Payment Gateway Integration Blueprint (Developer Based in Sri Lanka)

This blueprint outlines the exact payment architecture, merchant registration, tax compliance, and bank payout workflow for a developer in Sri Lanka running **CVPilot** globally.

---

## 1. Executive Summary & Strategy

| Payment Gateway | Merchant of Record (MoR) | Global Coverage | Payout Method to Sri Lanka | Primary Target Audience |
| :--- | :--- | :--- | :--- | :--- |
| **Lemon Squeezy** | **Yes** (Handles Tax/VAT) | 100+ Countries | Payoneer → Sri Lankan Bank (Commercial, Sampath, HNB, BOC, NTB) | US, Europe, UK, Canada, Australia |
| **PayPal Commerce** | No | 200+ Countries | Payoneer Card / Linked Bank | Global Users preferring PayPal |
| **PayHere LK** | No | Sri Lanka & South Asia | Direct LKR/USD Bank Deposit to LK Bank Account | Sri Lanka & Asian Cardholders |
| **Binance / USDT Pay** | No | Worldwide | Direct Crypto Wallet → P2P / Local Bank | Web3 & Crypto Native Users |

---

## 2. Payout Setup: Receiving Money in Sri Lanka

### Option A: Lemon Squeezy + Payoneer (Recommended for SaaS)
1. **Sign Up for Lemon Squeezy**:
   - Go to [lemonsqueezy.com](https://lemonsqueezy.com).
   - Enter your Sri Lanka residential/business address.
   - Lemon Squeezy acts as the **Merchant of Record (MoR)**, meaning they collect and remit sales tax (US state taxes, EU VAT, UK VAT) on your behalf.
2. **Connect Payout to Payoneer**:
   - Create a free **Payoneer** account at [payoneer.com](https://payoneer.com).
   - Connect Payoneer as your Lemon Squeezy payout method.
3. **Withdraw to Sri Lanka Bank**:
   - Link your local Sri Lankan bank account (e.g., Commercial Bank of Ceylon, Sampath Bank, Hatton National Bank, NDB, BOC) to Payoneer.
   - Payouts from Lemon Squeezy transfer to Payoneer, and you can withdraw directly in **LKR** or **USD** to your local Sri Lankan bank account!

### Option B: PayHere LK (Sri Lankan CBSL Approved Merchant)
1. **Register on PayHere.lk**:
   - Go to [payhere.lk](https://payhere.lk).
   - Submit your NIC/Passport and Sri Lankan bank account details (Sampath, Commercial, HNB, etc.).
2. **Accept International & Local Payments**:
   - PayHere supports Visa, MasterCard, AMEX, Frimi, and eZ Cash.
   - Funds settle directly into your Sri Lankan bank account in LKR or USD every week.

---

## 3. Webhook Integration (Automating Pro Upgrades)

### Lemon Squeezy Webhook Handler (Firebase Cloud Functions / Node.js API)

```typescript
// webhook.ts - Serverless function to handle Lemon Squeezy payments
import express from 'express';
import crypto from 'crypto';
import { adminDb } from './firebaseAdmin';

const app = express();
app.use(express.json());

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

app.post('/api/webhooks/lemonsqueezy', async (req, res) => {
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
  const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
  const signature = Buffer.from(req.headers['x-signature'] as string || '', 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return res.status(400).send('Invalid signature');
  }

  const { meta, data } = req.body;
  const eventName = meta.event_name;
  const userId = meta.custom_data?.user_id;

  if (eventName === 'order_created' || eventName === 'subscription_created') {
    // Update user's membership to PRO in Firebase Firestore
    await adminDb.collection('users').doc(userId).update({
      isProMember: true,
      membershipTier: 'pro',
      subscriptionId: data.id,
      updatedAt: new Date().toISOString()
    });
  }

  res.status(200).send({ received: true });
});
```

---

## 4. Environment Variables Checklist (`.env`)

Add the following keys to your `.env` file:

```env
# Lemon Squeezy Keys
VITE_LEMON_SQUEEZY_STORE_SLUG=cvpilot
VITE_LEMON_SQUEEZY_PRO_VARIANT_ID=123456

# PayPal Credentials (Live & Sandbox)
VITE_PAYPAL_CLIENT_ID=BAAU4HikA7qSgT7EQf02eraLRik_eEL4w_1NnWf6FS91nYJ3fECB1YAoh367qD5gWhBHutZuTOXK0naFDg
PAYPAL_CLIENT_SECRET=EO6wAcHLPjNPGTCTDwSw23ViPgEn21r2v0RzVLI-VTPLC
VITE_PAYPAL_SANDBOX_USERNAME=sb-zenwf52566515@business.example.com
VITE_PAYPAL_SANDBOX_PASSWORD=irKE.@3z


# PayHere LK Credentials
VITE_PAYHERE_MERCHANT_ID=1220000
VITE_PAYHERE_SECRET_KEY=your_payhere_secret
```

---

## 5. Verification & Testing Instructions

1. Run `npm run dev` to start the frontend server.
2. Click **Upgrade to Pro** in the navigation bar.
3. Switch currency using the **Currency Selector** (`USD $5.00`, `EUR €4.50`, `GBP £3.99`, `LKR Rs. 1,500`, `INR ₹420`).
4. Select gateway:
   - **Lemon Squeezy**: Test opening the hosted checkout overlay.
   - **PayPal**: Test smart payment button rendering.
   - **PayHere LK**: Test submitting form card fields.
   - **Crypto**: Test copying USDT TRC20 wallet address.
