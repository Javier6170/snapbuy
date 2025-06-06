// src/hooks/useWompi.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCustomer } from './useCustomerInfo';
import { usePaymentInfo } from './usePaymentInfo';
import {
  startTransaction,
  setTransactionSuccess,
  setTransactionFailed,
} from '../features/transaction/transactionSlice';

export interface DeliveryInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface UsePaymentInput {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  name: string;
  address: string;
  email: string;
  amountInCents: number;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  documentType: string;
  documentNumber: string;
  installments: number;
  deliveryInfo: DeliveryInfo;
}

export const usePayment = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saveCustomer } = useCustomer();
  const {savePayment } = usePaymentInfo();

  const handlePayment = async (data: UsePaymentInput) => {
    try {
      setError(null);
      setLoading(true);
      dispatch(startTransaction());

      // 1) Crear cliente
      const customer = await saveCustomer(data);
      if (!customer) throw new Error('Error creando el cliente');

      const paymentRes = await savePayment(data, customer);
      if (!paymentRes ) throw new Error('Error creando la transacción');

      if (!paymentRes.ok) {
        const errBody = await paymentRes.json();
        const msgs = errBody.error?.details?.error?.messages;
        const userMsg = msgs
          ? Object.values(msgs).flat().join(', ')
          : errBody.message || 'Error desconocido';
        throw new Error(userMsg);
      }

      const payment = await paymentRes.json();
      dispatch(setTransactionSuccess({ id: payment.transactionId }));
      return true;
    } catch (err: any) {
      console.log(err)
      dispatch(setTransactionFailed({ message: err.message }));
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading, error };
};
