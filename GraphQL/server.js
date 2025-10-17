import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import { DataSourceManager } from './utils/dataSourceManager.js';
import { SchemaManager } from './utils/schemaManager.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize managers
const dataSourceManager = new DataSourceManager();
const schemaManager = new SchemaManager();

// Create Apollo Server with dynamic schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    dataSourceManager,
    schemaManager,
    user: req.headers.authorization ? { id: 'user-123' } : null
  }),
  introspection: true,
  playground: true
});

async function startServer() {
  await server.start();
  
  app.use('/graphql', 
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        dataSourceManager,
        schemaManager,
        user: req.headers.authorization ? { id: 'user-123' } : null
      })
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Server running at http://localhost:${PORT}/graphql`);
    console.log(`📊 ViewHub API with dynamic schema capabilities`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
