const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Category",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "text",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "categories",
      nullable: true,
    },
    transactions: {
      type: "one-to-many",
      target: "Transaction",
      inverseSide: "category",
    },
    budgets: {
      type: "one-to-many",
      target: "Budget",
      inverseSide: "category",
    },
  },
});
