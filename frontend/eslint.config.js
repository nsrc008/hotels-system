// eslint.config.js
import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import jestPlugin from 'eslint-plugin-jest';

export default [
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        jest: true,
      },
      parser: typescriptParser,
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': typescriptPlugin,
      jest: jestPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...typescriptPlugin.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
      '@typescript-eslint/no-require-imports': 'error',
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['jest.setup.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Excepción confirmada
    },
  },
];