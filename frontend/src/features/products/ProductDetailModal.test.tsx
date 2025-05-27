// src/features/products/ProductDetailModal.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailModal from './ProductDetailModal';
import type { Product } from './productSlice';

describe('ProductDetailModal', () => {
  const product: Product = {
    id: 'p1',
    name: 'Product 1',
    description: 'This is a great product.',
    price: 1234.5,
    stock: 10,
    imageUrl: 'http://example.com/img.png',
  };
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders the product details correctly', () => {
    render(<ProductDetailModal product={product} onClose={onClose} />);

    // Image with alt text
    const img = screen.getByRole('img', { name: product.name });
    expect(img).toHaveAttribute('src', product.imageUrl);

    // Heading with product name
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();

    // Description text
    expect(screen.getByText(product.description)).toBeInTheDocument();

    // Price formatted in COP with two decimals
    expect(screen.getByText('COP 1.234,50')).toBeInTheDocument();

    // Stock text
    expect(screen.getByText(`Stock: ${product.stock}`)).toBeInTheDocument();
  });

  it('calls onClose when either close button is clicked', () => {
    render(<ProductDetailModal product={product} onClose={onClose} />);

    const closeButtons = screen.getAllByRole('button', { name: 'Cerrar' });
    expect(closeButtons).toHaveLength(2);

    // Click the icon button
    fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Click the footer "Cerrar" button
    fireEvent.click(closeButtons[1]);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
