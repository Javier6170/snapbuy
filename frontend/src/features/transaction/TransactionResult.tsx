// src/features/transaction/TransactionResult.tsx
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../app/store'
import { resetTransaction } from './transactionSlice'
import { clearCart } from '../cart/cartSlice'   // ← importa

interface TransactionResultProps {
  onRestart?: () => void
}

const TransactionResult: React.FC<TransactionResultProps> = ({ onRestart }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { status, transactionId, message } = useSelector((s: RootState) => s.transaction)

  useEffect(() => {
    if (status === 'idle' || status === 'pending') {
      navigate('/', { replace: true })
    }
  }, [status, navigate])

  const backHome = () => {
    dispatch(resetTransaction())
    dispatch(clearCart())           // ← limpia el carrito
    if (onRestart) onRestart()
    else navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm text-center space-y-4">
        {status === 'success' ? (
          <>
            <h2 className="text-2xl font-bold text-green-600">¡Pago exitoso!</h2>
            <p>Tu transacción fue aprobada.</p>
            <p><strong>ID:</strong> {transactionId}</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600">Pago fallido</h2>
            <p>{message || 'Hubo un error al procesar tu pago.'}</p>
          </>
        )}
        <button
          onClick={backHome}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default TransactionResult
