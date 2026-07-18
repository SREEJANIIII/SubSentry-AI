const timeService = {
  analyze: function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const validTransactions = transactions.filter((transaction) => {
      return typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount);
    });

    const byHour = validTransactions.reduce((acc, transaction) => {
      const hour = transaction.hour ?? 0;
      acc[hour] = (acc[hour] || 0) + transaction.amount;
      return acc;
    }, {});

    const weekdayMap = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };

    const byWeekday = validTransactions.reduce((acc, transaction) => {
      const weekday = transaction.weekday ?? 0;
      const label = weekdayMap[weekday] || 'Unknown';
      acc[label] = (acc[label] || 0) + transaction.amount;
      return acc;
    }, {});

    const weekendSpending = validTransactions.reduce((sum, transaction) => {
      const isWeekend = transaction.is_weekend === true || transaction.is_weekend === 'true';
      return isWeekend ? sum + transaction.amount : sum;
    }, 0);

    const weekdaySpending = validTransactions.reduce((sum, transaction) => {
      const isWeekend = transaction.is_weekend === true || transaction.is_weekend === 'true';
      return isWeekend ? sum : sum + transaction.amount;
    }, 0);

    const mostActiveSpendingHour = this.getHighestKey(byHour);
    const mostExpensiveWeekday = this.getHighestKey(byWeekday);

    return {
      spendingByHour: byHour,
      spendingByWeekday: byWeekday,
      weekendSpending,
      weekdaySpending,
      mostActiveSpendingHour,
      mostExpensiveWeekday,
    };
  },

  getHighestKey(values = {}) {
    const entries = Object.entries(values);
    if (entries.length === 0) {
      return null;
    }

    const [key, value] = entries.reduce((best, current) => {
      return current[1] > best[1] ? current : best;
    }, entries[0]);

    return { key, value };
  },
};

module.exports = { timeService };