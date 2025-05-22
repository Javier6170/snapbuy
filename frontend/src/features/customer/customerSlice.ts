// features/customer/customerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Customer {
  name: string;
  address: string;
  email: string;
}

const initialState: Customer = {
  name: '',
  address: '',
  email: '',
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerInfo(state, action: PayloadAction<Customer>) {
      return action.payload;
    },
  },
});

export const { setCustomerInfo } = customerSlice.actions;
export default customerSlice.reducer;
