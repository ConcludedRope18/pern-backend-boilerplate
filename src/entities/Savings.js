const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Savings",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "text",
    },
    target: {
      type: "float",
    },
    deadline: {
      type: "date",
    },
    saved: {
      type: "float",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "savings",
    },
    savingsBudgetLinks: {
      type: "one-to-many",
      target: "SavingsBudgetLink",
      inverseSide: "savings",
    },
  },
});
