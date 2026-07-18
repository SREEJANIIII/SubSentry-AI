const { anomalyService } = require('../services/anomaly.service');
const { buildError } = require('../utils/response');

exports.getAnomalies = async (req, res) => {
  try {
    const transactionData = req.body;
    const result = await anomalyService.detect(transactionData);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json(buildError(error?.message || 'Unable to detect anomalies.'));
  }
};