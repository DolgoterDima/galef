import html from '@html-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.html'],
    plugins: { '@html-eslint': html },
    languageOptions: {
      parser: html.parser,
    },
    rules: {
      '@html-eslint/no-extra-spacing-attrs': 'error',
    },
  },
];
