const { runRecurringLogic } = require("../utils/recurring");

const recurringAutomationResolver = {
  Mutation: {
    runRecurringTransactions: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const createdCount = await runRecurringLogic();
      return createdCount;
    },
  },
};

module.exports = recurringAutomationResolver;
