import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    setTransactionFailed,
} from '../features/transaction/transactionSlice';

export const useCustomer = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  const saveCustomer = async (data: any) => {
    try {
      const customerRes = await fetch(`/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          email: data.email,
          documentType: data.documentType,
          documentNumber: data.documentNumber,
        }),
      });
      if (!customerRes.ok) throw new Error('No se pudo crear el cliente');
      return await customerRes.json();
    } catch (err: any) {
      dispatch(setTransactionFailed({ message: err.message }));
      setError(err.message);
      return null;
    }
  };

  return { saveCustomer, error };
};
