// src/features/cart/CartSummary.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const BASE_FEE = 3000;
const DELIVERY_FEE = 5000;

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
});

interface CartSummaryProps {
  onNext: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onNext }) => {
  const [accepted, setAccepted] = useState(false);

  // 1. Seleccionamos los ítems del carrito y todos los productos
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const products  = useSelector((s: RootState) => s.products.items);

  // 2. Unimos cada línea de carrito con su producto
  const details = cartItems.map(ci => {
    const product = products.find(p => p.id === ci.productId)!;
    return { ...ci, product };
  });

  if (details.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        Tu carrito está vacío.
      </p>
    );
  }

  // 3. Calculamos subtotal y total
  const subtotal = details.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const total = subtotal + BASE_FEE + DELIVERY_FEE;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Resumen de tu compra
      </h2>

      <div className="space-y-4 mb-6">
        {details.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex justify-between items-center text-gray-700"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">
                {quantity} × {currencyFormatter.format(product.price)}
              </p>
            </div>
            <p className="font-semibold">
              {currencyFormatter.format(product.price * quantity)}
            </p>
          </div>
        ))}

        <div className="flex justify-between text-gray-700">
          <span>Tarifa base</span>
          <span>{currencyFormatter.format(BASE_FEE)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Envío</span>
          <span>{currencyFormatter.format(DELIVERY_FEE)}</span>
        </div>
      </div>

      <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4 mb-6">
        <span>Total</span>
        <span>{currencyFormatter.format(total)}</span>
      </div>

      <label className="inline-flex items-center mb-6">
        <input
          type="checkbox"
          className="mr-2"
          checked={accepted}
          onChange={() => setAccepted(a => !a)}
        />
        <span className="text-sm text-gray-600">
          Acepto los{' '}
          <button className="text-blue-600 underline">
            términos y condiciones
          </button>.
        </span>
      </label>

      <button
        onClick={onNext}
        disabled={!accepted}
        className={`w-full py-3 text-white rounded-lg transition duration-200 shadow-md ${
          accepted
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continuar al formulario de entrega
      </button>
    </div>
  );
};

export default CartSummary;
