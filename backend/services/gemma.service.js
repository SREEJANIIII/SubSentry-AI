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
  },
};

module.exports = { gemmaService };