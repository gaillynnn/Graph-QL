const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const {typeDefs, resolvers}= require('./schemas')
const app = express();
const PORT = process.env.PORT || 3000;

// Define your schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define your root resolver
const root = {
  hello: () => 'Hello world!'
};

// Middleware to handle GraphQL requests
app.use('/graphql', graphqlHTTP({
  schema: typeDefs, 
  rootValue: resolvers,
  graphiql: true // Enable GraphiQL IDE
}));

// Serve static files if needed
app.use(express.static('public'));

// Catch-all route to handle static file requests or custom 404
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
