import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // TODO remove
        include: ['test/**.test.*'],
        environment: 'jsdom',
        reporters: 'verbose',
        setupFiles: ['./test/setup.ts'],
    },
});
