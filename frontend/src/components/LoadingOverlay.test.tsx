/* eslint-disable testing-library/no-container */
// src/components/LoadingOverlay.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

/* eslint-disable testing-library/no-node-access */
describe('LoadingOverlay component', () => {
  it('renders the backdrop and inner container with spinner and text', () => {
    const { container } = render(<LoadingOverlay />);

    // 1) El backdrop principal
    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop).toHaveClass(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-40',
      'z-50',
      'flex',
      'items-center',
      'justify-center'
    );

    // 2) El contenedor interior
    // eslint-disable-next-line testing-library/no-container
    const inner = container.querySelector('div > div') as HTMLElement;
    expect(inner).toHaveClass(
      'bg-white',
      'p-4',
      'rounded-lg',
      'shadow-lg',
      'flex',
      'items-center',
      'gap-2'
    );

    // 3) El spinner SVG existe
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();

    // 4) El texto aparece correctamente
    expect(screen.getByText('Procesando pago...')).toBeInTheDocument();
  });
});
