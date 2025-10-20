// Test configuration and utilities
export const TEST_CONFIG = {
  GRAPHQL_ENDPOINT: 'http://localhost:4000/graphql',
  SERVER_PORT: 4000,
  TIMEOUT: 10000
};

// Test data factories
export const createMockDataSource = (overrides = {}) => ({
  id: 'test-source-1',
  name: 'Test Data Source',
  type: 'REST_API',
  connection: {
    url: 'https://api.example.com',
    headers: {
      'Authorization': 'Bearer test-token'
    }
  },
  schema: {
    fields: [
      { name: 'id', type: 'ID', nullable: false },
      { name: 'name', type: 'STRING', nullable: true },
      { name: 'email', type: 'STRING', nullable: true }
    ]
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  ...overrides
});

export const createMockRecord = (overrides = {}) => ({
  id: 'test-record-1',
  data: {
    name: 'Test User',
    email: 'test@example.com',
    age: 25
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  ...overrides
});

export const createMockFilter = (overrides = {}) => ({
  field: 'name',
  operator: 'CONTAINS',
  value: 'test',
  logic: 'AND',
  ...overrides
});

// GraphQL query builders
export const buildGraphQLQuery = (query, variables = {}) => ({
  query,
  variables
});

export const buildGraphQLMutation = (mutation, variables = {}) => ({
  mutation,
  variables
});

// Test helpers
export const waitForServer = async (url, timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Server not ready after ${timeout}ms`);
};

export const cleanupTestData = async () => {
  // Cleanup function for test data
  // This would be implemented based on your data cleanup needs
  console.log('Cleaning up test data...');
};
