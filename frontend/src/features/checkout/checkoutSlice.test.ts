// src/features/checkout/checkoutSlice.test.ts
import checkoutReducer, { setCheckoutStep } from './checkoutSlice';

describe('checkoutSlice', () => {
  it('should return the initial state', () => {
    const initialState = undefined;
    const action = { type: '' };
    const state = checkoutReducer(initialState, action as any);
    expect(state).toEqual({ step: 1 });
  });

  it('should handle setCheckoutStep', () => {
    const startState = { step: 1 };
    const action = setCheckoutStep(3);
    const state = checkoutReducer(startState, action);
    expect(state.step).toBe(3);

    // changing again
    const newState = checkoutReducer(state, setCheckoutStep(2));
    expect(newState.step).toBe(2);
  });
});
