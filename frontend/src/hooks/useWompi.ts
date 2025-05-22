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

      // 1) Crear transacción en tu backend
      const backendTx = await createTransaction({
        productId: data.productId,
        status: 'PENDING',
      });

      // 2) Llamar a Wompi Sandbox
      const wompiRes = await payWithCard({
        amountInCents: data.amountInCents,
        currency: 'COP',
        customerEmail: data.email,
        reference: backendTx.reference || `ref-${Date.now()}`,
      });

      // 3) Si aprobado, actualizar stock y marcar éxito
      if (wompiRes.status === 'APPROVED') {
        await updateStock(data.productId, data.quantity);
        dispatch(setTransactionSuccess({ id: wompiRes.id }));
        navigate('/result');
      } else {
        dispatch(setTransactionFailed({ message: 'Pago rechazado' }));
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
