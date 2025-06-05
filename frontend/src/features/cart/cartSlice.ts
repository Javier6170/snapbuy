// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Agrega cantidad: si ya existe, suma; si no, mete uno nuevo
    addToCart(state, action: PayloadAction<CartItem>) {
      const { productId, quantity } = action.payload;
      const existing = state.items.find(i => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }
    },
    // Fija la cantidad exacta de un ítem
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.productId === productId);
      if (item) item.quantity = quantity;
    },
    decreaseQuantity(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items
        .map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    },
    removeItemCompletely(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter(i => i.productId !== action.payload.productId)
    },

    // Vacía todo el carrito
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  decreaseQuantity,
  clearCart,
  removeItemCompletely
} = cartSlice.actions;

export default cartSlice.reducer;
