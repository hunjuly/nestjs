import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    roots: ['<rootDir>/src/'],
    testRegex: '.*\\.(spec|test)\\.ts$',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['__tests__'],
    coverageDirectory: './coverage'
}

export default config
