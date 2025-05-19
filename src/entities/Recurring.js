const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Recurring",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    repeat_frequency: {
      type: "text",
    },
    next_date: {
      type: "date",
    },
    start_date: {
      type: "date",
    },
    active: {
      type: "boolean",
      default: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    transaction: {
      type: "one-to-one",
      target: "Transaction",
      joinColumn: { name: "transaction_id" },
      inverseSide: "recurringDetails",
    },
  },
});
