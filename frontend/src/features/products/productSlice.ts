import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../../services/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const loadProducts = createAsyncThunk('products/load', async () => {
  const products = await fetchProducts();
  return products;
});

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
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar productos';
        state.loading = false;
      });
  },
});

export const { updateStock } = productSlice.actions;
export default productSlice.reducer;
