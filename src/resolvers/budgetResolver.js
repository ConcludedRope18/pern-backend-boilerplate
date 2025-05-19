const myDataSource = require("../config/database");
const budgetRepo = myDataSource.getRepository("Budget");
const categoryRepo = myDataSource.getRepository("Category");

const budgetResolver = {
  Query: {
    getBudgets: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await budgetRepo.find({
        where: { user: { id: user.id } },
        relations: ["category", "user"],
      });
    },
  },

  Mutation: {
    createBudget: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const category = await categoryRepo.findOneBy({ id: input.categoryId });
      if (!category) throw new Error("Category not found");

      const budget = budgetRepo.create({
        amount: input.amount,
        start_date: new Date(input.start_date),
        end_date: input.end_date ? new Date(input.end_date) : null,
        category,
        user: { id: user.id },
      });

      return await budgetRepo.save(budget);
    },

    updateBudget: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await budgetRepo.findOne({
        where: { id: input.id, user: { id: user.id } },
        relations: ["category", "user"],
      });
      if (!existing) throw new Error("Budget not found");

      if (input.amount !== undefined) existing.amount = input.amount;
      if (input.start_date !== undefined)
        existing.start_date = new Date(input.start_date);
      if (input.end_date !== undefined)
        existing.end_date = input.end_date ? new Date(input.end_date) : null;
      if (input.categoryId !== undefined) {
        const category = await categoryRepo.findOneBy({ id: input.categoryId });
        existing.category = category;
      }

      return await budgetRepo.save(existing);
    },

    deleteBudget: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const result = await budgetRepo.delete({ id, user: { id: user.id } });
      return result.affected === 1;
    },
  },
};

module.exports = budgetResolver;
