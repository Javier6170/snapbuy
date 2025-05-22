// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from '../features/products/ProductList';
import CartSummary from '../features/cart/CartSummary';
import TransactionResult from '../features/transaction/TransactionResult';
import Header from '../components/Header';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Ruta principal: Lista de productos + resumen */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-4">
              <ProductList />
              <CartSummary />
            </main>
          </div>
        }
      />

      {/* Ruta de resultado de transacción */}
      <Route path="/result" element={<TransactionResult />} />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;