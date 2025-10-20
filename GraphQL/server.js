import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';
import z from 'zod'; 
const server = express();

const Data = "";

async function schemaInjection(url) {
   try{
     const response = await axios.get(url);

     if(response.status === 200){
       const jsonData = response.data;
       const schemaData = await schemaBuilder(jsonData);
        return ` ${schemaData}`;
     }

    
   }catch(ERR){
    console.error('Error trigered in GS>SER:schemaInjection:', ERR);
   }
  

  // Simulate fetching and building schema from the URL
 
}

async function schemaBuilder(jsonData) { 
   // iterate fetched json Data 
 }


function schemaSetter(url) {
  const schema = buildSchema(`
  type Query {
    hello: String
  }
  
  type Mutation {
    getSchema(url: String!): String
    getFullData(jsonSchema: JSON!, url: String!): JSON!
  }
  ${schemaInjection(url)}
`);
  return schema
}

const getSchemaVal = z.object({
  url: z.url(),
});

const getFullDataVal = z.object({
  jsonSchema: z.json(),
  url: z.url(),
});


async function queryVal_url(req,res,next){
  const body = req.body;
  const valGetSchema = getSchemaVal.safeParse(body);

  if(!valGetSchema.success){
    return res.status(400).json({error: valGetSchema.error.errors});

  }

  next();
};


server.use('/graphql/url',queryVal_url,graphqlHTTP({
  schema: schemaSetter(req.body.url),
  rootValue: {},
  graphiql: true, // Enable GraphiQL UI
}));


function queryVal_OriginalData(req,res,next){
  const body = req.body;
  const valGetFullData = getFullDataVal.safeParse(body);
  if(!valGetFullData.success){  
    return res.status(400).json({error: valGetFullData.error.errors});
  }
}
server.use('/graphql/originalData', queryVal_OriginalData,graphqlHTTP({
  schema: schemaSetter(req.body.url),
  rootValue: {},
  graphiql: true,
}));

// Server is listening on port 4000
server.listen(4000, () => {
  console.log('GraphQL server running at http://localhost:4000/graphql');
});
