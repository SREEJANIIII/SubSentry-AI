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
import { answerFollowUp, generateInsight } from './lib/analyze.js'
import { fetchJson } from './lib/api.js'
import { mapAnalysisToDashboard } from './lib/dashboard.js'
import './App.css'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [analysisPayload, setAnalysisPayload] = useState(null)
  const [fileName, setFileName] = useState('')
  const [active, setActive] = useState('overview')
  const [riskResult, setRiskResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [insight, setInsight] = useState('Upload a transaction CSV to generate the first report.')

  const dashboard = useMemo(() => mapAnalysisToDashboard(analysisPayload), [analysisPayload])
  const { totals, recurring, duplicates, spikes, trend, health, totalSpend, topCategory, avgTransaction, largestExpense, potentialSavings } = dashboard

  const insightText = useMemo(
    () => generateInsight({ totals, spikes, recurring, duplicates, health, riskResult }),
    [totals, spikes, recurring, duplicates, health, riskResult]
  )

  const buildSummaryPayload = () => ({
    overview: {
      totalSpent: totalSpend,
      totalTransactions: transactions.length,
      subscriptionCount: recurring.length,
      duplicateCount: duplicates.length,
      healthScore: health.score,
      healthGrade: health.score >= 80 ? 'A' : health.score >= 60 ? 'B' : 'C',
    },
    subscriptions: recurring,
    duplicates,
    anomalies: spikes,
    health: { score: health.score, grade: health.score >= 80 ? 'A' : health.score >= 60 ? 'B' : 'C' },
  })

  const handleData = async (rows, name) => {
    setTransactions(rows)
    setFileName(name)
    setError('')
    setRiskResult(null)
    setLoading(true)

    try {
      const payload = await fetchJson('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: rows }),
      })

      setAnalysisPayload(payload)
      
      const newDashboard = mapAnalysisToDashboard(payload)
      const freshSummary = {
        overview: {
          totalSpent: newDashboard.totalSpend,
          totalTransactions: rows.length,
          subscriptionCount: newDashboard.recurring.length,
          duplicateCount: newDashboard.duplicates.length,
          healthScore: newDashboard.health.score,
          healthGrade: newDashboard.health.score >= 80 ? 'A' : newDashboard.health.score >= 60 ? 'B' : 'C',
        },
        subscriptions: newDashboard.recurring,
        duplicates: newDashboard.duplicates,
        anomalies: newDashboard.spikes,
        health: { score: newDashboard.health.score, grade: newDashboard.health.score >= 80 ? 'A' : newDashboard.health.score >= 60 ? 'B' : 'C' },
      }

      const freshInsightText = generateInsight({ 
        totals: newDashboard.totals, 
        spikes: newDashboard.spikes, 
        recurring: newDashboard.recurring, 
        duplicates: newDashboard.duplicates, 
        health: newDashboard.health, 
        riskResult: null 
      })
      
      setInsight(freshInsightText)

      const gemmaPayload = await fetchJson('/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: freshSummary }),
      }).catch(() => null)

      if (gemmaPayload?.explanation) {
        setInsight(gemmaPayload.explanation)
      } else if (gemmaPayload?.data?.insight?.highlights) {
        const gemmaInsight = gemmaPayload.data.insight.highlights.join(' ') || freshInsightText
        setInsight(gemmaInsight)
      } else {
        setInsight(freshInsightText)
      }
    } catch (err) {
      setAnalysisPayload(null)
      setError(err.message || 'Unable to analyze that file.')
      setInsight('Upload a transaction CSV to generate the first report.')
    } finally {
      setLoading(false)
    }
  }

  const handleAsk = async (question) => {
    const fallback = answerFollowUp(question, { totals, duplicates, recurring, spikes })

    try {
      const payload = await fetchJson('/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: buildSummaryPayload(), question }),
      }).catch(() => null)

      const gemmaInsight = payload?.explanation || payload?.data?.insight?.highlights?.join(' ') || fallback
      setInsight(gemmaInsight)
      return gemmaInsight
    } catch {
      return fallback
    }
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="app-main">
        <TopBar
          fileName={fileName || 'No file loaded'}
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
            <UploadPanel onData={handleData} fileName={fileName} loading={loading} serverError={error} />
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
