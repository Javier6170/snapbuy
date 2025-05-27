// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginImport from 'eslint-plugin-import';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
});

export default [
  js.configs.recommended,
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
      '@typescript-eslint/no-unused-vars': 'off',         
      '@typescript-eslint/no-floating-promises': 'off',   
      '@typescript-eslint/no-unsafe-argument': 'off',     
    },
    overrides: [
      {
        files: ['test/**/*.ts', 'test/**/*.spec.ts'],
        rules: {
          '@typescript-eslint/no-floating-promises': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
          '@typescript-eslint/no-unsafe-argument': 'off',
        },
      },
    ],
  },
];
