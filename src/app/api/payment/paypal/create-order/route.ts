import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', description } = body;

    console.log('🔵 Creating PayPal order:', { amount, currency, description });

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.error('❌ PayPal credentials not configured');
      return NextResponse.json(
        { error: 'PayPal not configured' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');

    const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    console.log('🔍 PayPal API URL:', PAYPAL_API_URL);
    console.log('🔍 Client ID (primeros 20 chars):', PAYPAL_CLIENT_ID.substring(0, 20));

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        description: description,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        }
      }],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    };

    console.log('📤 Enviando a PayPal:', JSON.stringify(orderPayload, null, 2));

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal API Error:', data);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: data },
        { status: response.status }
      );
    }

    console.log('✅ PayPal order created:', data.id);
    return NextResponse.json({ orderId: data.id });

  } catch (error) {
    console.error('❌ Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
