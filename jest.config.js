export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    transform: {
      '^.+\\.svelte$': 'svelte-jester',
      '^.+\\.ts$': 'ts-jest',
      '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'ts', 'svelte'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    testEnvironment: 'jsdom',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    }
  };
  