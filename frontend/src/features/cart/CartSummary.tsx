// src/features/cart/CartSummary.tsx
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'

const BASE_FEE = 3000
const DELIVERY_FEE = 5000

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
})

interface CartSummaryProps {
  onNext: () => void
}

const CartSummary: React.FC<CartSummaryProps> = ({ onNext }) => {
  const [accepted, setAccepted] = useState(false)
  const step = useSelector((s: RootState) => s.checkout.step)
  const cartItems = useSelector((s: RootState) => s.cart.items)
  const products  = useSelector((s: RootState) => s.products.items)

  const details = cartItems.map(ci => {
    const product = products.find(p => p.id === ci.productId)!
    return { ...ci, product }
  })

  if (details.length === 0) {
    return <p className="text-center text-gray-600 mt-8">Tu carrito está vacío.</p>
  }

  const subtotal = details.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  )
  const total = subtotal + BASE_FEE + DELIVERY_FEE

  return (
    <div className="p-6 w-full bg-white rounded-2xl shadow-xl flex flex-col h-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-64px)] lg:overflow-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Resumen de tu compra
      </h2>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6">
        {details.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex justify-between items-start text-gray-700"
          >
            <div className="flex-1 pr-4">
              <p className="font-medium text-lg">{product.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {quantity} × {currencyFormatter.format(product.price)}
              </p>
            </div>
            <p className="font-semibold text-lg">
              {currencyFormatter.format(product.price * quantity)}
            </p>
          </div>
        ))}

        <div className="flex justify-between text-gray-700 text-base">
          <span>Tarifa base</span>
          <span>{currencyFormatter.format(BASE_FEE)}</span>
        </div>
        <div className="flex justify-between text-gray-700 text-base">
          <span>Envío</span>
          <span>{currencyFormatter.format(DELIVERY_FEE)}</span>
        </div>
      </div>

      <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-4 mb-6">
        <span>Total</span>
        <span>{currencyFormatter.format(total)}</span>
      </div>

      {step === 1 && (
        <>
          <label className="inline-flex items-center mb-6">
            <input
              type="checkbox"
              className="mr-2"
              checked={accepted}
              onChange={() => setAccepted(a => !a)}
            />
            <span className="text-sm text-gray-600">
              Acepto los{' '}
              <button className="text-blue-600 underline">
                términos y condiciones
              </button>.
            </span>
          </label>

          <button
            onClick={onNext}
            disabled={!accepted}
            className={`w-full py-4 text-lg text-white rounded-lg transition shadow-md ${
              accepted
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Contuinar pago con tarjeta de credito
          </button>
        </>
      )}
    </div>
  )
}

export default CartSummary
