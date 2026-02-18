export default {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    moduleFileExtensions: ['js'],
    testMatch: ['<rootDir>/tests/jest/*.test.js'],
    collectCoverageFrom: [
        'assets/js/**/*.js',
        'scripts/**/*.js',
        '!**/node_modules/**'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/jest/setup.js']
};