// src/components/PaymentModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentModal from './PaymentModal';
import * as redux from 'react-redux';
import { usePayment } from '../hooks/useWompi';

jest.mock('../hooks/useWompi');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('PaymentModal', () => {
  const mockHandlePayment = jest.fn().mockResolvedValue(true);
  const mockUsePayment = { handlePayment: mockHandlePayment, loading: false };
  const mockOnBack = jest.fn();
  const mockOnNext = jest.fn();

  const customerState = {
    address1: '123 Main',
    address2: 'Apt 4',
    city: 'City',
    state: 'Region',
    postalCode: '00000',
    country: 'Country',
    phone: '555-1234',
    email: 'a@b.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const cartItems = [{ productId: 'p1', quantity: 2 }];
  const products = [{ id: 'p1', price: 100 }];

  beforeEach(() => {
    jest.clearAllMocks();
    // mock usePayment hook
    (usePayment as jest.Mock).mockReturnValue(mockUsePayment);
    // mock useSelector to return pieces of state
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector => {
      const state = {
        customer: customerState,
        cart: { items: cartItems },
        products: { items: products },
      };
      return selector(state);
    });
  });

  it('renders form and calls onBack when back button is clicked', () => {
    render(<PaymentModal onBack={mockOnBack} onNext={mockOnNext} />);
    // title
    expect(screen.getByText(/Pago seguro/i)).toBeInTheDocument();
    // back button
    const backButton = screen.getByRole('button', { name: /volver/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('throws if cart is empty', () => {
    // override cart empty
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector => {
      const state = { customer: customerState, cart: { items: [] }, products: { items: [] } };
      return selector(state);
    });
    expect(() =>
      render(<PaymentModal onBack={mockOnBack} onNext={mockOnNext} />)
    ).toThrow('Carrito vacío');
  });
});
