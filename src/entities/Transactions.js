const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Transaction",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    description: {
      type: "text",
    },
    amount: {
      type: "float",
    },
    date: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    recurring: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "transactions",
    },
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "category_id" },
      inverseSide: "transactions",
    },
    recurringDetails: {
      type: "one-to-one",
      target: "Recurring",
      inverseSide: "transaction",
      joinColumn: { name: "recurring_id" },
      nullable: true,
    },
  },
});
