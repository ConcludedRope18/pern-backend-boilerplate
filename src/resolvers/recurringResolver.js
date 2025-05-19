const myDataSource = require("../config/database");
const recurringRepo = myDataSource.getRepository("Recurring");
const transactionRepo = myDataSource.getRepository("Transaction");

const recurringResolver = {
  Query: {
    getRecurringForUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      return await recurringRepo.find({
        relations: ["transaction", "transaction.user"],
        where: (qb) => {
          qb.where("transaction.userId = :userId", { userId: user.id });
        },
      });
    },
  },

  Mutation: {
    createRecurring: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const transaction = await transactionRepo.findOne({
        where: { id: input.transactionId, user: { id: user.id } },
        relations: ["user"],
      });

      if (!transaction) throw new Error("Transaction not found or not owned by user");

      const recurring = recurringRepo.create({
        transaction,
        repeat_frequency: input.repeat_frequency,
        next_date: new Date(input.next_date),
        start_date: new Date(input.start_date),
        active: input.active ?? true,
      });

      return await recurringRepo.save(recurring);
    },

    updateRecurring: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await recurringRepo.findOne({
        where: { id: input.id },
        relations: ["transaction", "transaction.user"],
      });

      if (!existing || existing.transaction.user.id !== user.id) {
        throw new Error("Recurring transaction not found or not owned by user");
      }

      if (input.repeat_frequency !== undefined) {
        existing.repeat_frequency = input.repeat_frequency;
      }
      if (input.next_date !== undefined) {
        existing.next_date = new Date(input.next_date);
      }
      if (input.start_date !== undefined) {
        existing.start_date = new Date(input.start_date);
      }
      if (input.active !== undefined) {
        existing.active = input.active;
      }

      return await recurringRepo.save(existing);
    },

    deleteRecurring: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await recurringRepo.findOne({
        where: { id },
        relations: ["transaction", "transaction.user"],
      });

      if (!existing || existing.transaction.user.id !== user.id) {
        throw new Error("Recurring transaction not found or not owned by user");
      }

      const result = await recurringRepo.delete(id);
      return result.affected === 1;
    },
  },
};

module.exports = recurringResolver;
