// features/products/productSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [
    { id: '1', name: 'Audífonos Pro', description: 'Cancelación de ruido', price: 199900, stock: 5 },
    { id: '2', name: 'Mouse Gamer', description: 'RGB 16000DPI', price: 89900, stock: 8 },
  ],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateStock(state, action) {
      const { productId, quantity } = action.payload;
      const product = state.items.find(p => p.id === productId);
      if (product && product.stock >= quantity) {
        product.stock -= quantity;
      }
    },
  },
});

export const { updateStock } = productSlice.actions;
export default productSlice.reducer;
