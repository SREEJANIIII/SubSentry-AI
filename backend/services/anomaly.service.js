const axios = require('axios');
const { gemmaService } = require('./gemma.service');

const anomalyService = {
  detect: async function (transactionData) {
    const transactions = Array.isArray(transactionData)
      ? transactionData
      : Array.isArray(transactionData?.transactions)
        ? transactionData.transactions
        : [];

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }

    let prediction = null;
    try {
      if (process.env.ENABLE_ML !== 'false') {
        const mlResponse = await axios.post('http://127.0.0.1:8000/predict', { transactions }, { timeout: 1500 });
        prediction = mlResponse?.data || null;
      }
    } catch (error) {
      console.warn('ML endpoint unavailable, using built-in anomaly heuristics.', error.message);
    }

    const anomalies = this.buildHeuristicAnomalies(transactions);

    if (anomalies.length > 0) {
      await gemmaService.generateInsight({
        transactions,
        prediction: prediction?.prediction || null,
        risk_score: prediction?.risk_score || null,
        confidence: prediction?.confidence || null,
        reason: anomalies[0].reason,
        anomalies,
      });
    }

    return anomalies;
  },

  buildHeuristicAnomalies: function (transactions = []) {
    const grouped = transactions.reduce((acc, transaction) => {
      const category = transaction?.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(transaction);
      return acc;
    }, {});

    const categories = Object.entries(grouped).map(([category, items]) => {
      const total = items.reduce((sum, item) => sum + Number(item?.amount || 0), 0);
      const average = total / Math.max(items.length, 1);
      const current = Math.max(...items.map((item) => Number(item?.amount || 0)));
      const increase = average > 0 ? ((current - average) / average) * 100 : 0;

      return {
        category,
        total,
        average,
        current,
        increase: Number(increase.toFixed(1)),
      };
    });

    const averageCategorySpend = categories.reduce((sum, category) => sum + category.total, 0) / Math.max(categories.length, 1);

    return categories
      .filter((category) => category.total >= averageCategorySpend * 2.5 && category.total >= 1000)
      .map((category) => ({
        ...category,
        reason: `unusual spending in ${category.category} compared with recent activity.`,
      }))
      .sort((left, right) => right.increase - left.increase);
  },
};

module.exports = { anomalyService };