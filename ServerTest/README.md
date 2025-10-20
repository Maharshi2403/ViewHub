# ViewHub GraphQL Server Schema Validation Test Suite

This directory contains focused test cases for validating the GraphQL schema structure of the ViewHub API platform.

## Overview

The test suite focuses on:
- **Schema Validation**: GraphQL schema structure and type validation
- **Schema Introspection**: Testing GraphQL introspection capabilities
- **Type Definitions**: Validating all core types, enums, and scalars
- **Schema Completeness**: Ensuring all required types are present
- **Type Relationships**: Validating proper type relationships and references

## Test Structure

```
ServerTest/
├── package.json              # Test dependencies and configuration
├── testUtils.js              # Test utilities and helpers
├── testRunner.js             # Test execution script
├── README.md                 # This file
└── tests/
    ├── schemaValidation.test.js     # Schema structure validation tests
    └── externalApiSchema.test.js    # External API schema generation tests
```

## Prerequisites

1. **Server Running**: The GraphQL server must be running at `http://localhost:4000/graphql`
2. **Node.js**: Version 16 or higher
3. **Dependencies**: Test dependencies will be installed automatically

## Quick Start

### 1. Start the GraphQL Server
```bash
cd ../GraphQL
npm start
```

### 2. Run Tests
```bash
cd ServerTest
npm test
```

### 3. Run Specific Test Categories
```bash
# Run schema validation tests only
npm run test:schema

# Run external API schema generation tests
npm run test:external

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Categories

### Schema Validation (`schemaValidation.test.js`)
- ✅ **Schema Introspection**: GraphQL introspection query validation
- ✅ **Query Type Structure**: Validates Query type has all required fields
- ✅ **Mutation Type Structure**: Validates Mutation type has all required fields  
- ✅ **Subscription Type Structure**: Validates Subscription type has all required fields
- ✅ **Core Type Definitions**: Validates DataSource, SchemaInfo, FieldInfo, DataPreview, DataResult types
- ✅ **Enum Type Definitions**: Validates all enum types (DataSourceType, FieldType, etc.)
- ✅ **Scalar Type Definitions**: Validates JSON and Date scalar types
- ✅ **Input Type Definitions**: Validates CreateDataSourceInput, UpdateDataSourceInput, Filter inputs
- ✅ **Schema Completeness**: Ensures all essential types are present
- ✅ **Type Relationships**: Validates proper type relationships and references

### External API Schema Generation (`externalApiSchema.test.js`)
- ✅ **Real API Integration**: Tests with actual [Hugging Face Models API](https://huggingface.co/api/models)
- ✅ **Data Structure Analysis**: Validates API response structure and field types
- ✅ **Dynamic Data Source Creation**: Creates data sources for external APIs
- ✅ **Data Preview**: Tests previewing data from external API sources
- ✅ **Schema Introspection**: Validates schema generation for external data
- ✅ **Filter Operations**: Tests filtering external API data
- ✅ **Schema Adaptation**: Validates handling of different API response structures
- ✅ **Nested Data Handling**: Tests complex nested data structures from APIs

## Test Utilities

The `testUtils.js` file provides:

### Configuration
- `TEST_CONFIG`: Test configuration constants
- Server URL and timeout settings

### Mock Data Factories
- `createMockDataSource()`: Generate test data sources
- `createMockRecord()`: Generate test records
- `createMockFilter()`: Generate test filters

### GraphQL Helpers
- `buildGraphQLQuery()`: Build query requests
- `buildGraphQLMutation()`: Build mutation requests

### Utility Functions
- `waitForServer()`: Wait for server to be ready
- `cleanupTestData()`: Clean up test data

## Running Tests

### Using npm scripts:
```bash
npm test                    # Run all tests
npm run test:watch         # Run in watch mode
npm run test:coverage      # Generate coverage report
npm run test:integration   # Run integration tests only
npm run test:unit          # Run unit tests only
```

### Using the test runner:
```bash
node testRunner.js          # Run all tests with detailed output
node testRunner.js --coverage  # Run with coverage
node testRunner.js --watch     # Run in watch mode
```

## Test Data

Tests use mock data that doesn't interfere with production data:
- Test data sources are created with prefixed IDs
- All test operations are isolated
- Cleanup functions ensure no test data persists

## Expected Results

### Successful Test Run
- ✅ All test suites pass
- ✅ Server responds correctly to all queries
- ✅ Schema validation passes
- ✅ Error handling works as expected
- ✅ Performance meets requirements

### Common Issues

1. **Server Not Running**
   ```
   Error: Server not ready after 30000ms
   ```
   **Solution**: Start the GraphQL server first

2. **Connection Refused**
   ```
   Error: fetch failed
   ```
   **Solution**: Check server URL and port configuration

3. **Test Timeouts**
   ```
   Error: Timeout exceeded
   ```
   **Solution**: Increase timeout in test configuration

## Configuration

### Environment Variables
- `TEST_SERVER_URL`: Override default server URL
- `TEST_TIMEOUT`: Override default timeout
- `NODE_ENV`: Set to 'test' for test environment

### Jest Configuration
Located in `package.json`:
- Test environment: Node.js
- Coverage collection settings
- Test file patterns
- Timeout settings

## Contributing

When adding new tests:

1. **Follow naming conventions**: `*.test.js` for test files
2. **Use descriptive test names**: Clear, specific test descriptions
3. **Include error cases**: Test both success and failure scenarios
4. **Mock external dependencies**: Use test utilities for consistent data
5. **Add cleanup**: Ensure tests don't leave residual data

## Troubleshooting

### Tests Failing
1. Ensure server is running
2. Check server logs for errors
3. Verify test data doesn't conflict
4. Check network connectivity

### Performance Issues
1. Increase timeout values
2. Check server performance
3. Reduce concurrent test load
4. Monitor system resources

### Schema Validation Failures
1. Verify GraphQL schema is up to date
2. Check for breaking changes
3. Update test expectations
4. Validate schema syntax

## Support

For issues with the test suite:
1. Check this README
2. Review test output and logs
3. Verify server configuration
4. Check GraphQL server status
