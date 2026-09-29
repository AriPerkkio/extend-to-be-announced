import { defineConfig } from 'oxfmt';

export default defineConfig({
    singleQuote: true,
    tabWidth: 4,
    ignorePatterns: ['dist/**', 'node_modules/**', 'CHANGELOG.md'],
});
