// src/features/products/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loadProducts } from './productSlice';
import type { RootState } from '../../app/store';
import type { Product } from './productSlice';
import { addToCart } from '../cart/cartSlice';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);

  const [selected, setSelected] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  const handleQuantityChange = (productId: string, value: number) => {
    const safeValue = Math.max(1, value);
    setQuantities((prev) => ({ ...prev, [productId]: safeValue }));
  };

  const handleAdd = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity <= product.stock) {
      dispatch(addToCart({ productId: product.id, quantity }));
      setSelected(product);
    }
  };

  const closeModal = () => setSelected(null);

  return (
    <div className="bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Productos</h1>

      {loading && <p className="text-center">Cargando productos...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <p className="mb-2">
              <span className="font-bold">Precio:</span>{' '}
              ${(product.price / 100).toFixed(2)}
            </p>
            <p className="mb-4">
              <span className="font-bold">Stock:</span> {product.stock}
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border rounded"
              />
              <button
                onClick={() => handleAdd(product)}
                disabled={product.stock === 0}
                className={`px-4 py-2 rounded ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {product.stock === 0 ? 'Agotado' : 'Agregar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">Producto agregado</h2>
            <p className="text-gray-800 font-medium">{selected.name}</p>
            <p className="text-gray-500 text-sm mb-4">{selected.description}</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={closeModal}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
