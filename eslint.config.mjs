import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.jasmine,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
        },
    },
    {
        files: ['*.test.ts*'],
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    { ignores: ['dist'] },
    eslintPluginPrettierRecommended,
]);

/** @param config {import('eslint').Linter.FlatConfig} */
function defineConfig(config) {
    return config;
}
