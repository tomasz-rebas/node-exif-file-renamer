module.exports = {
  preset: "ts-jest", // Use ts-jest preset to compile TypeScript
  testEnvironment: "node", // Set the test environment (Node.js for backend testing)
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Handle TypeScript files (both .ts and .tsx)
  },
};
