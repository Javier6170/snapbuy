// features/transaction/transactionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'failed';
  transactionId?: string;
  message?: string;
}

const initialState: TransactionState = {
  status: 'idle',
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    startTransaction(state) {
      state.status = 'pending';
      state.transactionId = undefined;  
      state.message = undefined;        
    },
    setTransactionSuccess(state, action: PayloadAction<{ id: string }>) {
      state.status = 'success';
      state.transactionId = action.payload.id;
    },
    setTransactionFailed(state, action: PayloadAction<{ message: string }>) {
      state.status = 'failed';
      state.message = action.payload.message;
    },
    resetTransaction(state) {
      return initialState;
    },
  },
});

export const {
  startTransaction,
  setTransactionSuccess,
  setTransactionFailed,
  resetTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
