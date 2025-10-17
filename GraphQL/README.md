# ViewHub GraphQL API

A powerful GraphQL API with dynamic schema capabilities for data preview, modification, filtering, and merging.

## Features

- **Dynamic Schema Generation**: Automatically generate GraphQL schemas from various data sources
- **Data Preview**: Preview data with pagination and field information
- **Data Modification**: Full CRUD operations with bulk updates
- **Advanced Filtering**: Complex filtering with multiple operators
- **Data Merging**: Join data from multiple sources with user-selected fields
- **Real-time Updates**: WebSocket subscriptions for data changes
- **Schema Management**: Dynamic schema updates and field management

## Supported Data Sources

- REST APIs
- Databases (PostgreSQL, MySQL, MongoDB, etc.)
- Files (JSON, CSV, XML)
- GraphQL endpoints
- OpenAPI specifications

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open GraphQL Playground:
```
http://localhost:4000/graphql
```

## API Examples

### Create a Data Source
```graphql
mutation {
  createDataSource(input: {
    name: "Users API"
    type: REST_API
    connection: {
      baseUrl: "https://api.example.com"
      endpoint: "/users"
      method: "GET"
    }
  }) {
    id
    name
    type
    createdAt
  }
}
```

### Preview Data
```graphql
query {
  previewData(sourceId: "users-api", limit: 5) {
    totalCount
    hasMore
    data
    fields {
      name
      type
      nullable
      description
    }
  }
}
```

### Filter Data
```graphql
query {
  getData(
    sourceId: "users-api"
    filters: [
      {
        field: "age"
        operator: GTE
        value: 25
      }
    ]
    limit: 10
  ) {
    totalCount
    data {
      id
      data
    }
  }
}
```

### Merge Data from Multiple Sources
```graphql
query {
  mergeData(
    sourceIds: ["users-api", "orders-api"]
    mergeFields: [
      {
        sourceId: "users-api"
        field: "id"
        alias: "userId"
      }
      {
        sourceId: "orders-api"
        field: "userId"
        alias: "userId"
      }
    ]
    mergeType: INNER
  ) {
    totalCount
    data {
      id
      data
    }
  }
}
```

### Subscribe to Data Changes
```graphql
subscription {
  dataChanged(sourceId: "users-api") {
    type
    recordId
    data
    timestamp
  }
}
```

## Configuration

The API can be configured through environment variables:

- `PORT`: Server port (default: 4000)
- `HOST`: Server host (default: localhost)
- `CORS_ORIGIN`: CORS origin (default: *)

## Development

### Project Structure
```
GraphQL/
├── server.js              # Main server file
├── config.js              # Configuration
├── schema/
│   └── index.js           # GraphQL schema definitions
├── resolvers/
│   ├── index.js           # Main resolvers
│   ├── dataSource.js      # Data source management
│   ├── dataPreview.js     # Data preview operations
│   ├── dataModification.js # CRUD operations
│   ├── filter.js          # Filtering operations
│   ├── merge.js           # Data merging
│   └── schema.js          # Schema management
└── utils/
    ├── dataSourceManager.js # Data source utilities
    └── schemaManager.js     # Schema utilities
```

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with hot reload
- `npm test`: Run tests (coming soon)

## License

ISC
