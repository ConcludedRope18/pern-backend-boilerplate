const myDataSource = require("../config/database");
const transactionRepo = myDataSource.getRepository("Transaction");

async function getUserBalance(user_id) {
  const result = await transactionRepo
    .createQueryBuilder("t")
    .select("SUM(t.amount)", "total")
    .where("t.user_id = :user_id", { user_id })
    .getRawOne();

  return parseFloat(result.total) || 0;
}

module.exports = { getUserBalance };
