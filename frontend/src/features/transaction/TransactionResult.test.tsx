// src/features/transaction/TransactionResult.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionResult from './TransactionResult';
import * as redux from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('TransactionResult', () => {
  const mockOnRestart = jest.fn();

  const customer = {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    address2: 'Apt 4',
    city: 'Metropolis',
    state: 'State',
    postalCode: '00000',
    country: 'Country',
    phone: '555-1234',
  };
  const cartItems = [
    { productId: 'p1', quantity: 2 },
    { productId: 'p2', quantity: 1 },
  ];
  const products = [
    { id: 'p1', name: 'Product A', description: '', price: 100, stock: 5, imageUrl: '' },
    { id: 'p2', name: 'Product B', description: '', price: 200, stock: 3, imageUrl: '' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // set environment defaults
    process.env.REACT_APP_BASE_FEE = '3000';
    process.env.REACT_APP_DELIVERY_FEE = '5000';
  });

  function mockState(status: string, transactionId: string) {
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        transaction: { transactionId, status },
        customer,
        cart: { items: cartItems },
        products: { items: products },
      })
    );
  }

  it('renders approved transaction correctly', () => {
    mockState('success', 'TX123');
    render(<TransactionResult onRestart={mockOnRestart} />);

    // Heading
    expect(screen.getByRole('heading', { name: /Comprobante de Pago/i })).toBeInTheDocument();
    // Status label
    const status = screen.getByText('APROBADO');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('text-green-600');

    // Transaction ID
    expect(screen.getByText('ID Transacción:')).toBeInTheDocument();
    expect(screen.getByText('TX123')).toBeInTheDocument();

    // Item list
    expect(screen.getByText('Product A × 2')).toBeInTheDocument();
    expect(screen.getByText(/COP.*200/)).toBeInTheDocument(); // 100*2

    expect(screen.getByText('Product B × 1')).toBeInTheDocument();
    expect(screen.getByText(/COP.*200/)).toBeInTheDocument(); // 200*1

    // Fees and totals
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText(/COP.*400/)).toBeInTheDocument(); // 100*2+200*1 = 400

    expect(screen.getByText('Tarifa base')).toBeInTheDocument();
    expect(screen.getByText(/COP.*3\.000/)).toBeInTheDocument();

    expect(screen.getByText('Envío')).toBeInTheDocument();
    expect(screen.getByText(/COP.*5\.000/)).toBeInTheDocument();

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText(/COP.*8\.400/)).toBeInTheDocument(); // 400+3000+5000

    // Customer address
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, Apt 4')).toBeInTheDocument();
    expect(screen.getByText('Metropolis, State 00000')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Tel: 555-1234')).toBeInTheDocument();

    // Restart button
    const button = screen.getByRole('button', { name: /Finalizar/i });
    fireEvent.click(button);
    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  it('renders failed transaction correctly', () => {
    mockState('failure', 'ERR456');
    render(<TransactionResult onRestart={mockOnRestart} />);

    const status = screen.getByText('FALLIDO');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('text-red-600');

    expect(screen.getByText('ERR456')).toBeInTheDocument();
  });
});
