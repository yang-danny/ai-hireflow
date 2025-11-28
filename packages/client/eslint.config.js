import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
   { ignores: ['dist', 'build', '.react-router'] },
   {
      extends: [
         js.configs.recommended,
         ...tseslint.configs.recommended,
         jsxA11y.flatConfigs.recommended,
      ],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
      },
      plugins: {
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
         'jsx-a11y': jsxA11y,
      },
      rules: {
         ...reactHooks.configs.recommended.rules,
         'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
         ],
         // Accessibility rules
         'jsx-a11y/alt-text': 'error',
         'jsx-a11y/anchor-has-content': 'error',
         'jsx-a11y/aria-props': 'error',
         'jsx-a11y/aria-proptypes': 'error',
         'jsx-a11y/aria-unsupported-elements': 'error',
         'jsx-a11y/click-events-have-key-events': 'warn',
         'jsx-a11y/heading-has-content': 'error',
         'jsx-a11y/html-has-lang': 'error',
         'jsx-a11y/img-redundant-alt': 'warn',
         'jsx-a11y/interactive-supports-focus': 'warn',
         'jsx-a11y/label-has-associated-control': 'warn',
         'jsx-a11y/no-noninteractive-element-interactions': 'warn',
         'jsx-a11y/role-has-required-aria-props': 'error',
      },
   }
);
