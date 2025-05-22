// src/features/products/ProductList.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import type { Product } from './productSlice';
import { addToCart } from '../cart/cartSlice';

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);

  const handleAdd = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <p className="mb-2">
            <span className="font-bold">Precio:</span>{' '}
            ${product.price.toLocaleString()}
          </p>
          <p className="mb-4">
            <span className="font-bold">Stock:</span> {product.stock}
          </p>
          <button
            onClick={() => handleAdd(product.id)}
            disabled={product.stock === 0}
            className={`w-full py-2 rounded ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
