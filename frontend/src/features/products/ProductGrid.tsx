import React from 'react'
import type { Product } from './productSlice'
import { ProductCard } from '../../components/ProductCard'

interface Props {
  products: Product[]
  quantities: Record<string, number>
  onQuantityChange: (id: string, value: number) => void
  onAdd: (product: Product) => void
  onSelect: (product: Product) => void
}

export const ProductGrid: React.FC<Props> = ({ products, quantities, onQuantityChange, onAdd, onSelect }) => (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        quantity={quantities[product.id] || 1}
        onQuantityChange={onQuantityChange}
        onAdd={onAdd}
        onSelect={() => onSelect(product)}
      />
    ))}
  </div>
)
