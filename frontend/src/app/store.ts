import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import customerReducer from '../features/customer/customerSlice';
import transactionReducer from '../features/transaction/transactionSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    customer: customerReducer,
    transaction: transactionReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Inferencia automática de tipos del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
