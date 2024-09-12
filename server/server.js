const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Define your schema for GraphQL
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define your root resolver for Express GraphQL
const root = {
  hello: () => 'Hello world!'
};

// Middleware to handle GraphQL requests for Express
app.use('/graphql', graphqlHTTP({
  schema: typeDefs,
  rootValue: root,
  graphiql: true // Enable GraphiQL IDE
}));

// Uncomment the following code once you have built the queries and mutations in the client folder
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Middleware for Apollo Server
  app.use('/graphql', expressMiddleware(server));

  // Serve static files if needed
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the Apollo Server
startApolloServer();