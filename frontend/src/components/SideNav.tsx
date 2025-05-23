// src/components/SideNav.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../app/store'

interface SideNavProps {
  isOpen: boolean
  onClose: () => void
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { productId, quantity } = useSelector((state: RootState) => state.cart)
  const product = useSelector((state: RootState) =>
    state.products.items.find(p => p.id === productId)
  )
  const items = product ? [{ ...product, quantity }] : []
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

      {/* SideNav panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Tu carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </header>

        <div className="p-4 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío.</p>
          ) : (
            items.map(it => (
              <div key={it.id} className="flex justify-between mb-4">
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-gray-500">x{it.quantity}</p>
                </div>
                <p className="font-semibold">
                  $
                  {(it.price * it.quantity).toLocaleString('es-CO', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        <footer className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold">
              $
              {total.toLocaleString('es-CO', {
                minimumFractionDigits: 2,
              })}
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
