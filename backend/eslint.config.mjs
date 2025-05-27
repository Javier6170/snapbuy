import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// Polyfill de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compat para compartir configs clásicas
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Reemplaza todos los "extends" clásicos
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended'
  ),

  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': '@typescript-eslint/eslint-plugin',
      import: 'eslint-plugin-import',
      prettier: 'eslint-plugin-prettier',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'import/order': ['warn', { 'newlines-between': 'always' }],
      quotes: ['error', 'single'],
      'prettier/prettier': 'error',
    },
  },
];
