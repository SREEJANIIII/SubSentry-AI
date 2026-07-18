const gemmaService = {
  generateInsight: async function (summary = {}) {
    if (!summary || typeof summary !== 'object') {
      throw new Error('Summary data must be an object.');
    }

    const overview = summary.overview || {};
    const health = summary.health || {};
    const subscriptions = Array.isArray(summary.subscriptions) ? summary.subscriptions : [];
    const duplicates = Array.isArray(summary.duplicates) ? summary.duplicates : [];

    return {
      summary,
      insight: {
        score: health.score || 0,
        grade: health.grade || 'F',
        overview: {
          totalSpent: overview.totalSpent || 0,
          totalTransactions: overview.totalTransactions || 0,
          subscriptionCount: overview.subscriptionCount || 0,
          duplicateCount: overview.duplicateCount || 0,
        },
        highlights: [
          subscriptions.length > 0 ? `You have ${subscriptions.length} active subscriptions.` : 'No active subscriptions detected.',
          duplicates.length > 0 ? `You have ${duplicates.length} duplicate-subscription group(s) to review.` : 'No duplicate subscriptions detected.',
          health.score >= 80 ? 'Your financial habits look strong overall.' : 'Your spending pattern suggests areas to improve.',
        ],
      },
    };
  },
};

module.exports = { gemmaService };
