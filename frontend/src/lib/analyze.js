// Lightweight, in-browser stand-in for the Node/Express analysis pipeline
// described in the project architecture. In production this logic lives on
// the backend (Spending Analyzer / Subscription Analyzer / Payment Checker)
// and only the summarized JSON is sent to Gemma. Here it runs client-side
// against the uploaded CSV so the dashboard is fully demoable standalone.

const DUPLICATE_GROUPS = {
  Entertainment: ['Netflix', 'Prime Video', 'Hotstar', 'Disney+'],
  Music: ['Spotify', 'Apple Music', 'YouTube Music'],
}

export const SAMPLE_TRANSACTIONS = [
  { date: '2026-06-01', merchant: 'Swiggy', category: 'Food', amount: 420 },
  { date: '2026-06-02', merchant: 'Netflix', category: 'Subscription', amount: 649 },
  { date: '2026-06-03', merchant: 'Amazon', category: 'Shopping', amount: 2199 },
  { date: '2026-06-04', merchant: 'Uber', category: 'Travel', amount: 280 },
  { date: '2026-06-05', merchant: 'Spotify', category: 'Subscription', amount: 119 },
  { date: '2026-06-08', merchant: 'Zomato', category: 'Food', amount: 560 },
  { date: '2026-06-10', merchant: 'Amazon', category: 'Shopping', amount: 1450 },
  { date: '2026-06-14', merchant: 'YouTube Music', category: 'Subscription', amount: 129 },
  { date: '2026-06-18', merchant: 'Ola', category: 'Travel', amount: 340 },
  { date: '2026-06-21', merchant: 'BigBasket', category: 'Food', amount: 1800 },
  { date: '2026-07-01', merchant: 'Swiggy', category: 'Food', amount: 480 },
  { date: '2026-07-02', merchant: 'Netflix', category: 'Subscription', amount: 649 },
  { date: '2026-07-03', merchant: 'Amazon', category: 'Shopping', amount: 4200 },
  { date: '2026-07-04', merchant: 'Uber', category: 'Travel', amount: 260 },
  { date: '2026-07-05', merchant: 'Spotify', category: 'Subscription', amount: 119 },
  { date: '2026-07-06', merchant: 'Myntra', category: 'Shopping', amount: 2600 },
  { date: '2026-07-09', merchant: 'YouTube Music', category: 'Subscription', amount: 129 },
  { date: '2026-07-12', merchant: 'Zomato', category: 'Food', amount: 610 },
  { date: '2026-07-15', merchant: 'Prime Video', category: 'Subscription', amount: 299 },
]

function monthOf(dateStr) {
  return dateStr.slice(0, 7)
}

export function categoryTotals(transactions) {
  const totals = {}
  for (const t of transactions) {
    totals[t.category] = (totals[t.category] || 0) + Number(t.amount)
  }
  return totals
}

export function detectRecurring(transactions) {
  const byMerchant = {}
  for (const t of transactions) {
    if (!byMerchant[t.merchant]) byMerchant[t.merchant] = []
    byMerchant[t.merchant].push(t)
  }
  const recurring = []
  for (const [merchant, entries] of Object.entries(byMerchant)) {
    if (entries.length < 2) continue
    const amounts = entries.map((e) => Number(e.amount))
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const withinRange = amounts.every((a) => Math.abs(a - avg) / avg < 0.15)
    if (withinRange) {
      recurring.push({
        merchant,
        amount: Math.round(avg),
        frequency: 'Monthly',
        occurrences: entries.length,
        category: entries[0].category,
      })
    }
  }
  return recurring
}

export function detectDuplicates(recurring) {
  const found = []
  for (const [group, members] of Object.entries(DUPLICATE_GROUPS)) {
    const matches = recurring.filter((r) => members.includes(r.merchant))
    if (matches.length > 1) {
      const cheapest = [...matches].sort((a, b) => a.amount - b.amount)[0]
      found.push({
        group,
        services: matches.map((m) => m.merchant),
        potentialSavings: cheapest.amount,
      })
    }
  }
  return found
}

export function detectSpike(transactions) {
  const months = [...new Set(transactions.map((t) => monthOf(t.date)))].sort()
  if (months.length < 2) return []
  const latest = months[months.length - 1]
  const prior = months.slice(0, -1)

  const byCategoryMonth = {}
  for (const t of transactions) {
    const m = monthOf(t.date)
    byCategoryMonth[t.category] = byCategoryMonth[t.category] || {}
    byCategoryMonth[t.category][m] = (byCategoryMonth[t.category][m] || 0) + Number(t.amount)
  }

  const spikes = []
  for (const [category, byMonth] of Object.entries(byCategoryMonth)) {
    const currentAmt = byMonth[latest] || 0
    const priorAmts = prior.map((m) => byMonth[m] || 0).filter((v) => v > 0)
    if (priorAmts.length === 0) continue
    const avgPrior = priorAmts.reduce((a, b) => a + b, 0) / priorAmts.length
    if (avgPrior === 0) continue
    const increase = ((currentAmt - avgPrior) / avgPrior) * 100
    if (increase > 50) {
      spikes.push({ category, increase: Math.round(increase), current: currentAmt, average: Math.round(avgPrior) })
    }
  }
  return spikes
}

const SUSPICIOUS_KEYWORDS = ['gift', 'reward', 'urgent', 'verify', 'claim', 'bonus', 'free', 'winner']
const KNOWN_BRANDS = ['paytm', 'gpay', 'googlepay', 'phonepe', 'amazon', 'flipkart', 'sbi', 'hdfc', 'icici']

export function checkPaymentRisk(input) {
  const value = input.trim().toLowerCase()
  if (!value) return null

  let score = 0
  const reasons = []

  const hasHttps = value.startsWith('https://')
  const looksLikeUrl = value.includes('.') && (value.includes('http') || value.includes('/'))
  const looksLikeUpi = value.includes('@') && !value.includes(' ')

  if (looksLikeUrl && !hasHttps) {
    score += 25
    reasons.push('Connection is not secured with HTTPS')
  }

  for (const word of SUSPICIOUS_KEYWORDS) {
    if (value.includes(word)) {
      score += 20
      reasons.push(`Contains urgency/incentive keyword "${word}"`)
      break
    }
  }

  for (const brand of KNOWN_BRANDS) {
    if (value.includes(brand)) {
      const cleaned = value.replace(/[^a-z0-9]/g, '')
      const exactBrand = cleaned.includes(brand + 'com') || cleaned === brand
      if (!exactBrand) {
        score += 30
        reasons.push(`Resembles known brand "${brand}" but does not match it exactly`)
      }
      break
    }
  }

  if (/[0-9]/.test(value.replace(brandsRegexSafe(), '')) && looksLikeUrl) {
    score += 10
    reasons.push('Domain contains unusual numeric substitutions')
  }

  if (looksLikeUpi && value.split('@')[0].length > 18) {
    score += 15
    reasons.push('Unusually long UPI handle')
  }

  if (reasons.length === 0) {
    score += 8
    reasons.push('No strong red flags found in structure, but external verification is still recommended')
  }

  score = Math.min(score, 96)

  let level = 'Low'
  if (score >= 60) level = 'High'
  else if (score >= 30) level = 'Medium'

  return { input, score, level, reasons, isUrl: looksLikeUrl, isUpi: looksLikeUpi }
}

function brandsRegexSafe() {
  return new RegExp(KNOWN_BRANDS.join('|'), 'g')
}

export function financialHealthScore({ totals, recurring, duplicates, spikes, riskScore }) {
  let score = 100
  const deductions = []

  const totalSpend = Object.values(totals).reduce((a, b) => a + b, 0)
  const subscriptionSpend = totals['Subscription'] || 0

  if (spikes.length > 0) {
    const d = Math.min(15, spikes.length * 8)
    score -= d
    deductions.push({ label: 'Spending anomaly detected', points: d })
  }

  if (duplicates.length > 0) {
    const d = Math.min(10, duplicates.length * 10)
    score -= d
    deductions.push({ label: 'Overlapping subscriptions', points: d })
  }

  if (riskScore && riskScore >= 60) {
    score -= 20
    deductions.push({ label: 'High-risk payment flagged', points: 20 })
  }

  if (recurring.length >= 4) {
    score -= 10
    deductions.push({ label: 'High subscription load', points: 10 })
  }

  if (totalSpend > 0 && subscriptionSpend / totalSpend > 0.25) {
    score -= 8
    deductions.push({ label: 'Subscriptions exceed 25% of spend', points: 8 })
  }

  return { score: Math.max(0, Math.round(score)), deductions }
}

export function generateInsight({ totals, spikes, recurring, duplicates, health, riskResult }) {
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
  const [topCategory, topAmount] = sorted[0] || ['spending', 0]
  const lines = []

  lines.push(
    `Your largest expense category this period is ${topCategory} at ₹${topAmount.toLocaleString('en-IN')}.`
  )

  if (spikes.length > 0) {
    const s = spikes[0]
    lines.push(
      `${s.category} spending rose ${s.increase}% against your recent average (₹${s.average.toLocaleString('en-IN')} → ₹${s.current.toLocaleString('en-IN')}), which is the main driver behind this month's change.`
    )
  } else {
    lines.push('No unusual spending spikes were detected this period.')
  }

  if (duplicates.length > 0) {
    const d = duplicates[0]
    lines.push(
      `You're maintaining overlapping ${d.group.toLowerCase()} subscriptions (${d.services.join(', ')}). Cancelling the cheaper of the two could save roughly ₹${d.potentialSavings.toLocaleString('en-IN')} per month.`
    )
  } else if (recurring.length > 0) {
    lines.push(`${recurring.length} recurring subscription${recurring.length > 1 ? 's were' : ' was'} identified, with no overlapping services.`)
  }

  if (riskResult && riskResult.level !== 'Low') {
    lines.push(
      `A payment request you checked came back ${riskResult.level.toLowerCase()} risk (score ${riskResult.score}/100) — verify it through an official channel before proceeding.`
    )
  }

  lines.push(`Financial Health Score: ${health.score}/100.`)

  return lines.join(' ')
}

// Simple keyword-driven responder standing in for a live Gemma call on
// follow-up questions in the demo (Step 10: "How can I save ₹1,000 next
// month?"). Swap this for a real request to the backend's /insights
// endpoint once Gemma is wired up.
export function answerFollowUp(question, { totals, duplicates, recurring, spikes }) {
  const q = question.toLowerCase()

  if (q.includes('save')) {
    const parts = []
    if (duplicates.length > 0) {
      const d = duplicates[0]
      parts.push(`Cancel the cheaper ${d.group.toLowerCase()} service between ${d.services.join(' and ')} — that alone covers roughly ₹${d.potentialSavings.toLocaleString('en-IN')}.`)
    }
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
    if (sorted[0]) {
      parts.push(`Trimming ${sorted[0][0]} spend by even 10% would free up close to ₹${Math.round(sorted[0][1] * 0.1).toLocaleString('en-IN')}.`)
    }
    return parts.length ? parts.join(' ') : 'Reducing your top spending category by 10-15% is the fastest lever available right now.'
  }

  if (q.includes('subscription') || q.includes('recurring')) {
    return recurring.length
      ? `You have ${recurring.length} recurring merchant${recurring.length > 1 ? 's' : ''}: ${recurring.map((r) => r.merchant).join(', ')}.`
      : 'No recurring subscriptions were detected in this dataset.'
  }

  if (q.includes('risk') || q.includes('safe')) {
    return 'Payment risk is assessed separately per link or UPI ID in the Payment Check section — nothing in the uploaded transactions themselves is flagged as unsafe.'
  }

  if (q.includes('spike') || q.includes('anomaly') || q.includes('increase')) {
    return spikes.length
      ? spikes.map((s) => `${s.category} rose ${s.increase}% against its recent average.`).join(' ')
      : 'No category shows an increase sharp enough to flag as an anomaly this period.'
  }

  return 'Based on the current period, focus on the flagged overlaps and the top spending category above — those are the two levers with the clearest, fastest impact.'
}
