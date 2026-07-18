const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMMA_API_KEY,
});

const gemmaService = {
  generateInsight: async (transaction) => {
    try {
      const prompt = `
You are an AI financial fraud analyst.

Analyze this financial transaction.

${JSON.stringify(transaction, null, 2)}

Explain:

1. Why this transaction may or may not be suspicious.
2. Mention the amount, category, payment method, city or transaction time if relevant.
3. Give an overall risk judgement (Low, Medium or High).
4. Give one recommendation to the user.

Return ONLY valid JSON in this format:

{
  "summary": "...",
  "risk_judgement": "...",
  "recommendation": "..."
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return {
        success: true,
        explanation: response.text,
      };
    } catch (error) {
      console.error("Gemma Error:", error);

      return {
        success: false,
        explanation: "Unable to generate AI explanation.",
      };
    }
const gemmaService = {
  generateInsight: async function (summary = {}) {
    if (!summary || typeof summary !== 'object') {
      throw new Error('Summary data must be an object.');
    }

    const overview = summary.overview || {};
    const health = summary.health || {};
    const subscriptions = Array.isArray(summary.subscriptions) ? summary.subscriptions : [];
    const duplicates = Array.isArray(summary.duplicates) ? summary.duplicates : [];

    return {
      summary,
      insight: {
        score: health.score || 0,
        grade: health.grade || 'F',
        overview: {
          totalSpent: overview.totalSpent || 0,
          totalTransactions: overview.totalTransactions || 0,
          subscriptionCount: overview.subscriptionCount || 0,
          duplicateCount: overview.duplicateCount || 0,
        },
        highlights: [
          subscriptions.length > 0 ? `You have ${subscriptions.length} active subscriptions.` : 'No active subscriptions detected.',
          duplicates.length > 0 ? `You have ${duplicates.length} duplicate-subscription group(s) to review.` : 'No duplicate subscriptions detected.',
          health.score >= 80 ? 'Your financial habits look strong overall.' : 'Your spending pattern suggests areas to improve.',
        ],
      },
    };
  },
};

module.exports = { gemmaService };