// src/features/products/productSlice.test.ts
import reducer, { updateStock, loadProducts, Product } from './productSlice';
import { AnyAction } from 'redux';

describe('productSlice reducer', () => {
  const initialState = { items: [] as Product[], loading: false, error: null as string | null };

  it('should return the initial state when passed undefined', () => {
    const state = reducer(undefined, {} as AnyAction);
    expect(state).toEqual(initialState);
  });

  describe('updateStock', () => {
    it('should decrease stock when quantity ≤ current stock', () => {
      const stateWithItems = {
        ...initialState,
        items: [{ id: 'p1', name: '', description: '', price: 10, stock: 5, imageUrl: '' }],
      };
      const next = reducer(
        stateWithItems,
        updateStock({ productId: 'p1', quantity: 3 })
      );
      expect(next.items[0].stock).toBe(2);
    });

    it('should not change stock when quantity > current stock', () => {
      const stateWithItems = {
        ...initialState,
        items: [{ id: 'p1', name: '', description: '', price: 10, stock: 2, imageUrl: '' }],
      };
      const next = reducer(
        stateWithItems,
        updateStock({ productId: 'p1', quantity: 5 })
      );
      expect(next.items[0].stock).toBe(2);
    });

    it('should do nothing if productId not found', () => {
      const stateWithItems = {
        ...initialState,
        items: [{ id: 'p1', name: '', description: '', price: 10, stock: 5, imageUrl: '' }],
      };
      const next = reducer(
        stateWithItems,
        updateStock({ productId: 'p2', quantity: 3 })
      );
      expect(next).toEqual(stateWithItems);
    });
  });

  describe('loadProducts async thunk', () => {
    const fakeProducts: Product[] = [
      { id: 'a', name: 'A', description: '', price: 1, stock: 1, imageUrl: '' },
      { id: 'b', name: 'B', description: '', price: 2, stock: 2, imageUrl: '' },
    ];

    it('should set loading=true on pending', () => {
      const action = { type: loadProducts.pending.type };
      const next = reducer(initialState, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    it('should populate items on fulfilled', () => {
      const action = {
        type: loadProducts.fulfilled.type,
        payload: fakeProducts,
      };
      const next = reducer({ ...initialState, loading: true }, action);
      expect(next.items).toEqual(fakeProducts);
      expect(next.loading).toBe(false);
    });

    it('should set error on rejected', () => {
      const action = {
        type: loadProducts.rejected.type,
        error: { message: 'Network error' },
      };
      const next = reducer({ ...initialState, loading: true }, action);
      expect(next.error).toBe('Network error');
      expect(next.loading).toBe(false);
    });

    it('should default error message if none provided', () => {
      const action = {
        type: loadProducts.rejected.type,
        error: { message: undefined },
      };
      const next = reducer({ ...initialState, loading: true }, action);
      expect(next.error).toBe('Error al cargar productos');
      expect(next.loading).toBe(false);
    });
  });
});
