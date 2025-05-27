// src/components/Stepper.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Stepper from './Stepper';

describe('Stepper component', () => {
  const steps = ['Paso 1', 'Paso 2', 'Paso 3'];

  it('renders all step labels', () => {
    render(<Stepper steps={steps} current={0} />);
    steps.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('highlights the correct circles based on current index', () => {
    render(<Stepper steps={steps} current={1} />);

    // Step 1 circle should be active
    const circle1 = screen.getByText('1');
    expect(circle1).toHaveClass('bg-blue-600', 'text-white');

    // Step 2 circle should be active
    const circle2 = screen.getByText('2');
    expect(circle2).toHaveClass('bg-blue-600', 'text-white');

    // Step 3 circle should be inactive
    const circle3 = screen.getByText('3');
    expect(circle3).toHaveClass('bg-gray-200', 'text-gray-600');
  });

  it('renders all circles inactive when current is 0 except the first', () => {
    render(<Stepper steps={steps} current={0} />);

    const circle1 = screen.getByText('1');
    expect(circle1).toHaveClass('bg-blue-600', 'text-white');

    const circle2 = screen.getByText('2');
    expect(circle2).toHaveClass('bg-gray-200', 'text-gray-600');

    const circle3 = screen.getByText('3');
    expect(circle3).toHaveClass('bg-gray-200', 'text-gray-600');
  });

  it('renders all circles active when current is last index', () => {
    render(<Stepper steps={steps} current={steps.length - 1} />);

    steps.forEach((_, idx) => {
      const circle = screen.getByText(String(idx + 1));
      expect(circle).toHaveClass('bg-blue-600', 'text-white');
    });
  });
});
