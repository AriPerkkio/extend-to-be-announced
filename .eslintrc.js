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
        'plugin:testing-library/dom',
        'plugin:jest-dom/recommended',
    ],
    rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
    overrides: [
        {
            files: ['*.test.ts*'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'off',
            },
        },
    ],
};
