const cityService = {
  analyze: function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const validTransactions = transactions.filter((transaction) => {
      return typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount);
    });

    const grouped = validTransactions.reduce((acc, transaction) => {
      const city = transaction.city || 'Unknown';
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(transaction);
      return acc;
    }, {});

    const cityAnalytics = Object.entries(grouped).map(([city, cityTransactions]) => {
      const amountSpent = cityTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      const transactions = cityTransactions.length;
      const averageTransaction = transactions > 0 ? amountSpent / transactions : 0;

      return {
        city,
        amountSpent,
        transactions,
        averageTransaction,
      };
    });

    const mostExpensiveCity = cityAnalytics.reduce((max, entry) => {
      return entry.amountSpent > max.amountSpent ? entry : max;
    }, cityAnalytics[0] || { city: null, amountSpent: 0, transactions: 0, averageTransaction: 0 });

    return {
      cities: cityAnalytics.sort((a, b) => b.amountSpent - a.amountSpent),
      mostExpensiveCity,
    };
  },
};

module.exports = { cityService };