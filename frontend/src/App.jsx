import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import HealthStamp from './components/HealthStamp.jsx'
import UploadPanel from './components/UploadPanel.jsx'
import OverviewCards from './components/OverviewCards.jsx'
import SpendingCharts from './components/SpendingCharts.jsx'
import SubscriptionsPanel from './components/SubscriptionsPanel.jsx'
import AlertsPanel from './components/AlertsPanel.jsx'
import PaymentChecker from './components/PaymentChecker.jsx'
import AIInsights from './components/AIInsights.jsx'
import {
  SAMPLE_TRANSACTIONS,
  categoryTotals,
  detectRecurring,
  detectDuplicates,
  detectSpike,
  financialHealthScore,
  generateInsight,
  answerFollowUp,
} from './lib/analyze.js'
import './App.css'

function monthlyTrend(transactions) {
  const byMonth = {}
  for (const t of transactions) {
    const m = t.date.slice(0, 7)
    byMonth[m] = (byMonth[m] || 0) + Number(t.amount)
  }
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }))
}

export default function App() {
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS)
  const [fileName, setFileName] = useState('sample-transactions.csv')
  const [active, setActive] = useState('overview')
  const [riskResult, setRiskResult] = useState(null)

  const totals = useMemo(() => categoryTotals(transactions), [transactions])
  const recurring = useMemo(() => detectRecurring(transactions), [transactions])
  const duplicates = useMemo(() => detectDuplicates(recurring), [recurring])
  const spikes = useMemo(() => detectSpike(transactions), [transactions])
  const trend = useMemo(() => monthlyTrend(transactions), [transactions])

  const health = useMemo(
    () => financialHealthScore({ totals, recurring, duplicates, spikes, riskScore: riskResult?.score }),
    [totals, recurring, duplicates, spikes, riskResult]
  )

  const insight = useMemo(
    () => generateInsight({ totals, spikes, recurring, duplicates, health, riskResult }),
    [totals, spikes, recurring, duplicates, health, riskResult]
  )

  const totalSpend = Object.values(totals).reduce((a, b) => a + b, 0)
  const topCategory = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]
  const avgTransaction = transactions.length ? totalSpend / transactions.length : 0
  const largestExpense = transactions.reduce((max, t) => Math.max(max, Number(t.amount)), 0)
  const potentialSavings = duplicates.reduce((sum, d) => sum + d.potentialSavings, 0)

  const handleData = (rows, name) => {
    setTransactions(rows)
    setFileName(name)
    setRiskResult(null)
  }

  const handleAsk = async (question) => {
    await new Promise((r) => setTimeout(r, 500))
    return answerFollowUp(question, { totals, duplicates, recurring, spikes })
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="app-main">
        <TopBar
          fileName={fileName}
          onUploadClick={() => document.getElementById('upload-panel')?.scrollIntoView({ behavior: 'smooth' })}
        />

        <div className="app-content">
          <section id="overview" className="section">
            <HealthStamp score={health.score} deductions={health.deductions} />
            <div className="section-spacer" />
            <OverviewCards
              totalSpend={totalSpend}
              topCategory={topCategory}
              avgTransaction={avgTransaction}
              largestExpense={largestExpense}
              subscriptionCount={recurring.length}
              potentialSavings={potentialSavings}
            />
            <div className="section-spacer" />
            <UploadPanel onData={handleData} onUseSample={() => handleData(SAMPLE_TRANSACTIONS, 'sample-transactions.csv')} fileName={fileName} />
          </section>

          <section id="charts" className="section">
            <div className="section-heading">
              <div className="eyebrow"></div>
              <h2>Spending Analysis</h2>
            </div>
            <SpendingCharts totals={totals} trend={trend} />
          </section>

          <section id="subscriptions" className="section">
            <div className="section-heading">
              <div className="eyebrow"></div>
              <h2>Subscriptions &amp; Overlaps</h2>
            </div>
            <SubscriptionsPanel recurring={recurring} duplicates={duplicates} />
          </section>

          <section id="alerts" className="section">
            <div className="section-heading">
              <div className="eyebrow"></div>
              <h2>Alerts</h2>
            </div>
            <AlertsPanel spikes={spikes} duplicates={duplicates} riskResult={riskResult} />
          </section>

          <section id="payment-check" className="section">
            <div className="section-heading">
              <div className="eyebrow"></div>
              <h2>Payment Check</h2>
            </div>
            <PaymentChecker result={riskResult} onResult={setRiskResult} />
          </section>

          <section id="ai-report" className="section">
            <div className="section-heading">
              <div className="eyebrow"></div>
              <h2>AI Report</h2>
            </div>
            <AIInsights insight={insight} onAsk={handleAsk} />
          </section>

          <footer className="app-footer mono">SubSentry AI — financial risk intelligence, generated for demo purposes only.</footer>
        </div>
      </div>
    </div>
  )
}
