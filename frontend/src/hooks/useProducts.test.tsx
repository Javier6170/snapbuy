// src/hooks/useProducts.test.tsx
import { renderHook } from '@testing-library/react';
import { useProducts } from './useProducts';
import { loadProducts } from '../features/products/productSlice';
import { useAppDispatch } from './useAppDispatch';
import { useSelector } from 'react-redux';

// Mocks
jest.mock('./useAppDispatch');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('useProducts hook', () => {
  const mockDispatch = jest.fn();
  const dummyState = {
    items: [{ id: 'p1', name: 'Product 1' }],
    loading: false,
    error: 'Oops',
  };

  beforeAll(() => {
    // @ts-ignore
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  beforeEach(() => {
    mockDispatch.mockClear();
    // Cast to jest.Mock via unknown to satisfy TS
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({ products: dummyState })
    );
  });

  it('dispatches loadProducts on mount and returns state slice', () => {
    const { result } = renderHook(() => useProducts());

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(loadProducts());

    expect(result.current.items).toEqual(dummyState.items);
    expect(result.current.loading).toBe(dummyState.loading);
    expect(result.current.error).toBe(dummyState.error);
  });
});
