const User = require('../../models/User');

module.exports = {
    Query: {
        async getUsers() {
            try {
                const posts = await User.find();
                return posts;
            } catch (e) {
                throw new Error(err);
            }
        }
    }
}