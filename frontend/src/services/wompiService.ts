const WOMPI_API = process.env.REACT_APP_WOMPI_API;
const PUBLIC_KEY = process.env.REACT_APP_WOMPI_PUBLIC_KEY;

interface PaymentPayload {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  reference: string;
}

export const payWithCard = async (data: PaymentPayload) => {
  const payload = {
    amount_in_cents: data.amountInCents,
    currency: data.currency,
    customer_email: data.customerEmail,
    payment_method: { type: 'CARD', token: 'tok_test_visa' },
    reference: data.reference,
    redirect_url: 'https://fake-return.com',
  };

  const res = await fetch(`${WOMPI_API}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PUBLIC_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const obj = JSON.parse(text);
      message = obj.message || JSON.stringify(obj);
    } catch {}
    throw new Error(message || 'Error al pagar con Wompi');
  }

  return res.json();
};
