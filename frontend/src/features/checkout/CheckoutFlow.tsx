import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../app/store'
import Stepper from '../../components/Stepper'
import CartSummary from '../cart/CartSummary'
import DeliveryForm from '../customer/DeliveryForm'
import PaymentForm from '../../components/PaymentModal'
import TransactionResult from '../transaction/TransactionResult'
import ProductDetailModal from '../products/ProductDetailModal'
import { setCheckoutStep } from './checkoutSlice'

const labels = ['Carrito', 'Entrega', 'Pago', 'Resultado']

const CheckoutFlow: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const step     = useSelector((s: RootState) => s.checkout.step)
  const cart     = useSelector((s: RootState) => s.cart)
  const product  = useSelector((s: RootState) =>
    s.products.items.find(p => p.id === cart.productId)
  )!
  const [showDetail, setShowDetail] = useState(false)

  // si no hay nada en carrito, volver al home
  if (!product || cart.quantity === 0) {
    navigate('/')
    return null
  }

  const goTo = (n: number) => dispatch(setCheckoutStep(n))

  return (
    <section className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl shadow">
      <Stepper steps={labels} current={step - 1} />

      {/* mini–resumen del producto + “Ver detalles” */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600">
            ${(product.price / 100).toFixed(2)} &times; {cart.quantity}
          </p>
        </div>
        <button
          onClick={() => setShowDetail(true)}
          className="text-blue-600 underline text-sm"
        >
          Ver detalles
        </button>
      </div>

      {showDetail && (
        <ProductDetailModal
          product={product}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* pasos del flujo */}
      {step === 1 && <CartSummary  onNext={() => goTo(2)} />}
      {step === 2 && (
        <DeliveryForm onBack={() => goTo(1)} onNext={() => goTo(3)} />
      )}
      {step === 3 && (
        <PaymentForm onBack={() => goTo(2)} onNext={() => goTo(4)} />
      )}
      {step === 4 && (
        <TransactionResult  />
      )}
    </section>
  )
}

export default CheckoutFlow
