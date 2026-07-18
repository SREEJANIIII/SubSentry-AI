const { paymentRiskService } = require('../services/payment-risk.service');
const { buildError } = require('../utils/response');

exports.assess = async (req, res) => {
  try {
    const input = req?.body?.input || req?.query?.input || '';
    const result = paymentRiskService.assess(input);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json(buildError(error?.message || 'Unable to assess payment risk.'));
  }
};
