// src/services/storageService.test.ts
import { saveToStorage, getFromStorage, clearStorage } from './storageService';

describe('storageService', () => {
  const KEY = 'testKey';
  const VALUE = { a: 1, b: 'two' };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveToStorage', () => {
    it('should stringify and save the value under the given key', () => {
      saveToStorage(KEY, VALUE);
      const raw = localStorage.getItem(KEY);
      expect(raw).toBe(JSON.stringify(VALUE));
    });
  });

  describe('getFromStorage', () => {
    it('should return parsed object if key exists', () => {
      localStorage.setItem(KEY, JSON.stringify(VALUE));
      const result = getFromStorage(KEY);
      expect(result).toEqual(VALUE);
    });

    it('should return null if key does not exist', () => {
      const result = getFromStorage('noSuchKey');
      expect(result).toBeNull();
    });

    it('should return null if stored value is invalid JSON', () => {
      localStorage.setItem(KEY, 'not-json');
      expect(() => getFromStorage(KEY)).toThrow();
    });
  });

  describe('clearStorage', () => {
    it('should remove the item from storage', () => {
      localStorage.setItem(KEY, JSON.stringify(VALUE));
      clearStorage(KEY);
      expect(localStorage.getItem(KEY)).toBeNull();
    });
  });
});
