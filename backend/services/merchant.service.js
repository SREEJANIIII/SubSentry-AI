const merchantService = {
  analyze: function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const validTransactions = transactions.filter((transaction) => {
      return typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount);
    });

    const grouped = validTransactions.reduce((acc, transaction) => {
      const merchant = transaction.merchant || 'Unknown';
      if (!acc[merchant]) {
        acc[merchant] = [];
      }
      acc[merchant].push(transaction);
      return acc;
    }, {});

    const merchantAnalytics = Object.entries(grouped).map(([merchant, merchantTransactions]) => {
      const totalSpent = merchantTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      const visits = merchantTransactions.length;
      const averageSpent = visits > 0 ? totalSpent / visits : 0;
      const largestExpense = merchantTransactions.reduce((max, transaction) => {
        return transaction.amount > max ? transaction.amount : max;
      }, 0);

      return {
        merchant,
        visits,
        totalSpent,
        averageSpent,
        largestExpense,
      };
    });

    return merchantAnalytics.sort((a, b) => b.totalSpent - a.totalSpent);
  },
};

module.exports = { merchantService };