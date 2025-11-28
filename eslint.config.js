import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
   {
      ignores: [
         'dist',
         'build',
         'node_modules',
         'coverage',
         'playwright-report',
      ],
   },
   {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
      },
      plugins: {
         react: reactPlugin,
         'react-hooks': reactHooksPlugin,
      },
      rules: {
         ...reactPlugin.configs.recommended.rules,
         ...reactHooksPlugin.configs.recommended.rules,
         'react/react-in-jsx-scope': 'off', // Not needed for React 17+
      },
      settings: {
         react: {
            version: 'detect',
         },
      },
   }
);
