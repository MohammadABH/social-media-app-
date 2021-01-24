const { gql } = require('apollo-server');

module.exports = gql`
    type Post{
        id: ID!,
        body: String!,
        createdAt: String!,
        username: String!
    }

    type User{
        username: String!,
        password: String!,
        email: String!,
        createdAt: String!
    }

    type Query{
        getPosts: [Post],
        getUsers: [User]
    }
`;