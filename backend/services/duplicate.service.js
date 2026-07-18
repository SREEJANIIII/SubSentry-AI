const duplicateService = {
  knowledgeBase: [
    {
      group: 'Entertainment',
      subscriptions: ['Netflix', 'Prime Video', 'Disney+', 'Hotstar'],
    },
    {
      group: 'Music',
      subscriptions: ['Spotify', 'Apple Music', 'YouTube Music'],
    },
    {
      group: 'Gaming',
      subscriptions: ['Xbox Game Pass', 'PlayStation Plus'],
    },
  ],

  findDuplicates: function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const detectedSubscriptions = transactions.filter((transaction) => {
      return typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount) && transaction.merchant;
    });

    const matches = this.knowledgeBase
      .map((entry) => {
        const matchedSubscriptions = detectedSubscriptions.filter((transaction) => {
          const merchant = this.normalizeMerchant(transaction.merchant);
          return entry.subscriptions.some((knownSubscription) => this.normalizeMerchant(knownSubscription) === merchant);
        });

        if (matchedSubscriptions.length <= 1) {
          return null;
        }

        const totalSpent = matchedSubscriptions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const estimatedSavings = Math.max(0, totalSpent - matchedSubscriptions[0].amount);

        return {
          group: entry.group,
          subscriptions: matchedSubscriptions.map((transaction) => transaction.merchant),
          estimatedSavings,
        };
      })
      .filter(Boolean);

    return matches;
  },

  normalizeMerchant: function (value = '') {
    return String(value).trim().toLowerCase();
  },
};

module.exports = { duplicateService };
