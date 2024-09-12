const { User } = require('../models')
const { signToken, AuthenticationError } = require("../utils/auth")

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {

                return User.findOne({ _id: context.user._id }).select('-__v -password')
            }
            throw AuthenticationError
        },

    },
    Mutation: {
        signup: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {

                const user = await User.findOneAndUpdate({ _id: context.user._id },
                    { $push: { savedBooks: args } },
                    { new: true }
                );
                return user;
            }
            throw AuthenticationError
        },
        removeBook: async (parent, { bookId },context) => {
            if (context.user) {

                const user = await User.findOneAndUpdate({ _id: context.user._id },
                    { $pull: { savedBooks: arg } },
                    { new: true }
                );
                return user;
            }
            throw AuthenticationError

        }
    }
}

module.exports = resolvers;