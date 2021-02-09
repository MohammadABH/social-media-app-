const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const getToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Query: {
    async getUsers() {
      try {
        const posts = await User.find();
        return posts;
      } catch (e) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      // Validate input
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // See if username already exists
      const user = await User.findOne({ username });

      // Handle duplicate username
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12); // Hash the password

      // Create the user
      const newUser = new User({
        username,
        password,
        email,
        createdAt: new Date().toISOString(),
      });

      // Save the user to the DB
      const res = await newUser.save();
      // Return token to user
      const token = getToken(res);
      console.log(token);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Incorrect credentials", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Incorrect credentials";
        throw new UserInputError("Incorrect credentials", { errors });
	  }
	  
	  const token = getToken(user);
    console.log(token);
	  return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  },
};
