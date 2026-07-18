const paymentMethodService = {
  analyze: function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const validTransactions = transactions.filter((transaction) => {
      return typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount);
    });

    const grouped = validTransactions.reduce((acc, transaction) => {
      const method = transaction.payment_method || 'Unknown';
      if (!acc[method]) {
        acc[method] = [];
      }
      acc[method].push(transaction);
      return acc;
    }, {});

    const totalSpending = validTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const paymentMethods = Object.entries(grouped)
      .map(([paymentMethod, paymentTransactions]) => {
        const totalAmount = paymentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const transactionCount = paymentTransactions.length;
        const averageTransaction = transactionCount > 0 ? totalAmount / transactionCount : 0;
        const percentageUsage = totalSpending > 0 ? (totalAmount / totalSpending) * 100 : 0;

        return {
          paymentMethod,
          totalAmount,
          transactionCount,
          averageTransaction,
          percentageUsage,
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return {
      paymentMethods,
    };
  },
};

module.exports = { paymentMethodService };