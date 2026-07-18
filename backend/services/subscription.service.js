const CATEGORY_MAP = {
  "Netflix": "Entertainment",
  "Prime Video": "Entertainment",
  "Amazon Prime": "Entertainment",
  "Disney+": "Entertainment",
  "Disney+ Hotstar": "Entertainment",
  "Hotstar": "Entertainment",
  "SonyLIV": "Entertainment",
  "Zee5": "Entertainment",
  "JioCinema": "Entertainment",

  "Spotify": "Music",
  "Apple Music": "Music",
  "YouTube Premium": "Music",
  "Gaana": "Music",
  "Wynk": "Music",

  "Dropbox": "Cloud Storage",
  "Google One": "Cloud Storage",
  "iCloud": "Cloud Storage",
  "OneDrive": "Cloud Storage",

  "ChatGPT": "AI Tools",
  "Claude": "AI Tools",
  "Gemini": "AI Tools",
  "Perplexity": "AI Tools",

  "Canva": "Design",
  "Adobe": "Design",

  "Zoom": "Productivity",
  "Microsoft 365": "Productivity",
  "Notion": "Productivity",
  "Slack": "Productivity",
};

const subscriptionService = {
  detect(transactions = []) {
    if (!Array.isArray(transactions)) {
      throw new Error("Transactions must be an array.");
    }

    const validTransactions = transactions.filter(
      (t) =>
        typeof t.amount === "number" &&
        Number.isFinite(t.amount) &&
        t.date &&
        t.merchant
    );

    const grouped = {};

    for (const transaction of validTransactions) {
      const merchant = transaction.merchant.trim();

      if (!grouped[merchant]) grouped[merchant] = [];

      grouped[merchant].push(transaction);
    }

    return Object.entries(grouped)
      .map(([merchant, merchantTransactions]) => {
        const sorted = merchantTransactions.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const analysis = this.analyzeMerchantPattern(
          merchant,
          sorted
        );

        if (!analysis.isSubscription) return null;

        return {
          merchant,
          averageCost: Number(analysis.averageCost.toFixed(2)),
          frequency: analysis.frequency,
          estimatedRenewalDate: analysis.estimatedRenewalDate,
          confidence: analysis.confidence,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.confidence - a.confidence);
  },

  analyzeMerchantPattern(merchant, transactions) {
    if (transactions.length < 2)
      return { isSubscription: false };

    const amounts = transactions.map((t) => t.amount);

    const averageCost =
      amounts.reduce((a, b) => a + b, 0) / amounts.length;

    //---------------------------------
    // INTERVAL ANALYSIS
    //---------------------------------

    const intervals = [];

    for (let i = 1; i < transactions.length; i++) {
      const previous = new Date(transactions[i - 1].date);
      const current = new Date(transactions[i].date);

      intervals.push(
        (current - previous) /
          (1000 * 60 * 60 * 24)
      );
    }

    const averageInterval =
      intervals.reduce((a, b) => a + b, 0) /
      intervals.length;

    //---------------------------------
    // SCORING
    //---------------------------------

    let score = 0;

    //---------------------------------
    // 1. Known merchant (40)
    //---------------------------------

    const merchantLower = merchant.toLowerCase();
if (
  Object.keys(CATEGORY_MAP).some((m) =>
    merchantLower.includes(m.toLowerCase())
  )
) {
  score += 40;
}

    //---------------------------------
    // 2. Monthly interval (30)
    //---------------------------------

    const monthlyIntervals = intervals.filter(
      (d) => d >= 20 && d <= 45
    );

    const intervalRatio =
      monthlyIntervals.length / intervals.length;

    if (intervalRatio >= 0.7)
      score += 30;
    else if (intervalRatio >= 0.5)
      score += 20;
    else if (intervalRatio >= 0.3)
      score += 10;

    //---------------------------------
    // 3. Similar amounts (20)
    //---------------------------------

    const similarAmounts = amounts.filter(
      (a) =>
        Math.abs(a - averageCost) <= averageCost * 0.35
    );

    const amountRatio =
      similarAmounts.length / amounts.length;

    if (amountRatio >= 0.8)
      score += 20;
    else if (amountRatio >= 0.6)
      score += 10;

    //---------------------------------
    // 4. Number of payments (10)
    //---------------------------------

    if (transactions.length >= 6)
      score += 10;
    else if (transactions.length >= 4)
      score += 7;
    else if (transactions.length >= 2)
      score += 5;

    //---------------------------------
    // DECISION
    //---------------------------------

    const isSubscription = score >= 50;

    if (!isSubscription)
      return { isSubscription: false };

    const last =
      transactions[transactions.length - 1];

    const renewal = new Date(last.date);
    renewal.setMonth(renewal.getMonth() + 1);

    return {
      isSubscription: true,
      confidence: score,
      averageCost,
      frequency: this.describeFrequency(
        averageInterval
      ),
      estimatedRenewalDate: renewal
        .toISOString()
        .slice(0, 10),
    };
  },

    describeFrequency(interval) {
    if (interval >= 25 && interval <= 35)
      return "Monthly";

    if (interval >= 6 && interval <= 8)
      return "Weekly";

    if (interval >= 13 && interval <= 17)
      return "Bi-Weekly";

    if (interval >= 80 && interval <= 100)
      return "Quarterly";

    return "Recurring";
  },
};

subscriptionService.detectSubscriptionOverlap = function (subscriptions = []) {
  const grouped = {};

  subscriptions.forEach((sub) => {
    let category = "Other";

    for (const merchant in CATEGORY_MAP) {
      if (
        sub.merchant.toLowerCase().includes(merchant.toLowerCase())
      ) {
        category = CATEGORY_MAP[merchant];
        break;
      }
    }

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(sub);
  });

  return Object.entries(grouped)
    .filter(([_, services]) => services.length > 1)
    .map(([category, services]) => {
      const totalCost = services.reduce(
        (sum, service) => sum + service.averageCost,
        0
      );

      const cheapest = Math.min(
        ...services.map((service) => service.averageCost)
      );

      return {
        category,
        count: services.length,
        services: services.map((service) => ({
          merchant: service.merchant,
          averageCost: service.averageCost,
          renewalDate: service.estimatedRenewalDate,
        })),
        potentialSavings: Number((totalCost - cheapest).toFixed(2)),
        recommendation: `You have ${services.length} ${category.toLowerCase()} subscriptions. Consider cancelling one to save approximately ₹${(totalCost - cheapest).toFixed(2)} per month.`,
      };
    });
};

module.exports = { subscriptionService };