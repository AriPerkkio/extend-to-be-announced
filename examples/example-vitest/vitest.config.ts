import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        reporters: 'verbose',
        setupFiles: ['./setup.ts'],
    },
});
