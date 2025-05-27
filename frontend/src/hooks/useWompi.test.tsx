// src/hooks/useWompi.test.tsx
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePayment, UsePaymentInput } from './useWompi';
import * as redux from 'react-redux';
import {
  startTransaction,
  setTransactionSuccess,
  setTransactionFailed,
} from '../features/transaction/transactionSlice';

describe('usePayment hook', () => {
  const OLD_ENV = process.env;
  const mockDispatch = jest.fn();

  beforeAll(() => {
    process.env.REACT_APP_BACKEND_URL = 'https://snapbuy-backend-staging.up.railway.app/api';
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockDispatch.mockClear();
    (global as any).fetch = jest.fn();
  });

  const dummyInput: UsePaymentInput = {
    cardNumber: '4111111111111111',
    expMonth: '12',
    expYear: '2030',
    cvc: '123',
    name: 'John Doe',
    address: '123 Main St',
    email: 'john@example.com',
    amountInCents: 5000,
    products: [{ productId: 'p1', quantity: 2 }],
    documentType: 'CC',
    documentNumber: '12345678',
    installments: 1,
    deliveryInfo: {
      addressLine1: '123 Main St',
      city: 'City',
      state: 'State',
      postalCode: '00000',
      country: 'Country',
    },
  };

  it('succeeds when both fetches return ok', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'cust123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactionId: 'tx123' }),
      });

    const { result } = renderHook(() => usePayment());

    let returned: boolean;
    await act(async () => {
      returned = await result.current.handlePayment(dummyInput);
    });

    expect(returned!).toBe(true);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, startTransaction());
    expect(mockDispatch).toHaveBeenNthCalledWith(
      2,
      setTransactionSuccess({ id: 'tx123' })
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fails and dispatches setTransactionFailed on JSON error', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'cust123' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Invalid card',
          details: { error: { messages: { cvc: ['too short'] } } },
        }),
      });

    const { result } = renderHook(() => usePayment());

    let returned: boolean;
    await act(async () => {
      returned = await result.current.handlePayment(dummyInput);
    });

    expect(returned!).toBe(false);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, startTransaction());
    expect(mockDispatch).toHaveBeenNthCalledWith(
      2,
      setTransactionFailed({ message: 'too short' })
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('too short');
  });

  it('handles non-JSON payment error', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'cust123' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => { throw new SyntaxError(); },
        text: async () => 'Server error',
      });

    const { result } = renderHook(() => usePayment());

    let returned: boolean;
    await act(async () => {
      returned = await result.current.handlePayment(dummyInput);
    });

    expect(returned!).toBe(false);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, startTransaction());
    expect(mockDispatch).toHaveBeenNthCalledWith(
      2,
      setTransactionFailed({ message: 'Server error' })
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Server error');
  });
});
