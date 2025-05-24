// src/features/checkout/CheckoutFlow.tsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../app/store'
import Stepper from '../../components/Stepper'
import ProductDetailModal from '../products/ProductDetailModal'
import CartSummary from '../cart/CartSummary'
import DeliveryForm from '../customer/DeliveryForm'
import PaymentForm from '../../components/PaymentModal'
import TransactionResult from '../transaction/TransactionResult'
import { setCheckoutStep } from './checkoutSlice'
import { clearCart } from '../cart/cartSlice'

const labels = ['Carrito', 'Entrega', 'Pago', 'Resultado']
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
});

const CheckoutFlow: React.FC = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const step      = useSelector((s: RootState) => s.checkout.step)
  const cartItems = useSelector((s: RootState) => s.cart.items)
  const products  = useSelector((s: RootState) => s.products.items)

  const [showDetailFor, setShowDetailFor] = useState<string|null>(null)

  // Si vacían el carrito en pasos posteriores, vuelven al home
  useEffect(() => {
    if (cartItems.length === 0 && step > 1) {
      dispatch(setCheckoutStep(1))
      navigate('/', { replace: true })
    }
  }, [cartItems, step, dispatch, navigate])

  if (cartItems.length === 0) return null

  const goTo = (n: number) => dispatch(setCheckoutStep(n))

  const handleRestart = () => {
    dispatch(clearCart())
    dispatch(setCheckoutStep(1))
    navigate('/', { replace: true })
  }

  return (
    <section className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl shadow">
      <Stepper steps={labels} current={step - 1} />

      {/* --- Mini-resumen: Mostrar todos los items --- */}
      <div className="space-y-4 mb-6">
        {cartItems.map(({ productId, quantity }) => {
          const product = products.find(p => p.id === productId)!
          return (
            <div key={productId} className="flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                onClick={() => setShowDetailFor(productId)}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  { currencyFormatter.format(product.price)} × {quantity}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detalles del producto seleccionado */}
      {showDetailFor && (
        <ProductDetailModal
          product={products.find(p => p.id === showDetailFor)!}
          onClose={() => setShowDetailFor(null)}
        />
      )}

      {/* --- Pasos del flujo --- */}
      {step === 1 && <CartSummary   onNext={() => goTo(2)} />}
      {step === 2 && (
        <DeliveryForm onBack={() => goTo(1)} onNext={() => goTo(3)} />
      )}
      {step === 3 && (
        <PaymentForm  onBack={() => goTo(2)} onNext={() => goTo(4)} />
      )}
      {step === 4 && (
        <TransactionResult onRestart={handleRestart} />
      )}
    </section>
  )
}

export default CheckoutFlow
