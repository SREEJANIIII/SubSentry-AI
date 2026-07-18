const { spendingService } = require('./spending.service');
const { merchantService } = require('./merchant.service');
const { timeService } = require('./time.service');
const { cityService } = require('./city.service');
const { paymentMethodService } = require('./payment-method.service');
const { subscriptionService } = require('./subscription.service');
const { duplicateService } = require('./duplicate.service');
const { healthScoreService } = require('./health-score.service');
const { summaryBuilderService } = require('./summary-builder.service');

const analysisPipelineService = {
  run: async function (transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array.');
    }

    const spendingAnalysis = await spendingService.analyze(transactions);
    const merchantAnalysis = merchantService.analyze(transactions);
    const timeAnalysis = timeService.analyze(transactions);
    const cityAnalysis = cityService.analyze(transactions);
    const paymentAnalysis = paymentMethodService.analyze(transactions);
    const subscriptionDetection = subscriptionService.detect(transactions);
    const duplicateDetection = duplicateService.findDuplicates(transactions);
    const healthScore = healthScoreService.score({
      spendingAnalysis,
      merchantAnalysis,
      timeAnalysis,
      cityAnalysis,
      paymentAnalysis,
      subscriptionDetection,
      duplicateDetection,
    });

    const summary = summaryBuilderService.build({
      spendingAnalysis,
      merchantAnalysis,
      timeAnalysis,
      cityAnalysis,
      paymentAnalysis,
      subscriptionDetection,
      duplicateDetection,
      healthScore,
    });

    return {
      spendingAnalysis,
      merchantAnalysis,
      timeAnalysis,
      cityAnalysis,
      paymentAnalysis,
      subscriptionDetection,
      duplicateDetection,
      healthScore,
      summary,
    };
  },
};

module.exports = { analysisPipelineService };