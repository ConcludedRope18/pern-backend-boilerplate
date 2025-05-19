const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Budget",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    amount: {
      type: "float",
    },
    start_date: {
      type: "date",
    },
    end_date: {
      type: "date",
      nullable: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "budgets",
    },
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "category_id" },
      inverseSide: "budgets",
    },
    savingsBudgetLinks: {
      type: "one-to-many",
      target: "SavingsBudgetLink",
      inverseSide: "budget",
    },
  },
});
