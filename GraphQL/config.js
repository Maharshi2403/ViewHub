// GraphQL Configuration
export const config = {
  server: {
    port: process.env.PORT || 4000,
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }
  },
  
  apollo: {
    introspection: true,
    playground: true,
    tracing: true,
    cacheControl: {
      defaultMaxAge: 300
    }
  },
  
  dataSources: {
    cache: {
      ttl: 300000, // 5 minutes
      maxSize: 1000
    },
    limits: {
      maxRecordsPerQuery: 10000,
      maxFieldsPerSchema: 1000,
      maxRelationshipsPerSchema: 100
    }
  },
  
  features: {
    realTimeUpdates: true,
    schemaValidation: true,
    dataFiltering: true,
    dataMerging: true,
    bulkOperations: true,
    aggregation: true
  },
  
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // limit each IP to 1000 requests per windowMs
    },
    queryComplexity: {
      maxDepth: 10,
      maxComplexity: 1000
    }
  }
};
