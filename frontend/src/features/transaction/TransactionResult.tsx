// src/features/transaction/TransactionResult.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0
})

interface Props {
  onRestart(): void
}

/**
 * Comprobante responsivo de la transacción y detalle de envío.
 */
const TransactionResult: React.FC<Props> = ({ onRestart }) => {
  const { transactionId, status: txStatus, message: message } = useSelector((s: RootState) => s.transaction)
  const customer = useSelector((s: RootState) => s.customer)
  const cartItems = useSelector((s: RootState) => s.cart.items)
  const products = useSelector((s: RootState) => s.products.items)

  const itemsWithDetails = cartItems.map(ci => {
    const prod = products.find(p => p.id === ci.productId)!
    return { ...ci, product: prod }
  })

  const subtotal = itemsWithDetails.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  )
  const baseFee = Number(process.env.REACT_APP_BASE_FEE) || 3000
  const deliveryFee = Number(process.env.REACT_APP_DELIVERY_FEE) || 5000
  const total = subtotal + baseFee + deliveryFee

  const isSuccess = txStatus === 'success'
  const statusLabel = isSuccess ? 'APROBADO' : 'FALLIDO'

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">Comprobante de Pago</h2>

        <p className="text-center mb-4 text-lg">
          Estado: <span className={`font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{statusLabel}</span>
        </p>
        <p className="text-center mb-4 text-lg">
          Porque Fallo? <span className='font-bold'> {message}</span>
        </p>

        {transactionId && (
          <p className="text-center mb-8 text-sm sm:text-base">
            ID Transacción:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">{transactionId}</code>
          </p>
        )}


        <section className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3">Detalle de Artículos</h3>
          <ul className="divide-y divide-gray-200">
            {itemsWithDetails.map(({ product, quantity }) => (
              <li key={product.id} className="py-2 flex justify-between text-sm sm:text-base">
                <span>{product.name} × {quantity}</span>
                <span>{currencyFormatter.format(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t pt-6 mb-8 text-sm sm:text-base space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>{currencyFormatter.format(subtotal)}</span></div>
          <div className="flex justify-between"><span>Tarifa base</span><span>{currencyFormatter.format(baseFee)}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>{currencyFormatter.format(deliveryFee)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{currencyFormatter.format(total)}</span></div>
        </section>

        <section className="mb-8 text-sm sm:text-base">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3">Datos de Envío</h3>
          <address className="not-italic space-y-1">
            <div>{customer.firstName} {customer.lastName}</div>
            <div>
              {customer.address1}
              {customer.address2 ? `, ${customer.address2}` : ''}
            </div>
            <div>{customer.city}, {customer.state} {customer.postalCode}</div>
            <div>{customer.country}</div>
            {customer.phone && <div>Tel: {customer.phone}</div>}
          </address>
        </section>

        <button
          onClick={onRestart}
          className="w-full py-3 sm:py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-base sm:text-lg"
        >
          Finalizar
        </button>
      </div>
    </div>
  )
}

export default TransactionResult
