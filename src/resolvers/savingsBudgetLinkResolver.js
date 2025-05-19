const myDataSource = require("../config/database");
const linkRepo = myDataSource.getRepository("SavingsBudgetLink");
const savingsRepo = myDataSource.getRepository("Savings");
const budgetRepo = myDataSource.getRepository("Budget");

const savingsBudgetLinkResolver = {
  Query: {
    getSavingsBudgetLinks: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      return await linkRepo.find({
        relations: ["savings", "budget", "savings.user"],
        where: (qb) => {
          qb.where("savings.userId = :userId", { userId: user.id });
        },
      });
    },
  },

  Mutation: {
    createSavingsBudgetLink: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const savings = await savingsRepo.findOne({
        where: { id: input.savingsId, user: { id: user.id } },
        relations: ["user"],
      });
      const budget = await budgetRepo.findOne({
        where: { id: input.budgetId, user: { id: user.id } },
        relations: ["user"],
      });

      if (!savings || !budget) {
        throw new Error("Savings or Budget not found or not owned by user");
      }

      const link = linkRepo.create({ savings, budget });
      return await linkRepo.save(link);
    },

    updateSavingsBudgetLink: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await linkRepo.findOne({
        where: { id: input.id },
        relations: ["savings", "budget", "savings.user"],
      });

      if (!existing || existing.savings.user.id !== user.id) {
        throw new Error("Link not found or not owned by user");
      }

      if (input.savingsId) {
        const savings = await savingsRepo.findOne({
          where: { id: input.savingsId, user: { id: user.id } },
          relations: ["user"],
        });
        existing.savings = savings;
      }

      if (input.budgetId) {
        const budget = await budgetRepo.findOne({
          where: { id: input.budgetId, user: { id: user.id } },
          relations: ["user"],
        });
        existing.budget = budget;
      }

      return await linkRepo.save(existing);
    },

    deleteSavingsBudgetLink: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await linkRepo.findOne({
        where: { id },
        relations: ["savings", "savings.user"],
      });

      if (!existing || existing.savings.user.id !== user.id) {
        throw new Error("Link not found or not owned by user");
      }

      const result = await linkRepo.delete(id);
      return result.affected === 1;
    },
  },
};

module.exports = savingsBudgetLinkResolver;
