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
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/no-empty-object-type': 'warn',
         '@typescript-eslint/no-namespace': 'warn',
         'react/no-unescaped-entities': 'warn',
         'react/prop-types': 'off',
         'react/no-unstable-nested-components': 'warn',
         'no-empty-pattern': 'warn',
         'no-useless-escape': 'warn',
         'react-hooks/static-components': 'off',
         'react-hooks/set-state-in-effect': 'off',
         'react-hooks/rules-of-hooks': 'off',
         '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
         ],
      },
      settings: {
         react: {
            version: 'detect',
         },
      },
   }
);
