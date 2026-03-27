/* eslint-disable */
export default {
  displayName: 'app-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleNameMapper: {
    '^@app/core$': '<rootDir>/../../libs/core/src/index.ts',
    '^@app/integration-contracts$': '<rootDir>/../../libs/integration-contracts/src/index.ts',
    '^@app/app-api$': '<rootDir>/src/main.ts'
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/apps/app-api'
};
