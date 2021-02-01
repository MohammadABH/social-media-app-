const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts() {
            try {
				const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (e) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);

                if (post) {
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            // User will login and get authentication token
            // Place the authentication token in authorization header
            // Send the header with the request
            // Get the token and decode it, and get the information from it
            // Make sure the user is authenticated 
            // Then create the post
			const user = checkAuth(context);
			
			if(body.trim() === '') {
				throw new Error('Post body must not be empty');
			}
            // checkAuth throws errors if anything is invalid about the user, so user is now valid here
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

			const post = await newPost.save();
			
			context.pubsub.publish('NEW_POST', {
				newPost: post
			});

            return post;
            
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if(!post) {
                throw new Error('Post does not exists!');
            }

            try {
                if(post.username === user.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    // not your post
                    throw new AuthenticationError('Action not allowed!');
                }
            } catch (err) {
                throw new Error(err);
            }
		},
		async likePost(_, { postId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if(post) {
				const likeIndex = post.likes.findIndex(el => el.username === username);
				if(likeIndex !== -1) {
					post.likes.splice(likeIndex, 1);
				} else {
					post.likes.unshift({
						username,
						createdAt: new Date().toISOString()
					});
				}
				await post.save();
				return post;
			} else {
				throw new UserInputError('Post not found')
			}
		}
	},
	Subscription: {
		newPost: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
		}
	}
}