// src/components/ProductCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '../features/products/productSlice';

describe('ProductCard', () => {
  const product: Product = {
      id: 'p1',
      name: 'Test Product',
      price: 1234.5,
      stock: 3,
      imageUrl: 'http://example.com/img.png',
      description: 'exampleee'
  };

  const setup = (overrides?: Partial<Product>) => {
    const prod = { ...product, ...overrides };
    const onQuantityChange = jest.fn();
    const onAdd = jest.fn();
    const onSelect = jest.fn();
    render(
      <ProductCard
        product={prod}
        quantity={2}
        onQuantityChange={onQuantityChange}
        onAdd={onAdd}
        onSelect={onSelect}
      />
    );
    return { prod, onQuantityChange, onAdd, onSelect };
  };

  it('renders name, formatted price and stock', () => {
    setup();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Product');
    expect(screen.getByText('COP 1.234,50')).toBeInTheDocument(); // formatted price
    expect(screen.getByText(/Stock: 3/)).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    const { onSelect } = setup();
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('input has correct value, min and max and calls onQuantityChange', () => {
    const { onQuantityChange, prod } = setup();
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('2');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', prod.stock.toString());

    fireEvent.change(input, { target: { value: '3' } });
    expect(onQuantityChange).toHaveBeenCalledWith(prod.id, 3);
  });

  it('renders enabled "Agregar" button and calls onAdd when clicked', () => {
    const { onAdd, prod } = setup();
    const button = screen.getByRole('button', { name: /Agregar/i });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onAdd).toHaveBeenCalledWith(prod);
  });

  it('renders disabled "Agotado" button when stock is zero', () => {
    const { onAdd } = setup({ stock: 0 });
    const button = screen.getByRole('button', { name: /Agotado/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('uses placeholder image when imageUrl is empty', () => {
    setup({ imageUrl: '' });
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('/placeholder.png');
  });
});
