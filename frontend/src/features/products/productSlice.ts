import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchProducts } from '../../services/api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
}

interface ProductState {
  items: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
}

export const loadProducts = createAsyncThunk<Product[]>(
  'products/load',
  async () => await fetchProducts()
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateStock(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload
      const product = state.items.find(p => p.id === productId)
      if (product && product.stock >= quantity) product.stock -= quantity
    },
    restoreStock(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload
      const product = state.items.find(p => p.id === productId)
      if (product) {
        product.stock += quantity
      }
    }


  },

  extraReducers: builder => {
    builder
      .addCase(loadProducts.pending, state => { state.loading = true; state.error = null })
      .addCase(loadProducts.fulfilled, (state, { payload }) => { state.items = payload; state.loading = false })
      .addCase(loadProducts.rejected, (state, action) => { state.error = action.error.message || 'Error al cargar productos'; state.loading = false })
  },
})

export const { updateStock, restoreStock } = productSlice.actions
export default productSlice.reducer
