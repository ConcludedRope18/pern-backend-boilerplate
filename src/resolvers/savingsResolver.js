const myDataSource = require("../config/database");
const savingsRepo = myDataSource.getRepository("Savings");

const savingsResolver = {
  Query: {
    getSavings: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      return await savingsRepo.find({
        where: { user: { id: user.id } },
        relations: ["user", "savingsBudgetLinks"],
      });
    },
  },

  Mutation: {
    createSavings: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const savings = savingsRepo.create({
        name: input.name,
        target: input.target,
        deadline: new Date(input.deadline),
        saved: input.saved ?? 0,
        user: { id: user.id },
      });

      return await savingsRepo.save(savings);
    },

    updateSavings: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await savingsRepo.findOne({
        where: { id: input.id, user: { id: user.id } },
        relations: ["user"],
      });

      if (!existing) throw new Error("Savings goal not found");

      if (input.name !== undefined) existing.name = input.name;
      if (input.target !== undefined) existing.target = input.target;
      if (input.deadline !== undefined)
        existing.deadline = new Date(input.deadline);
      if (input.saved !== undefined) existing.saved = input.saved;

      return await savingsRepo.save(existing);
    },

    deleteSavings: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const result = await savingsRepo.delete({ id, user: { id: user.id } });
      return result.affected === 1;
    },
  },
};

module.exports = savingsResolver;
