// src/components/Header.tsx
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import { useNavigate } from 'react-router-dom'        
import { RootState } from '../app/store'
import { setCheckoutStep } from '../features/checkout/checkoutSlice'
import SideNav from './SideNav'

const Header: React.FC = () => {
  const quantity = useSelector((s: RootState) => s.cart.quantity)
  const dispatch = useDispatch()
  const navigate = useNavigate()                       
  const [cartOpen, setCartOpen] = useState(false)

  const openCart = () => {
    dispatch(setCheckoutStep(1))
    setCartOpen(true)
  }

  const goHome = () => {
    dispatch(setCheckoutStep(1))
    navigate('/')                                       
  }

 

  return (
    <>
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={goHome}                        
          >
            SnapBuy
          </h1>

          <button
            onClick={openCart}
            className="relative"
            aria-label="Abrir carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-gray-700 hover:text-blue-600 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13m-13 0a1 1 0 102 0m9 0a1 1 0 102 0"
              />
            </svg>
            {quantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {quantity}
              </span>
            )}
          </button>
        </div>
      </header>

      <SideNav isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default Header
