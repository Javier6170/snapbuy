// src/features/cart/CartSummary.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import PaymentModal from '../../components/PaymentModal';

const BASE_FEE = Number(process.env.REACT_APP_BASE_FEE || 3000);
const DELIVERY_FEE = Number(process.env.REACT_APP_DELIVERY_FEE || 5000);

const CartSummary: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const product = useSelector((state: RootState) =>
    state.products.items.find(p => p.id === state.cart.productId)
  );
  const quantity = useSelector((state: RootState) => state.cart.quantity);

  if (!product || quantity === 0) {
    return <p className="text-center">No hay productos en el carrito.</p>;
  }

  const subtotal = product.price * quantity;
  const total = subtotal + BASE_FEE + DELIVERY_FEE;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>

      <div className="mb-2">
        <strong>Producto:</strong> {product.name}
      </div>
      <div className="mb-2">
        <strong>Cantidad:</strong> {quantity}
      </div>
      <div className="mb-2">
        <strong>Subtotal:</strong> ${subtotal.toLocaleString()}
      </div>
      <div className="mb-2">
        <strong>Tarifa base:</strong> ${BASE_FEE.toLocaleString()}
      </div>
      <div className="mb-2">
        <strong>Envío:</strong> ${DELIVERY_FEE.toLocaleString()}
      </div>
      <div className="mt-4 text-xl font-bold">
        Total: ${total.toLocaleString()}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="btn-primary w-full mt-6"
      >
        Proceder al pago
      </button>

      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CartSummary;
