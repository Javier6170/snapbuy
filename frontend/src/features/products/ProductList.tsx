// src/features/products/ProductList.tsx
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { loadProducts } from './productSlice'
import type { RootState } from '../../app/store'
import type { Product } from './productSlice'
import { addToCart } from '../cart/cartSlice'
import ProductDetailModal from './ProductDetailModal'

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
})

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: products, loading, error } = useSelector((state: RootState) => state.products)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  const handleQuantityChange = (productId: string, value: number) => {
    const maxStock = products.find(p => p.id === productId)?.stock ?? 1
    const qty = Math.max(1, Math.min(value, maxStock))
    setQuantities(prev => ({ ...prev, [productId]: qty }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    if (quantity <= product.stock) {
      dispatch(addToCart({ productId: product.id, quantity }))
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Productos</h1>

      {loading && <p className="text-center text-gray-600">Cargando productos...</p>}
      {error && <p className="text-center text-red-500">Error al cargar productos: {error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transform hover:-translate-y-1 transition cursor-pointer overflow-hidden flex flex-col"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Imagen */}
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 overflow-hidden rounded-t-2xl">
  <img
    src={product.imageUrl ?? '/placeholder.png'}
    alt={product.name}
    className="object-contain w-full h-full"
  />
</div>

            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  {formatter.format(product.price)}
                </span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantities[product.id] || 1}
                  onClick={e => e.stopPropagation()}
                  onChange={e => {
                    e.stopPropagation()
                    handleQuantityChange(product.id, parseInt(e.target.value, 10))
                  }}
                  className="w-16 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                  disabled={product.stock === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition ${product.stock === 0
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {product.stock === 0 ? 'Agotado' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}

export default ProductList
