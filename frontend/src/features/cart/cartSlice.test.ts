// src/features/cart/cartSlice.test.ts
import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  CartItem,
} from './cartSlice';

describe('cartSlice reducer', () => {
  const initialState = { items: [] as CartItem[] };

  it('should return the initial state when passed an empty action', () => {
    const result = cartReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('addToCart should add a new item if not present', () => {
    const action = addToCart({ productId: 'p1', quantity: 2 });
    const result = cartReducer(initialState, action);
    expect(result.items).toEqual([{ productId: 'p1', quantity: 2 }]);
  });

  it('addToCart should increment quantity if item already exists', () => {
    const state = { items: [{ productId: 'p1', quantity: 2 }] };
    const action = addToCart({ productId: 'p1', quantity: 3 });
    const result = cartReducer(state, action);
    expect(result.items).toEqual([{ productId: 'p1', quantity: 5 }]);
  });

  it('updateQuantity should set the exact quantity for an existing item', () => {
    const state = { items: [{ productId: 'p1', quantity: 5 }] };
    const action = updateQuantity({ productId: 'p1', quantity: 10 });
    const result = cartReducer(state, action);
    expect(result.items).toEqual([{ productId: 'p1', quantity: 10 }]);
  });

  it('updateQuantity should do nothing if item does not exist', () => {
    const state = { items: [{ productId: 'p1', quantity: 5 }] };
    const action = updateQuantity({ productId: 'p2', quantity: 3 });
    const result = cartReducer(state, action);
    expect(result).toEqual(state);
  });

  it('removeFromCart should remove the specified product', () => {
    const state = {
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 4 },
      ],
    };
    const action = removeFromCart({ productId: 'p1' });
    const result = cartReducer(state, action);
    expect(result.items).toEqual([{ productId: 'p2', quantity: 4 }]);
  });

  it('clearCart should empty all items', () => {
    const state = {
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 4 },
      ],
    };
    const action = clearCart();
    const result = cartReducer(state, action);
    expect(result.items).toEqual([]);
  });
});
