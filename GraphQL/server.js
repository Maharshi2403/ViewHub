// server.js - Dynamic GraphQL Schema Generator from JSON APIs


import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import axios from 'axios';
import { z } from 'zod';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Global schema cache
const schemaCache = new Map();

// ============================================
// SCHEMA BUILDER
// ============================================

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[^a-zA-Z0-9]/g, '');
}

function inferGraphQLType(value) {
  if (value === null || value === undefined) return 'String';
  if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Float';
  if (typeof value === 'boolean') return 'Boolean';
  return 'String';
}

function generateTypeFromObject(obj, typeName, generatedTypes = new Set()) {
  if (generatedTypes.has(typeName)) return '';
  generatedTypes.add(typeName);

  let typeDef = `type ${typeName} {\n`;
  let nestedTypeDefs = '';

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
    
    if (value === null || value === undefined) {
      typeDef += `  ${sanitizedKey}: String\n`;
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
          const nestedTypeName = `${typeName}_${capitalize(sanitizedKey)}`;
          typeDef += `  ${sanitizedKey}: [${nestedTypeName}]\n`;
          nestedTypeDefs += generateTypeFromObject(firstItem, nestedTypeName, generatedTypes);
        } else {
          const scalarType = inferGraphQLType(firstItem);
          typeDef += `  ${sanitizedKey}: [${scalarType}]\n`;
        }
      } else {
        typeDef += `  ${sanitizedKey}: [String]\n`;
      }
    } else if (typeof value === 'object') {
      const nestedTypeName = `${typeName}_${capitalize(sanitizedKey)}`;
      typeDef += `  ${sanitizedKey}: ${nestedTypeName}\n`;
      nestedTypeDefs += generateTypeFromObject(value, nestedTypeName, generatedTypes);
    } else {
      const gqlType = inferGraphQLType(value);
      typeDef += `  ${sanitizedKey}: ${gqlType}\n`;
    }
  }

  typeDef += '}\n\n';
  return nestedTypeDefs + typeDef;
}

async function schemaBuilder(jsonData) {
  const generatedTypes = new Set();

  if (Array.isArray(jsonData)) {
    if (jsonData.length === 0) {
      throw new Error('Cannot generate schema from empty array');
    }
    const types = generateTypeFromObject(jsonData[0], 'DataItem', generatedTypes);
    console.log('Generated Types:\n', types);
    return { types, rootType: '[DataItem]', isArray: true };
  } else if (typeof jsonData === 'object' && jsonData !== null) {
    console.log('JSON Data is an object, generating single root type.');
    const types = generateTypeFromObject(jsonData, 'DataRoot', generatedTypes);
    console.log('Generated Types:\n', types);
    return { types, rootType: 'DataRoot', isArray: false };
  } else {
    throw new Error('Invalid JSON data: must be object or array');
  }
}

// ============================================
// SCHEMA INJECTION
// ============================================

async function schemaInjection(url) {
  try {
    if (schemaCache.has(url)) {
      console.log(`[CACHE HIT] ${url}`);
      return schemaCache.get(url);
    }

    console.log(`[FETCHING] ${url}`);
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'GraphQL-Schema-Generator/1.0' }
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}`);
    }

    const jsonData = response.data;
    const schemaInfo = await schemaBuilder(jsonData);
    
    const typeDefs = `
      ${schemaInfo.types}
      
      type Query {
        data: ${schemaInfo.rootType}
        _metadata: Metadata
      }
      
      type Metadata {
        url: String
        itemCount: Int
        generatedAt: String
      }
    `;

    const schema = buildSchema(typeDefs);
    const rootValue = {
      data: () => jsonData,
      _metadata: () => ({
        url,
        itemCount: Array.isArray(jsonData) ? jsonData.length : 1,
        generatedAt: new Date().toISOString()
      })
    };

    const result = { schema, rootValue, data: jsonData, typeDefs };
    schemaCache.set(url, result);
    
    console.log(`[SUCCESS] Schema generated for ${url}`);
    return result;
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    throw new Error(`Schema generation failed: ${err.message}`);
  }
}

// ============================================
// VALIDATION
// ============================================

const urlValidator = z.object({
  url: z.string().url('Invalid URL format')
});

const directDataValidator = z.object({
  data: z.any()
});

// ============================================
// MIDDLEWARE
// ============================================

async function validateAndInjectSchema(req, res, next) {
  try {
    const url = req.query.url || req.body?.url;
    
    if (!url) {
      return res.status(400).json({ 
        error: 'Missing URL parameter',
        usage: 'Use ?url=YOUR_API_URL'
      });
    }

    const validation = urlValidator.safeParse({ url });
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid URL',
        details: validation.error.errors 
      });
    }

    const schemaData = await schemaInjection(url);
    req.schemaData = schemaData;
    next();
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to generate schema',
      message: err.message 
    });
  }
}

// ============================================
// ROUTES
// ============================================

// Main GraphQL endpoint with URL parameter
app.all('/graphql', validateAndInjectSchema, (req, res) => {
  const handler = createHandler({
    schema: req.schemaData.schema,
    rootValue: req.schemaData.rootValue,
  });
  return handler(req, res);
});

// View generated schema
app.get('/schema', validateAndInjectSchema, (req, res) => {
  res.json({
    success: true,
    url: req.query.url,
    typeDefs: req.schemaData.typeDefs,
    itemCount: Array.isArray(req.schemaData.data) 
      ? req.schemaData.data.length 
      : 1
  });
});

// Direct data endpoint (no external fetch)
app.post('/graphql/direct', async (req, res) => {
  try {
    const validation = directDataValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid request body',
        details: validation.error.errors 
      });
    }

    const jsonData = req.body.data;
    const schemaInfo = await schemaBuilder(jsonData);
    
    const typeDefs = `
      ${schemaInfo.types}
      type Query {
        data: ${schemaInfo.rootType}
      }
    `;

    const schema = buildSchema(typeDefs);
    const rootValue = { data: () => jsonData };

    const handler = createHandler({ schema, rootValue });
    return handler(req, res);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to process data',
      message: err.message 
    });
  }
});

// Cache management
app.delete('/cache', (req, res) => {
  const url = req.query.url;
  if (url) {
    schemaCache.delete(url);
    res.json({ success: true, message: `Cache cleared for: ${url}` });
  } else {
    const count = schemaCache.size;
    schemaCache.clear();
    res.json({ success: true, message: `Cleared ${count} cached schemas` });
  }
});

app.get('/cache', (req, res) => {
  const urls = Array.from(schemaCache.keys());
  res.json({ 
    success: true, 
    cachedUrls: urls,
    count: urls.length 
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'Dynamic GraphQL Schema Generator',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      graphql: {
        path: '/graphql?url=YOUR_API_URL',
        method: 'POST',
        description: 'GraphQL endpoint with dynamic schema from URL'
      },
      schema: {
        path: '/schema?url=YOUR_API_URL',
        method: 'GET',
        description: 'View generated GraphQL schema'
      },
      direct: {
        path: '/graphql/direct',
        method: 'POST',
        description: 'GraphQL with inline data (no fetch)',
        body: { data: 'YOUR_JSON_DATA', query: 'YOUR_GRAPHQL_QUERY' }
      },
      cache: {
        view: 'GET /cache',
        clear: 'DELETE /cache?url=URL_TO_CLEAR',
        clearAll: 'DELETE /cache'
      }
    },
    examples: [
      {
        name: 'Hugging Face Models',
        url: 'https://huggingface.co/api/models?limit=5'
      },
      {
        name: 'JSONPlaceholder Users',
        url: 'https://jsonplaceholder.typicode.com/users'
      },
      {
        name: 'JSONPlaceholder Posts',
        url: 'https://jsonplaceholder.typicode.com/posts'
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: ['/', '/graphql', '/schema', '/graphql/direct', '/cache']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(` Dynamic GraphQL Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(` Server: http://localhost:${PORT}`);
  console.log(` Status: http://localhost:${PORT}/`);
});