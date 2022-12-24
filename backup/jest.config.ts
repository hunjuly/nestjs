import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: './coverage'
}

export default config
