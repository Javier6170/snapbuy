import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay component', () => {
  it('renders the backdrop and inner container with spinner and text', () => {
    const { container } = render(<LoadingOverlay />);

    // 1) Backdrop principal (primer div)
    // eslint-disable-next-line testing-library/no-node-access
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

    // 2) El contenedor interior (div con el texto)
    const text = screen.getByText('Procesando pago...');
    // eslint-disable-next-line testing-library/no-node-access
    const inner = text.closest('div');
    expect(inner).toHaveClass(
      'bg-white',
      'p-4',
      'rounded-lg',
      'shadow-lg',
      'flex',
      'items-center',
      'gap-2'
    );

    // 3) El spinner SVG existe como hijo del inner
    // eslint-disable-next-line testing-library/no-node-access
    const spinner = inner?.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });
});
