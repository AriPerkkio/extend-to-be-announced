import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/**.test.*'],
        environment: 'jsdom',
        reporters: 'verbose',
        setupFiles: ['./test/setup.ts'],
    },
});
