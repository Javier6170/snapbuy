// src/features/checkout/CheckoutFlow.tsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../app/store'
import Stepper from '../../components/Stepper'
import ProductDetailModal from '../products/ProductDetailModal'
import CartSummary from '../cart/CartSummary'
import DeliveryForm from '../customer/DeliveryForm'
import PaymentModal from '../../components/PaymentModal'
import TransactionResult from '../transaction/TransactionResult'
import { setCheckoutStep } from './checkoutSlice'
import { clearCart } from '../cart/cartSlice'

const labels = ['Carrito', 'Entrega', 'Pago', 'Resultado']

const CheckoutFlow: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const step = useSelector((state: RootState) => state.checkout.step)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const products = useSelector((state: RootState) => state.products.items)
  const [showDetailFor, setShowDetailFor] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(step === 1)

  useEffect(() => {
    if (!cartItems.length && step > 1) {
      dispatch(setCheckoutStep(1))
      navigate('/', { replace: true })
    }
  }, [cartItems.length, step, dispatch, navigate])

  useEffect(() => {
    setMobileOpen(step === 1)
  }, [step])

  if (!cartItems.length) return null

  const goTo = (n: number) => dispatch(setCheckoutStep(n))
  const handleRestart = () => {
    dispatch(clearCart())
    dispatch(setCheckoutStep(1))
    navigate('/', { replace: true })
  }

  const splitDesktop = step === 2 || step === 3

  return (
    <section className={`max-w-7xl mx-auto mt-8 p-4 ${splitDesktop ? 'lg:grid lg:grid-cols-2 gap-8' : ''}`}>
      {/* Left Column: Stepper + Purchase Detail */}
      <div className={splitDesktop ? 'lg:sticky lg:top-6' : ''}>
        <Stepper steps={labels} current={step - 1} />

        {/* Product thumbnails (only steps 1-3) */}
        {step !== 4 && (
          <>
            <div className="space-y-4 mt-6 mb-6">
              {cartItems.map(({ productId, quantity }) => {
                const product = products.find(p => p.id === productId)!
                return (
                  <div key={productId} className="flex items-center gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg cursor-pointer"
                      onClick={() => setShowDetailFor(productId)}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600">
                        {quantity} × {product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Detail Modal */}
            {showDetailFor && (
              <ProductDetailModal
                product={products.find(p => p.id === showDetailFor)!}
                onClose={() => setShowDetailFor(null)}
              />
            )}

            {/* Mobile summary accordion */}
            <div className="lg:hidden mb-6">
              {step >= 2 && step <= 3 && (
                <button
                  onClick={() => setMobileOpen(o => !o)}
                  className="w-full flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
                >
                  <span className="font-medium">Resumen de la compra</span>
                  <span className="text-xl">{mobileOpen ? '-' : '+'}</span>
                </button>
              )}
              {(step === 1 || mobileOpen) && <CartSummary onNext={() => goTo(step + 1)} />}
            </div>
          </>
        )}

        {/* Desktop summary */}
        <div className="hidden lg:block">
          {step >= 1 && step <= 3 && <CartSummary onNext={() => goTo(step + 1)} />}
        </div>
      </div>

      {/* Right Column: Forms or Result */}
      {step === 2 && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-xl">
          <DeliveryForm onBack={() => goTo(1)} onNext={() => goTo(3)} />
        </div>
      )}
      {step === 3 && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-xl">
          <PaymentModal onBack={() => goTo(2)} onNext={() => goTo(4)} />
        </div>
      )}
      {step === 4 && (
        <div className={`${splitDesktop ? '' : 'w-full mt-4'}`}>
          <TransactionResult onRestart={handleRestart} />
        </div>
      )}
    </section>
  )
}

export default CheckoutFlow
