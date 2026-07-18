const { duplicateService } = require('../services/duplicate.service');
const { buildError } = require('../utils/response');

exports.getDuplicates = async (req, res) => {
  try {
    const transactions = Array.isArray(req?.body?.transactions)
      ? req.body.transactions
      : Array.isArray(req?.query?.transactions)
        ? req.query.transactions
        : [];
    const result = duplicateService.findDuplicates(transactions);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json(buildError(error?.message || 'Unable to detect duplicates.'));
  }
};
