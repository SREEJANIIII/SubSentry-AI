const { gemmaService } = require('../services/gemma.service');
const { buildError } = require('../utils/response');

exports.getInsight = async (req, res) => {
  try {
    const summary = req?.body?.summary || req?.query?.summary || {};
    const result = await gemmaService.generateInsight(summary);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json(buildError(error?.message || 'Unable to generate insight.'));
  }
};
