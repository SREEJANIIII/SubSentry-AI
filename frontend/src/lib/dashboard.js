export function mapAnalysisToDashboard(analysisPayload = {}) {
  const analysis = analysisPayload?.data ?? analysisPayload
  const summary = analysis?.summary ?? {}
  const spending = analysis?.spendingAnalysis ?? summary?.spending ?? {}
  const subscriptions = Array.isArray(analysis?.subscriptionDetection)
    ? analysis.subscriptionDetection
    : Array.isArray(summary?.subscriptions)
      ? summary.subscriptions
      : []
  const duplicates = Array.isArray(analysis?.duplicateDetection)
    ? analysis.duplicateDetection
    : Array.isArray(summary?.duplicates)
      ? summary.duplicates
      : []
  const monthlyTotals = spending.monthlyTotals ?? {}
  const categoryTotals = spending.categoryTotals ?? {}
  const anomalies = Array.isArray(analysis?.anomalies)
    ? analysis.anomalies
    : Array.isArray(summary?.anomalies)
      ? summary.anomalies
      : []

  const trend = Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }))

  const recurring = subscriptions.map((item) => ({
    merchant: item.merchant,
    amount: item.averageCost ?? 0,
    frequency: item.frequency ?? 'monthly',
    category: item.category ?? 'Subscription',
    occurrences: item.occurrences ?? 1,
  }))

  const mappedDuplicates = duplicates.map((item) => ({
    group: item.group,
    services: Array.isArray(item.subscriptions) ? item.subscriptions : [item.merchant].filter(Boolean),
    potentialSavings: item.estimatedSavings ?? item.potentialSavings ?? 0,
  }))

  const totalSpend = spending.totalSpent ?? summary?.overview?.totalSpent ?? 0
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] ?? null
  const avgTransaction = spending.averageTransaction ?? (spending.totalTransactions ? totalSpend / spending.totalTransactions : 0)
  const largestExpense = spending.largestExpense ?? 0

  return {
    totals: categoryTotals,
    recurring,
    duplicates: mappedDuplicates,
    spikes: anomalies.map((item) => ({
      category: item.category,
      increase: item.increase ?? 0,
      current: item.current ?? 0,
      average: item.average ?? 0,
    })),
    trend,
    health: {
      score: summary?.health?.score ?? analysis?.healthScore?.score ?? 0,
      deductions: mapHealthToDeductions(summary?.health ?? analysis?.healthScore ?? {}),
    },
    overview: summary?.overview ?? {},
    totalSpend,
    topCategory,
    avgTransaction,
    largestExpense,
    potentialSavings: mappedDuplicates.reduce((sum, item) => sum + (item.potentialSavings || 0), 0),
  }
}

export function mapHealthToDeductions(health = {}) {
  const penalties = Array.isArray(health.penalties) ? health.penalties : []

  return penalties.map((penalty) => ({
    label: penalty.reason || 'Financial caution',
    points: penalty.amount ?? 0,
  }))
}
