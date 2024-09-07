const typeDefs = /* GraphQL */`
  type  Book{
    _id: ID!
    authors: [String]
    description: String
    bookID: String
    title: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }


  type Auth{
    token:ID!
    user:User
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: [String], description: String, bookId: String, title: String ): User
    removeBook(bookId: String!): User
`;

module.exports = typeDefs;
