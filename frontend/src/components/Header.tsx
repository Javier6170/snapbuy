import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import SideNav from './SideNav'
import { useCart } from '../hooks/useCart'
import { clearCart } from '../features/cart/cartSlice'
import { setCheckoutStep } from '../features/checkout/checkoutSlice'

interface CartButtonProps {
  count: number
  onClick: () => void
}

const CartButton: React.FC<CartButtonProps> = React.memo(({ count, onClick }) => (
  <button
    type="button"
    aria-label="Abrir carrito"
    onClick={onClick}
    className="relative focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
        {count}
      </span>
    )}
  </button>
))

const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { quantity } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  const openCart = useCallback(() => {
    setCartOpen(true)
  }, [])

  const closeCart = useCallback(() => setCartOpen(false), [])

  const goHome = useCallback(() => {
    dispatch(clearCart())
    dispatch(setCheckoutStep(1))
    navigate('/')
  }, [dispatch, navigate])

  return (
    <>
      <header role="banner" className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" onClick={goHome} className="text-2xl font-bold text-gray-800">
            SnapBuy
          </Link>
          <CartButton count={quantity} onClick={openCart} />
        </div>
      </header>

      <SideNav isOpen={cartOpen} onClose={closeCart} />
    </>
  )
}

export default React.memo(Header)
