import { defineConfig } from 'oxlint';

export default defineConfig({
    plugins: ['typescript', 'unicorn'],
    ignorePatterns: ['dist/**', 'node_modules/**'],
});
