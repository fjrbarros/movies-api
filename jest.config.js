module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/server.ts",
    "!src/models/**",
    "!src/database/**",
    "!src/repository/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text", "lcov"],
};
