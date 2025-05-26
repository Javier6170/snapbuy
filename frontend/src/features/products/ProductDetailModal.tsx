// src/features/products/ProductDetailModal.tsx
import React from 'react'
import type { Product } from './productSlice'

interface Props {
  product: Product
  onClose: () => void
}

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
})

const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-lg max-h-full overflow-y-auto relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
        aria-label="Cerrar"
      >
        ✕
      </button>

      <div className="w-full mb-4">
        <img
          src={product.imageUrl ?? '/placeholder.png'}
          alt={product.name}
          className="w-full h-auto max-h-56 sm:max-h-64 object-contain rounded-lg mx-auto"
          loading="lazy"
        />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>

      <p className="text-gray-700 mb-4 text-sm sm:text-base">{product.description}</p>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg sm:text-xl font-semibold text-green-600">
          {formatter.format(product.price)}
        </span>
        <span className="text-sm sm:text-base text-gray-500">Stock: {product.stock}</span>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition"
      >
        Cerrar
      </button>
    </div>
  </div>
)

export default ProductDetailModal
