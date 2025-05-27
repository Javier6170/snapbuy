// src/components/SideNav.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideNav from './SideNav';
import * as redux from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../features/cart/cartSlice';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SideNav component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockOnClose = jest.fn();

  const product = {
    id: 'p1',
    name: 'Test Product',
    price: 100,
    imageUrl: 'http://example.com/img.png',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (redux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders nothing when closed', () => {
    render(<SideNav isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText(/Tu carrito está vacío/)).toBeNull();
  });

  it('shows empty cart message and disabled pay button', () => {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({ cart: { items: [] }, products: { items: [] } })
    );
    render(<SideNav isOpen={true} onClose={mockOnClose} />);
    // Overlay
    const overlay = screen.getByRole('presentation');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
    // Empty message
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    // Pay button disabled
    const payButton = screen.getByRole('button', { name: /Pagar con tarjeta/i });
    expect(payButton).toBeDisabled();
  });

  it('lists items and allows removal and finalize', () => {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        cart: { items: [{ productId: 'p1', quantity: 2 }] },
        products: { items: [product] },
      })
    );
    render(<SideNav isOpen={true} onClose={mockOnClose} />);
    // Aside panel visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('translate-x-0');
    // Item details
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/2 ×/)).toBeInTheDocument();
    expect(screen.getByText('COP 200')).toBeInTheDocument();
    // Remove button
    const removeButton = screen.getByRole('button', { name: /Eliminar Test Product del carrito/i });
    fireEvent.click(removeButton);
    expect(mockDispatch).toHaveBeenCalledWith(removeFromCart({ productId: 'p1' }));
    // Total
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('COP 200')).toBeInTheDocument();
    // Finalize
    const payButton = screen.getByRole('button', { name: /Pagar con tarjeta/i });
    expect(payButton).toBeEnabled();
    fireEvent.click(payButton);
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
