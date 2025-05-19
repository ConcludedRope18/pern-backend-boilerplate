const { get } = require("http");
const myDataSource = require("../config/database");
const transactionRepo = myDataSource.getRepository("Transaction");
const categoryRepo = myDataSource.getRepository("Category");
const userRepo = myDataSource.getRepository("User");
const { getUserBalance } = require("../utils/balanceUtils");

const transactionResolver = {
  Query: {
    getTransactions: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await transactionRepo.find({
        where: { user: { id: user.id } },
        relations: ["category", "user"],
      });
    },
  },

  Mutation: {
    
    createTransaction: async (_, { input }, { user }) => {
  if (!user) throw new Error("Not authenticated");

  const currentBalance = await getUserBalance(user.id);

  const projectedBalance = currentBalance + input.amount;

  if (projectedBalance < 0) {
    throw new Error("Transaction would result in negative balance.");
  }

  const category = input.categoryId
    ? await categoryRepo.findOneBy({ id: input.categoryId })
    : null;

  const newTransaction = transactionRepo.create({
    description: input.description,
    amount: input.amount,
    user: { id: user.id },
    category,
    ...(input.date && { date: new Date(input.date) }),
    ...(input.recurring !== undefined && { recurring: input.recurring }),
  });

  return await transactionRepo.save(newTransaction);
},


    updateTransaction: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await transactionRepo.findOne({
        where: { id: input.id, user: { id: user.id } },
        relations: ["category", "user"],
      });

      if (!existing) throw new Error("Transaction not found");

      if (input.description !== undefined) existing.description = input.description;
      if (input.amount !== undefined) existing.amount = input.amount;
      if (input.date !== undefined) existing.date = new Date(input.date);
      if (input.recurring !== undefined) existing.recurring = input.recurring;

      if (input.categoryId !== undefined) {
        const category = await categoryRepo.findOneBy({ id: input.categoryId });
        existing.category = category || null;
      }

      return await transactionRepo.save(existing);
    },

    deleteTransaction: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const result = await transactionRepo.delete({ id, user: { id: user.id } });
      return result.affected === 1;
    },
  },
};

module.exports = transactionResolver;
