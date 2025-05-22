// src/features/cart/CartSummary.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import PaymentModal from '../../components/PaymentModal';
import visa from '../../assets/visa.svg';
import mastercard from '../../assets/mastercard.svg';
import amex from '../../assets/americanexpress.svg';

const BASE_FEE = Number(process.env.REACT_APP_BASE_FEE || 3000);
const DELIVERY_FEE = Number(process.env.REACT_APP_DELIVERY_FEE || 5000);

const CartSummary: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const product = useSelector((state: RootState) =>
    state.products.items.find(p => p.id === state.cart.productId)
  );
  const quantity = useSelector((state: RootState) => state.cart.quantity);

  if (!product || quantity === 0) {
    return <p className="text-center text-gray-600">Tu carrito está vacío.</p>;
  }

  const subtotal = product.price * quantity;
  const total = subtotal + BASE_FEE + DELIVERY_FEE;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumen de tu compra</h2>

      <div className="mb-6 space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Producto:</span>
          <span>{product.name}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Cantidad:</span>
          <span>{quantity}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tarifa base:</span>
          <span>${BASE_FEE.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Envío:</span>
          <span>${DELIVERY_FEE.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4">
          <span>Total:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-start space-x-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <span className="text-sm text-gray-600">
            Acepto los <a href="#" className="text-blue-600 underline">términos y condiciones</a>.
          </span>
        </label>
      </div>

      <button
        onClick={() => setShowModal(true)}
        disabled={!accepted}
        className={`mt-4 w-full py-3 px-6 text-white rounded-lg transition duration-200 shadow-md ${
          accepted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Proceder al pago
      </button>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">Aceptamos:</p>
        <div className="flex items-center space-x-4">
          <img src={mastercard} alt="Mastercard" className="h-6" />
          <img src={visa} alt="Visa" className="h-6" />
          <img src={amex} alt="Amex" className="h-6" />
        </div>
      </div>

      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CartSummary;
