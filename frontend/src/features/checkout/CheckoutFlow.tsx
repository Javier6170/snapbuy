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

const CheckoutFlow: React.FC = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const step      = useSelector((s: RootState) => s.checkout.step)
  const cartItems = useSelector((s: RootState) => s.cart.items)
  const products  = useSelector((s: RootState) => s.products.items)
  const [showDetailFor, setShowDetailFor] = useState<string|null>(null)
  const [mobileOpen, setMobileOpen] = useState(step === 1)

  useEffect(() => {
    if (cartItems.length === 0 && step > 1) {
      dispatch(setCheckoutStep(1))
      navigate('/', { replace: true })
    }
  }, [cartItems, step, dispatch, navigate])

  useEffect(() => {
    setMobileOpen(step === 1)
  }, [step])

  if (cartItems.length === 0) return null

  const goTo = (n: number) => dispatch(setCheckoutStep(n))
  const handleRestart = () => {
    dispatch(clearCart())
    dispatch(setCheckoutStep(1))
    navigate('/', { replace: true })
  }

  // Solo pasos 2 y 3 usan grid de dos columnas en desktop
  const splitDesktop = step === 2 || step === 3

  return (
    <section
      className={`max-w-7xl mx-auto my-8 p-4 ${
        splitDesktop ? 'lg:grid lg:grid-cols-2 gap-8' : ''
      }`}
    >
      {/* === Columna Izq: Stepper + Detalle + Resumen/Acordeón === */}
      <div className={`${splitDesktop ? 'lg:sticky lg:top-6 lg:h-[calc(100vh-64px)] lg:overflow-auto' : ''}`}>
        <Stepper steps={labels} current={step - 1} />

        {/* Mini-lista de productos */}
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
                    {quantity} × {product.price.toLocaleString('es-CO', {
                      style: 'currency', currency: 'COP', minimumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {showDetailFor && (
          <ProductDetailModal
            product={products.find(p => p.id === showDetailFor)!}
            onClose={() => setShowDetailFor(null)}
          />
        )}

        {/* === Móvil: acordeón sólo en pasos 2 y 3 === */}
        <div className="lg:hidden">
          {step >= 2 && step <= 3 && (
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="w-full flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
            >
              <span className="font-medium">Resumen de la compra</span>
              <span className="text-xl">{mobileOpen ? '−' : '+'}</span>
            </button>
          )}
          {(step === 1 || mobileOpen) && (
            <CartSummary onNext={() => goTo(step + 1)} />
          )}
        </div>

        {/* === Desktop: siempre visible en pasos 2 y 3; paso 1 no usa grid así que se expande === */}
        <div className="hidden lg:block">
          {step >= 1 && step <= 3 && (
            <CartSummary onNext={() => goTo(step + 1)} />
          )}
          {step === 4 && (
            <div className="mt-8">
              <TransactionResult onRestart={handleRestart} />
            </div>
          )}
        </div>
      </div>

      {/* === Columna Der: Formularios en pasos 2 y 3 === */}
      {step === 2 && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-xl">
          <DeliveryForm onBack={() => goTo(1)} onNext={() => goTo(3)} />
        </div>
      )}
      {step === 3 && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-xl">
          <PaymentForm onBack={() => goTo(2)} onNext={() => goTo(4)} />
        </div>
      )}

      {/* === Paso 4: Resultado en ancho completo === */}
      {!splitDesktop && step === 4 && (
        <div className="w-full mt-4">
          <TransactionResult onRestart={handleRestart} />
        </div>
      )}
    </section>
  )
}

export default CheckoutFlow
