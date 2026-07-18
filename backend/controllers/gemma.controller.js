const { gemmaService } = require("../services/gemma.service");

exports.getInsight = async (req, res) => {
  try {
    const transaction = req.body;

    const result = await gemmaService.generateInsight(transaction);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};