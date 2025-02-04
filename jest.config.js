module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  }
};

