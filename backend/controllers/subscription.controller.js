const { subscriptionService } = require('../services/subscription.service');
const { buildError } = require('../utils/response');

exports.getSubscriptions = async (req, res) => {
  try {
    const transactions = Array.isArray(req?.body?.transactions)
      ? req.body.transactions
      : Array.isArray(req?.query?.transactions)
        ? req.query.transactions
        : [];
    const result = subscriptionService.detect(transactions);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json(buildError(error?.message || 'Unable to analyze subscriptions.'));
  }
};
