// eslint.config.js
import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import jestPlugin from 'eslint-plugin-jest';

export default [
  // Configuración base para todos los archivos
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true, // Para global y require (si se usa)
        jest: true, // Para describe, it, expect
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
  // Configuración específica para archivos de prueba
  {
    files: ['**/__tests__/**', '*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        jest: true, // Refuerza el entorno Jest para pruebas
      },
    },
    rules: {
      // Puedes agregar reglas específicas para pruebas si es necesario
    },
  },
  // Configuración específica para jest.setup.ts (opcional si usas require)
  {
    files: ['jest.setup.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Solo si mantienes require()
    },
  },
];