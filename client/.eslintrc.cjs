module.exports = {
  env: { browser: true, es2022: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  globals: { React: true },
  rules: { 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] }
};
