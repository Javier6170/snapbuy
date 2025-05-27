/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import * as redux from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { setCheckoutStep } from '../features/checkout/checkoutSlice';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ to, onClick, children }: any) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock('../hooks/useCart');
jest.mock('./SideNav', () => ({ isOpen, onClose }: any) => (
  <div data-testid="sidenav">{isOpen ? 'OPEN' : 'CLOSED'}</div>
));

describe('Header component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (redux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useCart as jest.Mock).mockReturnValue({ quantity: 5 });
    jest.clearAllMocks();
  });

  it('renders brand and cart button with badge', () => {
    render(<Header />);
    expect(screen.getByText('SnapBuy')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByTestId('sidenav').textContent).toBe('CLOSED');
  });

  it('opens SideNav when cart button clicked', () => {
    render(<Header />);
    const button = screen.getByLabelText('Abrir carrito');
    fireEvent.click(button);
    expect(screen.getByTestId('sidenav').textContent).toBe('OPEN');
  });

  it('dispatches clearCart, setCheckoutStep and navigates home when brand clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('SnapBuy'));
    expect(mockDispatch).toHaveBeenCalledWith(clearCart());
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(1));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
