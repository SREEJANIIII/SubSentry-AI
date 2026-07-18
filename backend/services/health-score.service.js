const healthScoreService = {
  config: {
    thresholds: {
      highShoppingSpending: 0.35,
      highEntertainmentSpending: 0.25,
      tooManySubscriptions: 3,
      excessiveWeekendSpending: 0.4,
      largeLuxuryPurchase: 300,
    },
    penalties: {
      highShoppingSpending: 15,
      duplicateSubscriptions: 10,
      highEntertainmentSpending: 12,
      tooManySubscriptions: 8,
      excessiveWeekendSpending: 10,
      largeLuxuryPurchase: 12,
    },
  },

  score: function (analysis = {}) {
    if (!analysis || typeof analysis !== 'object') {
      throw new Error('Analysis data must be an object.');
    }

    let score = 100;
    const penalties = [];
    const strengths = [];
    const weaknesses = [];

    const spendingAnalysis = analysis.spendingAnalysis || {};
    const subscriptionDetection = analysis.subscriptionDetection || [];
    const duplicateDetection = analysis.duplicateDetection || [];
    const paymentAnalysis = analysis.paymentAnalysis || {};
    const timeAnalysis = analysis.timeAnalysis || {};

    const totalSpent = spendingAnalysis.totalSpent || 0;
    const categoryTotals = spendingAnalysis.categoryTotals || {};
    const entertainmentSpend = categoryTotals.Entertainment || 0;
    const shoppingSpend = categoryTotals.Shopping || 0;
    const weekendSpending = timeAnalysis.weekendSpending || 0;
    const weekdaySpending = timeAnalysis.weekdaySpending || 0;
    const weekendRatio = weekdaySpending > 0 ? weekendSpending / (weekendSpending + weekdaySpending) : 0;
    const luxuryPurchases = (paymentAnalysis.paymentMethods || []).filter((entry) => entry.paymentMethod === 'Credit Card' || entry.paymentMethod === 'Card') || [];

    if (totalSpent > 0 && shoppingSpend / totalSpent > this.config.thresholds.highShoppingSpending) {
      score -= this.config.penalties.highShoppingSpending;
      penalties.push({ reason: 'highShoppingSpending', amount: this.config.penalties.highShoppingSpending });
      weaknesses.push('Shopping spending is a large share of your budget.');
    } else {
      strengths.push('Shopping spending is relatively controlled.');
    }

    if (duplicateDetection.length > 0) {
      score -= this.config.penalties.duplicateSubscriptions;
      penalties.push({ reason: 'duplicateSubscriptions', amount: this.config.penalties.duplicateSubscriptions });
      weaknesses.push('You appear to have overlapping subscriptions.');
    } else {
      strengths.push('No duplicate subscriptions detected.');
    }

    if (totalSpent > 0 && entertainmentSpend / totalSpent > this.config.thresholds.highEntertainmentSpending) {
      score -= this.config.penalties.highEntertainmentSpending;
      penalties.push({ reason: 'highEntertainmentSpending', amount: this.config.penalties.highEntertainmentSpending });
      weaknesses.push('Entertainment spending is taking up a large share of your budget.');
    } else {
      strengths.push('Entertainment spending is balanced.');
    }

    if (subscriptionDetection.length >= this.config.thresholds.tooManySubscriptions) {
      score -= this.config.penalties.tooManySubscriptions;
      penalties.push({ reason: 'tooManySubscriptions', amount: this.config.penalties.tooManySubscriptions });
      weaknesses.push('You have many active subscriptions.');
    } else {
      strengths.push('Subscription count is manageable.');
    }

    if (weekendRatio > this.config.thresholds.excessiveWeekendSpending) {
      score -= this.config.penalties.excessiveWeekendSpending;
      penalties.push({ reason: 'excessiveWeekendSpending', amount: this.config.penalties.excessiveWeekendSpending });
      weaknesses.push('A large share of spending is happening on weekends.');
    } else {
      strengths.push('Weekend spending is moderate.');
    }

    if (luxuryPurchases.length > 0 && totalSpent > this.config.thresholds.largeLuxuryPurchase) {
      score -= this.config.penalties.largeLuxuryPurchase;
      penalties.push({ reason: 'largeLuxuryPurchase', amount: this.config.penalties.largeLuxuryPurchase });
      weaknesses.push('Large luxury purchases are affecting your score.');
    } else {
      strengths.push('Luxury purchases are not dominating your spending.');
    }

    score = Math.max(0, score);

    return {
      score,
      grade: this.getGrade(score),
      strengths,
      weaknesses,
      penalties,
    };
  },

  getGrade: function (score) {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  },
};

module.exports = { healthScoreService };