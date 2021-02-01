const postResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');


module.exports = {
    Query: {
        ...postResolvers.Query,
        ...usersResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postResolvers.Mutation,
		...commentsResolvers.Mutation
	}
};