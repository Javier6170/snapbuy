// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginImport from 'eslint-plugin-import';

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  /** aquí le decimos cuál es el config "recommendado" */
  recommendedConfig: js.configs.recommended,
});

export default [
  // primero el config de JS de ESLint
  js.configs.recommended,

  // luego el compat boilerplate que "traduce" antiguos extends
  ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),

  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: pluginPrettier,
      import: pluginImport,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'import/order': ['warn', { 'newlines-between': 'always' }],
      quotes: ['error', 'single'],
    },
  },
];
