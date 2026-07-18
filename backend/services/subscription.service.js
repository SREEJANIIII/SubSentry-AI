const subscriptionService = {
  detect: function (transactions = []) {
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

    return Object.entries(grouped)
      .map(([merchant, merchantTransactions]) => {
        const sortedTransactions = [...merchantTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const analysis = this.analyzeMerchantPattern(sortedTransactions);

        if (!analysis.isSubscription) {
          return null;
        }

        return {
          merchant,
          averageCost: analysis.averageCost,
          frequency: analysis.frequency,
          estimatedRenewalDate: analysis.estimatedRenewalDate,
        };
      })
      .filter(Boolean);
  },

  analyzeMerchantPattern(transactions = []) {
    if (transactions.length < 2) {
      return { isSubscription: false };
    }

    const amounts = transactions.map((transaction) => transaction.amount);
    const averageCost = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;

    const intervals = [];
    for (let index = 1; index < transactions.length; index += 1) {
      const previousDate = new Date(transactions[index - 1].date);
      const currentDate = new Date(transactions[index].date);
      const diffDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      intervals.push(diffDays);
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const isMonthlyLike = intervals.every((interval) => interval >= 20 && interval <= 45);
    const amountConsistency = amounts.every((amount) => Math.abs(amount - averageCost) <= averageCost * 0.3);

    const isSubscription = isMonthlyLike && amountConsistency;

    if (!isSubscription) {
      return { isSubscription: false };
    }

    const lastTransaction = transactions[transactions.length - 1];
    const estimatedRenewalDate = this.addMonths(new Date(lastTransaction.date), 1);

    return {
      isSubscription: true,
      averageCost,
      frequency: this.describeFrequency(averageInterval),
      estimatedRenewalDate: estimatedRenewalDate.toISOString().slice(0, 10),
    };
  },

  describeFrequency(intervalDays) {
    if (intervalDays >= 20 && intervalDays <= 45) {
      return 'monthly';
    }

    return 'custom';
  },

  addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },
};

module.exports = { subscriptionService };
