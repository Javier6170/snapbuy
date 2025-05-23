// src/components/SideNav.tsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../app/store'
import { clearCart } from '../features/cart/cartSlice'

interface SideNavProps {
  isOpen: boolean
  onClose: () => void
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Ahora cart.items es un array de { productId, quantity }
  const items = useSelector((s: RootState) =>
    s.cart.items
      .map(ci => {
        const p = s.products.items.find(p => p.id === ci.productId)
        return p ? { ...p, quantity: ci.quantity } : null
      })
      .filter(Boolean) as Array<{ id: string, name: string, price: number, imageUrl?: string, quantity: number }>
  )

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

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
        />
      )}

      {/* Side panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl
          transform transition-transform z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

        {/* Header */}
        <header className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Tu carrito</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </header>

        {/* Cart items */}
        <div className="p-4 flex-1 overflow-y-auto">
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
                    {it.quantity} × ${(it.price / 100).toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${( (it.price * it.quantity) / 100 ).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold">
              ${(total / 100).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleFinalize}
            disabled={items.length === 0}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Finalizar compra
          </button>
        </footer>

      </aside>
    </>
  )
}

export default SideNav
