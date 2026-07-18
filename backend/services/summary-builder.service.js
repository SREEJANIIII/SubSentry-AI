const summaryBuilderService = {
  build: function (analysis = {}) {
    if (!analysis || typeof analysis !== 'object') {
      throw new Error('Analysis data must be an object.');
    }

    return {
      overview: this.buildOverview(analysis),
      spending: analysis.spendingAnalysis || {},
      subscriptions: analysis.subscriptionDetection || [],
      duplicates: analysis.duplicateDetection || [],
      cities: analysis.cityAnalysis || {},
      paymentMethods: analysis.paymentAnalysis || {},
      timeInsights: analysis.timeAnalysis || {},
      merchantInsights: analysis.merchantAnalysis || [],
      health: analysis.healthScore || {},
    };
  },

  buildOverview: function (analysis = {}) {
    const spending = analysis.spendingAnalysis || {};
    const subscriptions = analysis.subscriptionDetection || [];
    const duplicates = analysis.duplicateDetection || [];
    const cities = analysis.cityAnalysis || {};
    const merchantAnalysis = analysis.merchantAnalysis || [];
    const health = analysis.healthScore || {};

    return {
      totalSpent: spending.totalSpent || 0,
      totalTransactions: spending.totalTransactions || 0,
      subscriptionCount: subscriptions.length,
      duplicateCount: duplicates.length,
      topCity: cities.mostExpensiveCity || null,
      topMerchant: merchantAnalysis[0] || null,
      healthScore: health.score || 0,
      healthGrade: health.grade || 'F',
    };
  },
};

module.exports = { summaryBuilderService };