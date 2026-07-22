import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { card_number, cvv, expiration_month, expiration_year, email } = body;

    if (!card_number || !cvv || !expiration_month || !expiration_year || !email) {
      return NextResponse.json(
        { error: 'Todos los campos de la tarjeta son requeridos' },
        { status: 400 }
      );
    }

    const tokenData = {
      card_number: card_number.replace(/\s/g, ''),
      cvv,
      expiration_month,
      expiration_year,
      email
    };

    const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

    if (!publicKey) {
      return NextResponse.json(
        { error: 'Configuración incompleta del servidor' },
        { status: 500 }
      );
    }

    console.log('Creating token with public key...');

    const culqiResponse = await fetch('https://api.culqi.com/v2/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicKey}`
      },
      body: JSON.stringify(tokenData)
    });

    const tokenResult = await culqiResponse.json();

    if (!culqiResponse.ok) {
      console.error('Culqi token error:', tokenResult);
      return NextResponse.json(
        {
          error: 'Error al procesar la tarjeta',
          details: tokenResult.user_message || tokenResult.merchant_message || 'Error desconocido'
        },
        { status: 400 }
      );
    }

    console.log('Token created successfully:', tokenResult.id);

    return NextResponse.json({
      success: true,
      token: tokenResult.id
    });

  } catch (error: any) {
    console.error('Error creating Culqi token:', error);

    return NextResponse.json(
      {
        error: 'Error al procesar la tarjeta',
        details: error.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
