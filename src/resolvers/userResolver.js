const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../entities/Users");
const myDataSource = require("../config/database");
const { getUserBalance } = require("../utils/balanceUtils");


const userRepository = myDataSource.getRepository("User");

const SECRET = process.env.JWT_SECRET;

const userResolver = {
  Query: {
    getCurrentUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await userRepository.findOneBy({ id: user.id });
    },

    getBalance: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await getUserBalance(user.id);
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      const { name, email, password } = input;

      const existing = await userRepository.findOneBy({ email });
      if (existing) throw new Error("User already exists");

      const hashed = await bcrypt.hash(password, 10);
      const user = userRepository.create({ name, email, password: hashed });
      await userRepository.save(user);

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

      return { user, token };
    },

    login: async (_, { input }) => {
      const { email, password } = input;

      const user = await userRepository.findOneBy({ email });
      if (!user) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

      return { user, token };
    },

    updateUser: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await userRepository.findOneBy({ id: user.id });
      if (!existing) throw new Error("User not found");

      const updates = { ...input };
      if (input.password) {
        updates.password = await bcrypt.hash(input.password, 10);
      }

      Object.assign(existing, updates);
      return await userRepository.save(existing);
    },

    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const result = await userRepository.delete({ id: user.id });
      return result.affected === 1;
    },
  },
};

module.exports = userResolver;
