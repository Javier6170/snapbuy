// src/features/transaction/transactionSlice.test.ts
import reducer, {
  startTransaction,
  setTransactionSuccess,
  setTransactionFailed,
  resetTransaction,
} from './transactionSlice';

describe('transactionSlice reducer', () => {
  const initialState = { status: 'idle' as const };

  it('should return the initial state when passed undefined', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('should handle startTransaction', () => {
    const next = reducer(initialState, startTransaction());
    expect(next.status).toBe('pending');
    expect(next.transactionId).toBeUndefined();
    expect(next.message).toBeUndefined();
  });

  it('should handle setTransactionSuccess', () => {
    const prev = { status: 'pending' as const };
    const action = setTransactionSuccess({ id: 'TX123' });
    const next = reducer(prev, action);
    expect(next.status).toBe('success');
    expect(next.transactionId).toBe('TX123');
    expect(next.message).toBeUndefined();
  });

  it('should handle setTransactionFailed', () => {
    const prev = { status: 'pending' as const };
    const action = setTransactionFailed({ message: 'Error occurred' });
    const next = reducer(prev, action);
    expect(next.status).toBe('failed');
    expect(next.message).toBe('Error occurred');
    expect(next.transactionId).toBeUndefined();
  });

  it('should handle resetTransaction', () => {
    const prev = {
      status: 'failed' as const,
      transactionId: 'XYZ',
      message: 'Oops',
    };
    const next = reducer(prev, resetTransaction());
    expect(next).toEqual(initialState);
  });
});
