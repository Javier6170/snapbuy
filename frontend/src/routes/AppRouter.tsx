import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header       from '../components/Header'
import ProductList  from '../features/products/ProductList'
import CheckoutFlow from '../features/checkout/CheckoutFlow'
import Footer       from '../components/Footer'

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Header />

    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/checkout" element={<CheckoutFlow />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    <Footer />
  </BrowserRouter>

)

export default AppRouter
