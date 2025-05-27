// src/services/api.test.ts
import {
  createTransaction,
  fetchProducts,
  updateStock,
} from './api';

describe('API service', () => {
  const OLD_ENV = process.env;
  const fakeUrl = 'https://example.com';

  beforeAll(() => {
    process.env.REACT_APP_BACKEND_URL = fakeUrl;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createTransaction', () => {
    const transaction = { foo: 'bar' };
    it('resolves with JSON on 2xx', async () => {
      const mockResponse = { id: '123' };
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as any);

      await expect(createTransaction(transaction)).resolves.toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${fakeUrl}/transactions`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction),
        })
      );
    });

    it('throws with parsed JSON error message on non-2xx', async () => {
      const errBody = { message: 'Bad things' };
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        text: async () => JSON.stringify(errBody),
      } as any);

      await expect(createTransaction(transaction))
        .rejects
        .toThrow('Bad things');
    });

    it('throws with raw text on non-JSON error', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        text: async () => 'plain error',
      } as any);

      await expect(createTransaction(transaction))
        .rejects
        .toThrow('plain error');
    });
  });

  describe('fetchProducts', () => {
    const products = [{ id: 'p1' }, { id: 'p2' }];
    it('resolves with JSON on 2xx', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => products,
      } as any);

      await expect(fetchProducts()).resolves.toEqual(products);
      expect(global.fetch).toHaveBeenCalledWith(`${fakeUrl}/products`);
    });

    it('throws on non-2xx', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
      } as any);

      await expect(fetchProducts())
        .rejects
        .toThrow('No se pudo cargar la lista de productos');
    });
  });

  describe('updateStock', () => {
    const pid = 'abc';
    const qty = 5;
    const result = { stock: 10 };
    it('resolves with JSON on 2xx', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => result,
      } as any);

      await expect(updateStock(pid, qty)).resolves.toEqual(result);
      expect(global.fetch).toHaveBeenCalledWith(
        `${fakeUrl}/products/${pid}/stock`,
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: qty }),
        })
      );
    });

    it('throws on non-2xx with JSON message', async () => {
      const err = { message: 'no stock' };
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        text: async () => JSON.stringify(err),
      } as any);

      await expect(updateStock(pid, qty))
        .rejects
        .toThrow('no stock');
    });

    it('throws on non-2xx with text', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        text: async () => 'plain fail',
      } as any);

      await expect(updateStock(pid, qty))
        .rejects
        .toThrow('plain fail');
    });
  });
});
