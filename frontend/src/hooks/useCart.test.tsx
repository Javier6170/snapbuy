// src/hooks/useCart.test.tsx
import { renderHook } from '@testing-library/react';
import * as redux from 'react-redux';
import { useCart } from './useCart';
import { shallowEqual } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('useCart hook', () => {
  const dummyItems = [
    { productId: 'p1', quantity: 2 },
    { productId: 'p2', quantity: 3 },
  ];

  beforeEach(() => {
    // Cast useSelector to jest.Mock via unknown to satisfy TS
    (redux.useSelector as unknown as jest.Mock).mockImplementation(
      (selector: any, equalityFn: any) => selector({ cart: { items: dummyItems } })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches and returns the total quantity using shallowEqual', () => {
    const { result } = renderHook(() => useCart());

    // Verify useSelector was called with our selector and shallowEqual
    expect(redux.useSelector as unknown as jest.Mock).toHaveBeenCalledWith(
      expect.any(Function),
      shallowEqual
    );

    // The quantity should be the sum: 2 + 3 = 5
    expect(result.current.quantity).toBe(5);
  });
});
