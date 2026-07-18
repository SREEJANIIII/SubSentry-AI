let ai = null;

try {
  const { GoogleGenAI } = require('@google/genai');
  if (process.env.GEMMA_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMMA_API_KEY });
  }
} catch (error) {
  console.warn('Google GenAI SDK is unavailable; falling back to local insight generation.', error.message);
}

const buildFallbackInsight = (input = {}) => {
  const summary = input?.summary || input || {};
  const overview = summary.overview || {};
  const health = summary.health || {};
  const subscriptions = Array.isArray(summary.subscriptions) ? summary.subscriptions : [];
  const duplicates = Array.isArray(summary.duplicates) ? summary.duplicates : [];
  const anomalies = Array.isArray(summary.anomalies) ? summary.anomalies : [];

  const highlights = [];

  if (anomalies.length > 0) {
    highlights.push(`Detected ${anomalies.length} unusual spending pattern(s), including ${anomalies[0].category}.`);
  } else {
    highlights.push('No unusual spend spikes were detected in the current snapshot.');
  }

  highlights.push(subscriptions.length > 0 ? `You have ${subscriptions.length} active subscriptions.` : 'No active subscriptions detected.');
  highlights.push(duplicates.length > 0 ? `You have ${duplicates.length} duplicate-subscription group(s) to review.` : 'No duplicate subscriptions detected.');
  highlights.push(health.score >= 80 ? 'Your financial habits look strong overall.' : 'Your spending pattern suggests areas to improve.');

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
      highlights,
    },
  };
};

const gemmaService = {
  generateInsight: async function (input = {}) {
    if (!input || typeof input !== 'object') {
      throw new Error('Insight input must be an object.');
    }

    const fallback = buildFallbackInsight(input);
    const prompt = `You are an AI financial analyst. Summarize the following financial snapshot.\n\n${JSON.stringify(input, null, 2)}\n\nReturn a concise explanation and recommendations.`;

    try {
      if (!ai) {
        throw new Error('GEMMA_API_KEY is not configured.');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        success: true,
        explanation: text || JSON.stringify(fallback),
        data: fallback,
      };
    } catch (error) {
      console.error('Gemma Error:', error.message);

      return {
        success: false,
        explanation: JSON.stringify(fallback),
        data: fallback,
      };
    }
  },
};

module.exports = { gemmaService };