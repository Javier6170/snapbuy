// src/features/products/ProductList.tsx
import React, { useState } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { useProducts } from '../../hooks/useProducts'
import { addToCart } from '../cart/cartSlice'
import { updateStock, Product } from './productSlice'
import ProductDetailModal from './ProductDetailModal'
import { ProductGrid } from './ProductGrid'

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector((state: RootState) => state.cart.items.length)
  const { items: products, loading, error } = useProducts()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const onQuantityChange = (id: string, value: number) => {
    const max = products.find(p => p.id === id)?.stock ?? 1
    const qty = Math.max(1, Math.min(value, max))
    setQuantities(prev => ({ ...prev, [id]: qty }))
  }

  const onAdd = (product: Product) => {
    const qty = quantities[product.id] || 1
    dispatch(addToCart({ productId: product.id, quantity: qty }))
    dispatch(updateStock({ productId: product.id, quantity: qty }))
  }

  return (
    <section className="flex flex-col flex-grow px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pt-8 lg:pb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Productos</h1>

      {loading && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 mb-4 rounded" />
              <div className="h-6 bg-gray-200 mb-2 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {!loading && !error && (
        <ProductGrid
          products={products}
          quantities={quantities}
          onQuantityChange={onQuantityChange}
          onAdd={onAdd}
          onSelect={setSelectedProduct}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Banner fijo en móvil para ir al checkout */}
      {cartCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-lg">
          <span className="font-medium">
            {cartCount} {cartCount > 1 ? 'artículos' : 'artículo'} en tu carrito
          </span>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Ir a pagar
          </button>
        </div>
      )}
    </section>
  )
}

export default ProductList
