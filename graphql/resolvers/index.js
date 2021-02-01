const postResolvers = require('./posts');
const usersResolvers = require('./users');


module.exports = {
    Query: {
        ...postResolvers.Query,
        ...usersResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postResolvers.Mutation
	}
};