/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    setupFilesAfterEnv: ['./test/jest.setup.ts'],
};

module.exports = config;
