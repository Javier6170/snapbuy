// src/components/SideNav.tsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../app/store'
import { removeFromCart } from '../features/cart/cartSlice'

interface SideNavProps {
  isOpen: boolean
  onClose: () => void
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
})

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /**
   * Map cart items to products with quantity
   */
  const items = useSelector((state: RootState) =>
    state.cart.items
      .map(ci => {
        const p = state.products.items.find(p => p.id === ci.productId)
        return p
          ? { id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, quantity: ci.quantity }
          : null
      })
      .filter(Boolean) as Array<{ id: string; name: string; price: number; imageUrl?: string; quantity: number }>
  )

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart({ productId }))
  }

  const handleFinalize = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        {/* Header */}
        <header className="p-4 flex justify-between items-center border-b">
          <h2 id="cart-heading" className="text-xl font-bold">
            Tu carrito
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            ✕
          </button>
        </header>

        {/* Cart items */}
        <div className="p-4 flex-1 overflow-y-auto" tabIndex={0}>
          {items.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío.</p>
          ) : (
            items.map(it => (
              <div key={it.id} className="flex items-center mb-4 space-x-3">
                {it.imageUrl && (
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-gray-500">
                    {it.quantity} × {currencyFormatter.format(it.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <p className="font-semibold">
                    {currencyFormatter.format(it.price * it.quantity)}
                  </p>
                  <button
                    onClick={() => handleRemove(it.id)}
                    className="text-red-500 text-sm hover:underline focus:outline-none"
                    aria-label={`Eliminar ${it.name} del carrito`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold">
              {currencyFormatter.format(total)}
            </span>
          </div>
          <button
            onClick={handleFinalize}
            disabled={items.length === 0}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none"
          >
            Pagar con tarjeta
          </button>
        </footer>
      </aside>
    </>
  )
}

export default React.memo(SideNav)
