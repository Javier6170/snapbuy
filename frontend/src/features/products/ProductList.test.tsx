// src/features/products/ProductList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';
import * as redux from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { addToCart } from '../cart/cartSlice';
import { updateStock, Product } from './productSlice';

jest.mock('../../hooks/useAppDispatch');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../../hooks/useProducts');
jest.mock('./ProductGrid', () => ({
  ProductGrid: ({ products, quantities, onQuantityChange, onAdd, onSelect }: any) => (
    <div data-testid="grid">
      {products.map((p: Product) => (
        <div key={p.id}>
          <span>{p.name}</span>
          <input
            data-testid={`input-${p.id}`}
            value={quantities[p.id] ?? ''}
            onChange={e => onQuantityChange(p.id, Number(e.target.value))}
          />
          <button data-testid={`add-${p.id}`} onClick={() => onAdd(p)}>
            Add
          </button>
          <button data-testid={`select-${p.id}`} onClick={() => onSelect(p)}>
            Select
          </button>
        </div>
      ))}
    </div>
  ),
}));
jest.mock('./ProductDetailModal', () => ({ product, onClose }: any) => (
  <div data-testid="detail">
    <span>{product.name}</span>
    <button onClick={onClose}>Close</button>
  </div>
));

describe('ProductList', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (redux.useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({ cart: { items: [{ productId: 'p1', quantity: 1 }] } })
    );
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useProducts as unknown as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: null,
    });
    (require('../../hooks/useAppDispatch').useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('renders loading skeletons when loading', () => {
    (useProducts as unknown as jest.Mock).mockReturnValue({ items: [], loading: true, error: null });
    render(<ProductList />);
    // Expect 8 placeholders
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBe(8);
  });

  it('renders error message when error', () => {
    const err = 'Failed to load';
    (useProducts as unknown as jest.Mock).mockReturnValue({ items: [], loading: false, error: err });
    render(<ProductList />);
    expect(screen.getByText(err)).toBeInTheDocument();
  });

  it('renders grid and handles quantity/add/select', () => {
    const products: Product[] = [
      { id: 'p1', name: 'A', description: '', price: 10, stock: 5, imageUrl: '' },
      { id: 'p2', name: 'B', description: '', price: 20, stock: 2, imageUrl: '' },
    ];
    (useProducts as unknown as jest.Mock).mockReturnValue({ items: products, loading: false, error: null });
    render(<ProductList />);

    // Grid present
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    // Change quantity and click add/select for p1
    const input1 = screen.getByTestId('input-p1');
    fireEvent.change(input1, { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('add-p1'));
    expect(mockDispatch).toHaveBeenCalledWith(addToCart({ productId: 'p1', quantity: 3 }));
    expect(mockDispatch).toHaveBeenCalledWith(updateStock({ productId: 'p1', quantity: 3 }));

    fireEvent.click(screen.getByTestId('select-p1'));
    // Detail modal opens
    expect(screen.getByTestId('detail')).toHaveTextContent('A');
    // Close detail
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('detail')).toBeNull();
  });

  it('shows mobile banner and navigates to checkout', () => {
    // Cart count >0 from selector mock
    render(<ProductList />);
    const banner = screen.getByText(/1 artículo en tu carrito/i);
    expect(banner).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ir a pagar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
