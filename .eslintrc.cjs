/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        // "eslint:recommended",
        '@vue/eslint-config-typescript',
        // "@vue/eslint-config-prettier",
    ],
    env: {
        node: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        // semi: ['error', 'always'],
        'no-unused-vars': ['off'],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        'prefer-spread': ['off'],
    },
}
