const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js')

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose
    .connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
        return server.listen({ port: 50000 });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    }).catch(() => {
		console.log('Error connecting to MongoDB')
    });