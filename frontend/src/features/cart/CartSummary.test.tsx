// src/features/cart/CartSummary.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartSummary from './CartSummary';
import * as redux from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('CartSummary component', () => {
  const mockOnNext = jest.fn();
  const BASE_FEE = 3000;
  const DELIVERY_FEE = 5000;

  const product = { id: 'p1', name: 'Prod 1', price: 1000, stock: 5 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty message when cart is empty', () => {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({ checkout: { step: 1 }, cart: { items: [] }, products: { items: [] } })
    );
    render(<CartSummary onNext={mockOnNext} />);
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  it('renders line items, fees and total correctly', () => {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector => {
      const state = {
        checkout: { step: 1 },
        cart: { items: [{ productId: 'p1', quantity: 2 }] },
        products: { items: [product] },
      };
      return selector(state);
    });

    render(<CartSummary onNext={mockOnNext} />);

    // line item
    expect(screen.getByText('Prod 1')).toBeInTheDocument();
    expect(screen.getByText('2 × COP 1.000')).toBeInTheDocument();
    expect(screen.getByText('COP 2.000')).toBeInTheDocument();

    // fees
    expect(screen.getByText('Tarifa base')).toBeInTheDocument();
    expect(screen.getByText(`COP ${BASE_FEE}`)).toBeInTheDocument();
    expect(screen.getByText('Envío')).toBeInTheDocument();
    expect(screen.getByText(`COP ${DELIVERY_FEE}`)).toBeInTheDocument();

    // total = 2*1000 + 3000 + 5000 = 10000
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('COP 10.000')).toBeInTheDocument();
  });

  it('shows checkbox and disabled button when step is 1, enables on accept, and calls onNext', () => {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({ checkout: { step: 1 }, cart: { items: [{ productId: 'p1', quantity: 1 }] }, products: { items: [product] } })
    );

    render(<CartSummary onNext={mockOnNext} />);

    const checkbox = screen.getByRole('checkbox');
    const button = screen.getByRole('button', { name: /Contuinar pago con tarjeta de credito/i });

    expect(checkbox).toBeInTheDocument();
    expect(button).toBeDisabled();

    // click to accept
    fireEvent.click(checkbox);
    expect(button).toBeEnabled();

    // click to next
    fireEvent.click(button);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('does not render terms and button when step is not 1', () => {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({ checkout: { step: 0 }, cart: { items: [{ productId: 'p1', quantity: 1 }] }, products: { items: [product] } })
    );
    render(<CartSummary onNext={mockOnNext} />);
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryByRole('button', { name: /Contuinar pago con tarjeta de credito/i })).toBeNull();
  });
});
