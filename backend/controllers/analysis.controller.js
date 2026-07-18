const { analysisPipelineService } = require('../services/analysis-pipeline.service');
const { buildResponse, buildError } = require('../utils/response');

const extractTransactions = (req) => {
  if (Array.isArray(req?.body?.transactions)) {
    return req.body.transactions;
  }

  if (Array.isArray(req?.body)) {
    return req.body;
  }

  if (Array.isArray(req?.query?.transactions)) {
    return req.query.transactions;
  }

  return [];
};

exports.runAnalysis = async (req, res) => {
  try {
    const transactions = extractTransactions(req);
    const result = await analysisPipelineService.run(transactions);
    res.status(200).json(buildResponse(true, 'Analysis completed successfully.', result));
  } catch (error) {
    res.status(400).json(buildError(error?.message || 'Unable to complete analysis.'));
  }
};
