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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
                ✕
            </button>

            <div className="w-full mb-4">
                <img
                    src={product.imageUrl ?? '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-auto max-h-64 object-contain rounded-lg"
                />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>

            <p className="text-gray-700 mb-4">{product.description}</p>

            <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-green-600">
                    {formatter.format(product.price)}
                </span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
            </div>

            <button
                onClick={onClose}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                Cerrar
            </button>
        </div>
    </div>
)

export default ProductDetailModal
