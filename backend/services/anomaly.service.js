const axios = require("axios");
const { gemmaService } = require("./gemma.service");

const anomalyService = {
  detect: async (transactionData) => {
    try {
      // Step 1: Get ML prediction
      const mlResponse = await axios.post(
        "http://127.0.0.1:8000/predict",
        transactionData
      );

      const prediction = mlResponse.data;

      // Step 2: Generate AI explanation
      const gemmaResponse = await gemmaService.generateInsight({
        transaction: transactionData,
        prediction: prediction.prediction,
        risk_score: prediction.risk_score,
        confidence: prediction.confidence,
        reason: prediction.reason,
      });

      let aiAnalysis = {
        summary: "AI analysis unavailable.",
        risk_judgement: prediction.confidence,
        recommendation: "Review the transaction manually."
      };

      if (gemmaResponse.success) {
        try {
          const cleaned = gemmaResponse.explanation
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          aiAnalysis = JSON.parse(cleaned);
        } catch (err) {
          console.error("Failed to parse Gemini response:", err.message);
        }
      }

      return {
        ...prediction,
        ai_analysis: aiAnalysis,
      };

    } catch (error) {
      console.error("Anomaly Service Error:", error.message);

      throw new Error("Failed to analyze transaction");
    }
  },
};

module.exports = { anomalyService };