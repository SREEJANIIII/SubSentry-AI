const { anomalyService } = require('../services/anomaly.service');

exports.getAnomalies = async (req, res) => {
  try {
    const transactionData = req.body;

    const result = await anomalyService.detect(transactionData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};