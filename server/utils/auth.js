const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql'); // Correctly import GraphQLError

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret);
      req.user = data;
    } catch (err) {
      console.log('Invalid token', err);
      // Optionally, set an error response or status
      req.user = null; // Or handle it in a way that fits your application
    }

    return req;
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};