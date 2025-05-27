// src/hooks/useAppDispatch.test.ts
import { renderHook } from '@testing-library/react';
import * as redux from 'react-redux';
import { useAppDispatch } from './useAppDispatch';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('useAppDispatch hook', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // Cast to jest.Mock to satisfy TS
    (redux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the dispatch function from react-redux', () => {
    const { result } = renderHook(() => useAppDispatch());
    expect(result.current).toBe(mockDispatch);
    expect(redux.useDispatch as unknown as jest.Mock).toHaveBeenCalled();
  });
});
