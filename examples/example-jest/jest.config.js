/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./setup.ts'],
    transformIgnorePatterns: ['/node_modules/.pnpm/(?!(aria-live-capture)@)'],
};
