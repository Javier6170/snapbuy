// src/features/transaction/TransactionResult.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import {
  resetTransaction
} from './transactionSlice';

const TransactionResult: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, transactionId, message } = useSelector(
    (state: RootState) => state.transaction
  );

  // Si el usuario llega aquí sin haber iniciado transacción, lo mandamos al home
  useEffect(() => {
    if (status === 'idle' || status === 'pending') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  const handleBackHome = () => {
    dispatch(resetTransaction());
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      {status === 'success' ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">¡Pago exitoso!</h2>
          <p className="mb-2">Tu transacción fue aprobada.</p>
          <p className="mb-4">
            <strong>ID de transacción:</strong> {transactionId}
          </p>
          <button
            onClick={handleBackHome}
            className="btn-primary px-6 py-2"
          >
            Volver al inicio
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Pago fallido</h2>
          <p className="mb-4">{message || 'Hubo un error al procesar tu pago.'}</p>
          <button
            onClick={handleBackHome}
            className="btn-secondary px-6 py-2"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionResult;
