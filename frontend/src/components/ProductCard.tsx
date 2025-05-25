import React, { ChangeEvent } from 'react'
import type { Product } from '../features/products/productSlice'

interface Props {
  product: Product
  quantity: number
  onQuantityChange: (id: string, value: number) => void
  onAdd: (product: Product) => void
  onSelect: () => void
}

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
})

export const ProductCard: React.FC<Props> = React.memo(({ product, quantity, onQuantityChange, onAdd, onSelect }) => (
  <div
    role="button"
    onClick={onSelect}
    className="bg-white rounded-2xl shadow hover:shadow-xl transform hover:-translate-y-1 transition cursor-pointer overflow-hidden flex flex-col min-h-[420px]"
  >
    <div className="w-full h-48 flex items-center justify-center bg-white border-b">
      <img
        src={product.imageUrl || '/placeholder.png'}
        alt={product.name}
        loading="lazy"
        className="max-h-full max-w-full object-contain"
      />
    </div>
    <div className="p-4 flex flex-col flex-1 justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-600 text-lg font-bold">{formatter.format(product.price)}</span>
          <span className="text-gray-500 text-sm">Stock: {product.stock}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <input
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onClick={e => e.stopPropagation()}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            onQuantityChange(product.id, parseInt(e.target.value, 10))
          }}
          className="w-16 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={e => { e.stopPropagation(); onAdd(product) }}
          disabled={product.stock === 0}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar'}
        </button>
      </div>
    </div>
  </div>
))