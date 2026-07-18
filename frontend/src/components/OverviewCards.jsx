import './OverviewCards.css'

function fmt(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function OverviewCards({ totalSpend, topCategory, avgTransaction, largestExpense, subscriptionCount, potentialSavings }) {
  const items = [
    { label: 'Total Spending', value: fmt(totalSpend), note: 'this period' },
    { label: 'Top Category', value: topCategory?.[0] || '—', note: topCategory ? fmt(topCategory[1]) : '' },
    { label: 'Avg. Transaction', value: fmt(avgTransaction), note: 'per entry' },
    { label: 'Largest Expense', value: fmt(largestExpense), note: 'single transaction' },
    { label: 'Active Subscriptions', value: subscriptionCount, note: 'recurring merchants' },
    { label: 'Potential Savings', value: fmt(potentialSavings), note: 'from overlaps', tone: potentialSavings > 0 ? 'gold' : undefined },
  ]

  return (
    <div className="overview-grid">
      {items.map((item) => (
        <div className="overview-card card" key={item.label}>
          <div className="overview-label">{item.label}</div>
          <div className={`overview-value mono ${item.tone ? `overview-value--${item.tone}` : ''}`}>{item.value}</div>
          {item.note && <div className="overview-note">{item.note}</div>}
        </div>
      ))}
    </div>
  )
}
