// src/hooks/usePayment.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  startTransaction,
  setTransactionSuccess,
  setTransactionFailed,
} from '../features/transaction/transactionSlice';

interface UsePaymentInput {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  name: string;
  address: string;
  email: string;
  productId: string;
  quantity: number;
  amountInCents: number;
}

export const usePayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (data: UsePaymentInput) => {
    try {
      setError(null);
      setLoading(true);
      dispatch(startTransaction());

      // 1) Crear cliente
      const customerRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          email: data.email,
        }),
      });

      const customer = await customerRes.json();

      // 2) Hacer pago completo desde backend
      const paymentRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          productId: data.productId,
          quantity: data.quantity,
          amountInCents: data.amountInCents,
          customerEmail: data.email,

          // 👇 Datos de tarjeta para tokenizar
          cardNumber: data.cardNumber,
          cvc: data.cvc,
          expMonth: data.expMonth,
          expYear: data.expYear,
          name: data.name,
        }),
      });

      if (!paymentRes.ok) {
        // Parseamos JSON con { message, details: { error: { messages: { number: [...] } } } }
        const errBody = await paymentRes.json();
        const msgs = errBody.details?.error?.messages;
        const userMsg = msgs
          ? Object.values(msgs).flat().join(', ')
          : errBody.message || 'Error desconocido';
        throw new Error(userMsg);
      }

      const payment = await paymentRes.json();
      dispatch(setTransactionSuccess({ id: payment.transactionId }));
      return true;
    } catch (err: any) {
       dispatch(setTransactionFailed({ message: err.message }));
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading, error };
};
