const categoryResolver = require("./categoryResolver");
const userResolver = require("./userResolver");
const transactionResolver = require("./transactionResolver");
const budgetResolver = require("./budgetResolver");
const recurringResolver = require("./recurringResolver");
const savingsResolver = require("./savingsResolver");
const savingsBudgetLinkResolver = require("./savingsBudgetLinkResolver");

const resolvers = {
  Query: {
    //hello: () => "Hello from GraphQL!",
    ...userResolver.Query,
    ...transactionResolver.Query,
    ...categoryResolver.Query,
    ...budgetResolver.Query,
    ...recurringResolver.Query,
    ...savingsResolver.Query,
    ...savingsBudgetLinkResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...transactionResolver.Mutation,
    ...categoryResolver.Mutation,
    ...budgetResolver.Mutation,
    ...recurringResolver.Mutation,
    ...savingsResolver.Mutation,
    ...savingsBudgetLinkResolver.Mutation,
  },
};

module.exports = resolvers;

