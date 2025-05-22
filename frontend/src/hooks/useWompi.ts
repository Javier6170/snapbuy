// src/hooks/usePayment.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTransaction, updateStock } from '../services/api';
import { payWithCard } from '../services/wompiService';
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

      // 1) Crear el cliente en tu backend
      const customerRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, address: data.address, email: data.email }),
      });
      const customer = await customerRes.json();

      // 2) Crear entrega
      const deliveryRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.id, address: data.address }),
      });
      const delivery = await deliveryRes.json();

      // 3) Simulación de pago en Wompi
      const wompiRes = await payWithCard({
        amountInCents: data.amountInCents,
        currency: 'COP',
        customerEmail: data.email,
        reference: `ref-${Date.now()}`,
      });

      // 4) Si el pago es aprobado, crear la transacción y actualizar stock
      if (wompiRes.status === 'APPROVED') {
        await createTransaction({
          customerId: customer.id,
          deliveryId: delivery.id,
          productId: data.productId,
          quantity: data.quantity,
          amount: data.amountInCents,
          status: 'APPROVED',
        });

        await updateStock(data.productId, data.quantity);
        dispatch(setTransactionSuccess({ id: wompiRes.id }));
        navigate('/result');
      } else {
        dispatch(setTransactionFailed({ message: 'Pago rechazado por Wompi' }));
        setError('Pago rechazado por Wompi');
        navigate('/result');
      }
    } catch (err: any) {
      dispatch(setTransactionFailed({ message: err.message }));
      setError(err.message);
      navigate('/result');
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading, error };
};
