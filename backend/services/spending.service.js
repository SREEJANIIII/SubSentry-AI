const spendingService = {
  analyze: async function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const validTransactions = transactions.filter((transaction) => {
      return typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount);
    });

    if (validTransactions.length === 0) {
      return {
        totalSpent: 0,
        averageTransaction: 0,
        largestExpense: 0,
        smallestExpense: 0,
        totalTransactions: 0,
        categoryTotals: {},
        highestCategory: null,
        lowestCategory: null,
        monthlyTotals: {},
        dailyTotals: {},
      };
    }

    const totalSpent = validTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const averageTransaction = totalSpent / validTransactions.length;

    const sortedByAmount = [...validTransactions].sort((a, b) => b.amount - a.amount);
    const largestExpense = sortedByAmount[0]?.amount || 0;
    const smallestExpense = sortedByAmount[sortedByAmount.length - 1]?.amount || 0;

    const categoryTotals = validTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    const highestCategory = this.getExtremeCategory(categoryTotals, 'highest');
    const lowestCategory = this.getExtremeCategory(categoryTotals, 'lowest');

    const monthlyTotals = validTransactions.reduce((acc, transaction) => {
      const month = transaction.date ? transaction.date.slice(0, 7) : 'Unknown';
      acc[month] = (acc[month] || 0) + transaction.amount;
      return acc;
    }, {});

    const dailyTotals = validTransactions.reduce((acc, transaction) => {
      const day = transaction.date || 'Unknown';
      acc[day] = (acc[day] || 0) + transaction.amount;
      return acc;
    }, {});

    return {
      totalSpent,
      averageTransaction,
      largestExpense,
      smallestExpense,
      totalTransactions: validTransactions.length,
      categoryTotals,
      highestCategory,
      lowestCategory,
      monthlyTotals,
      dailyTotals,
    };
  },

  getExtremeCategory(categoryTotals = {}, type = 'highest') {
    const entries = Object.entries(categoryTotals);

    if (entries.length === 0) {
      return null;
    }

    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

    if (type === 'lowest') {
      const lowestEntry = sortedEntries[sortedEntries.length - 1];
      return lowestEntry ? { category: lowestEntry[0], total: lowestEntry[1] } : null;
    }

    const highestEntry = sortedEntries[0];
    return highestEntry ? { category: highestEntry[0], total: highestEntry[1] } : null;
  },
};

module.exports = { spendingService };
