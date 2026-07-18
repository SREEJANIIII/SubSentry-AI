const aiIntegrationService = {
  buildPrompt: function (summary = {}) {
    if (!summary || typeof summary !== 'object') {
      throw new Error('Financial summary must be an object.');
    }

    const overview = summary.overview || {};
    const spending = summary.spending || {};
    const subscriptions = Array.isArray(summary.subscriptions) ? summary.subscriptions : [];
    const duplicates = Array.isArray(summary.duplicates) ? summary.duplicates : [];
    const cities = summary.cities || {};
    const paymentMethods = summary.paymentMethods || {};
    const timeInsights = summary.timeInsights || {};
    const merchantInsights = Array.isArray(summary.merchantInsights) ? summary.merchantInsights : [];
    const health = summary.health || {};

    const topMerchant = merchantInsights[0] || {};
    const topCity = cities.mostExpensiveCity || {};
    const paymentList = Array.isArray(paymentMethods.paymentMethods) ? paymentMethods.paymentMethods : [];

    return `You are a financial analysis assistant.

Analyze the following financial summary and respond in a structured way.

Do not include raw transactions. Focus on insight and recommendations.

Financial Summary:
- Total spent: ${overview.totalSpent || 0}
- Total transactions: ${overview.totalTransactions || 0}
- Subscription count: ${overview.subscriptionCount || 0}
- Duplicate subscription groups: ${overview.duplicateCount || 0}
- Health score: ${health.score || 0}
- Health grade: ${health.grade || 'F'}
- Spending breakdown: ${JSON.stringify(spending)}
- Subscriptions: ${JSON.stringify(subscriptions)}
- Duplicate groups: ${JSON.stringify(duplicates)}
- Top city: ${JSON.stringify(topCity)}
- Payment methods: ${JSON.stringify(paymentList)}
- Time insights: ${JSON.stringify(timeInsights)}
- Merchant insights: ${JSON.stringify(merchantInsights)}

Please provide the following sections:
1. Executive Summary
2. Spending Behaviour
3. Potential Savings
4. Financial Risks
5. Action Plan
6. Recommendations

Keep the response concise, practical, and tailored to the user’s financial habits.`;
  },
};

module.exports = { aiIntegrationService };