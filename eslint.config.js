import js from '@eslint/js';

export default [
  js.config({
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'import/no-unresolved': 'error',
    },
  }),
]; 