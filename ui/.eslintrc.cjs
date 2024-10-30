/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/airbnb',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', 120],
    'vue/max-len': ['error', 120],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'vue/no-template-target-blank': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/interactive-supports-focus': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/role-has-required-aria-props': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    'no-unused-vars': 'off', // The base rule must be disabled as it can report incorrect errors
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
