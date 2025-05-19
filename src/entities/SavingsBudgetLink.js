const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "SavingsBudgetLink",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
  },
  relations: {
    savings: {
      type: "many-to-one",
      target: "Savings",
      joinColumn: { name: "savings_id" },
      inverseSide: "savingsBudgetLinks",
    },
    budget: {
      type: "many-to-one",
      target: "Budget",
      joinColumn: { name: "budget_id" },
      inverseSide: "savingsBudgetLinks",
    },
  },
});
