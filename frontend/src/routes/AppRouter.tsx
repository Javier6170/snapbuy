// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from '../features/products/ProductList';
import CartSummary from '../features/cart/CartSummary';
import TransactionResult from '../features/transaction/TransactionResult';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Ruta principal: Lista de productos + resumen */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-center mb-6">SnapBuy</h1>
            <ProductList />
            <CartSummary />
          </div>
        }
      />

      {/* Ruta de resultado de transacción */}
      <Route path="/result" element={<TransactionResult />} />

      {/* Cualquier otra ruta redirige a "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
