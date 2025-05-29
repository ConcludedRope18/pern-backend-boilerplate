const myDataSource = require("../config/database");

const transactionRepo = myDataSource.getRepository("Transaction");
const recurringRepo = myDataSource.getRepository("Recurring");
const { LessThanOrEqual } = require("typeorm");

function getNextDate(currentDate, frequency) {
  const date = new Date(currentDate);
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Unknown repeat frequency: " + frequency);
  }
  return date;
}

async function runRecurringLogic() {
  const now = new Date();

 const recurrences = await recurringRepo.find({
    where: {
      active: true,
      next_date: LessThanOrEqual(now),
    },
    relations: ["transaction", "transaction.user", "transaction.category"],
  });


  let createdCount = 0;

  for (const r of recurrences) {
    const original = r.transaction;

    const newTx = transactionRepo.create({
      description: original.description,
      amount: original.amount,
      date: new Date(),
      recurring: true,
      user: original.user,
      category: original.category,
    });

    await transactionRepo.save(newTx);

    r.next_date = getNextDate(r.next_date, r.repeat_frequency);
    await recurringRepo.save(r);

    createdCount++;
  }

  return createdCount;
}

module.exports = { runRecurringLogic };
