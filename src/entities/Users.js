const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "text",
    },
    email: {
      type: "text",
    },
    password: {
      type: "text",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    transactions: {
      type: "one-to-many",
      target: "Transaction",
      inverseSide: "user",
    },
    categories: {
      type: "one-to-many",
      target: "Category",
      inverseSide: "user",
    },
    budgets: {
      type: "one-to-many",
      target: "Budget",
      inverseSide: "user",
    },
    savings: {
      type: "one-to-many",
      target: "Savings",
      inverseSide: "user",
    },
  },
});
