import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  step: number;
}

const initialState: CheckoutState = {
  step: 1,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
  },
});

export const { setCheckoutStep } = checkoutSlice.actions;
export default checkoutSlice.reducer;