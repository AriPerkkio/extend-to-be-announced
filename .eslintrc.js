/** @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        jasmine: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
    },
    overrides: [
        {
            files: ['*.test.ts*'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'off',
            },
        },
    ],
    ignorePatterns: ['dist'],
};
