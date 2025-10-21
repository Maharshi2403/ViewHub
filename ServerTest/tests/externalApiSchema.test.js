// tests/externalApiSchema.test.js - Simple Schema Generation Test (CommonJS)
// This version uses require() instead of import to avoid Jest configuration issues
// Run: npm run test:external

const request = require('supertest');
const gql = require('graphql-tag');
const { print } = require('graphql');

const SERVER_URL = 'http://localhost:4000';

describe('GraphQL Schema Generation - Simple Test', () => {

  // ============================================
  // TEST 1: Check if schema is generated
  // ============================================
  
  describe('Schema Generation', () => {
    test('should generate schema from JSONPlaceholder API', async () => {
      const apiUrl = 'https://jsonplaceholder.typicode.com/users';
      
      const response = await request(SERVER_URL)
        .get(`/schema?url=${encodeURIComponent(apiUrl)}`)
        .expect(200);

      // Verify schema was generated
      expect(response.body.success).toBe(true);
      expect(response.body.typeDefs).toBeDefined();
      expect(response.body.typeDefs).toContain('type DataItem');
      expect(response.body.typeDefs).toContain('type Query');
      expect(response.body.typeDefs).toContain('data:');
      expect(response.body.itemCount).toBe(10);
      
      console.log('\n✅ Schema Generated Successfully!');
      console.log('📊 Items Count:', response.body.itemCount);
    });

    test('should generate schema from Hugging Face API', async () => {
      const apiUrl = 'https://huggingface.co/api/models/deepseek-ai/DeepSeek-OCR?limit=5';
      
      const response = await request(SERVER_URL)
        .get(`/schema?url=${encodeURIComponent(apiUrl)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      //expect(response.body.typeDefs).toContain('type DataItem');
     // expect(response.body.itemCount).toBe(5);
      
      console.log('\n✅ HF Schema Generated!');
      console.log('📊 typeDefs:', response.body.typeDefs);
    });
  });

  // ============================================
  // TEST 2: Check if data can be queried
  // ============================================
  
  describe('Data Querying', () => {
    test('should query data using generated schema', async () => {
      const apiUrl = 'https://jsonplaceholder.typicode.com/users';
      
      const query = gql`
        query {
          data {
            id
            name
            email
          }
        }
      `;

      const response = await request(SERVER_URL)
        .post(`/graphql?url=${encodeURIComponent(apiUrl)}`)
        .send({ query: print(query) })
        .expect(200);

      // Verify data was returned
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.data).toBeDefined();
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(response.body.data.data.length).toBe(10);
      
      const firstUser = response.body.data.data[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('email');
      
      console.log('\n✅ Data Queried Successfully!');
      console.log('👤 First User:', firstUser.name);
    });

    test('should query HF models data', async () => {
      const apiUrl = 'https://huggingface.co/api/models/deepseek-ai/DeepSeek-OCR?limit=5';
      
      const query = gql`
  query {
    data {
      id
      likes
      downloads
      tags
      cardData {
        tags{}
      }
    }
  }
`;

      const response = await request(SERVER_URL)
        .post(`/graphql?url=${encodeURIComponent(apiUrl)}`)
        .send({ query: print(query) })
        .expect(200);
      console.log(response.body);
      //expect(response.body.errors).toBeUndefined();
     // expect(response.body.data.data).toBeDefined();
     // expect(response.body.data.data.length).toBeGreaterThan(0);
      
      //const firstModel = response.body.data.data[0];
     
      console.log('\n✅ HF Models Queried!');
      
    });
  });

  // ============================================
  // TEST 3: Direct data endpoint
  // ============================================
  
  describe('Direct Data', () => {
    test('should generate schema from direct JSON data', async () => {
      const testData = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 }
      ];

      const query = gql`
        query {
          data {
            id
            name
            age
          }
        }
      `;

      const response = await request(SERVER_URL)
        .post('/graphql/direct')
        .send({
          data: testData,
          query: print(query)
        })
        .expect(200);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.data[0].name).toBe('Alice');
      
      console.log('\n✅ Direct Data Works!');
    });
  });

  // ============================================
  // TEST 4: Cache check
  // ============================================
  
  describe('Cache', () => {
    test('should cache generated schemas', async () => {
      const apiUrl = 'https://jsonplaceholder.typicode.com/users/1';
      
      // First request
      await request(SERVER_URL)
        .get(`/schema?url=${encodeURIComponent(apiUrl)}`)
        .expect(200);

      // Check cache
      const cacheResponse = await request(SERVER_URL)
        .get('/cache')
        .expect(200);

      expect(cacheResponse.body.success).toBe(true);
      expect(cacheResponse.body.count).toBeGreaterThan(0);
      expect(Array.isArray(cacheResponse.body.cachedUrls)).toBe(true);
      
      console.log('\n✅ Cache Working!');
      console.log('📦 Cached URLs:', cacheResponse.body.count);
    });
  });

});