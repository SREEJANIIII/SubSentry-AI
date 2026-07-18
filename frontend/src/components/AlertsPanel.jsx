import './AlertsPanel.css'

export default function AlertsPanel({ spikes, duplicates, riskResult }) {
  const alerts = []

  spikes.forEach((s) =>
    alerts.push({
      kind: 'Spending Anomaly',
      detail: `${s.category} increased ${s.increase}% vs. recent average (₹${s.average.toLocaleString('en-IN')} → ₹${s.current.toLocaleString('en-IN')})`,
      severity: s.increase > 80 ? 'high' : 'medium',
    })
  )

  duplicates.forEach((d) =>
    alerts.push({
      kind: 'Duplicate Subscription',
      detail: `${d.services.join(' & ')} overlap in ${d.group.toLowerCase()} — save ~₹${d.potentialSavings.toLocaleString('en-IN')}/mo`,
      severity: 'medium',
    })
  )

  if (riskResult && riskResult.level !== 'Low') {
    alerts.push({
      kind: 'High-Risk Payment',
      detail: `${riskResult.input} scored ${riskResult.score}/100 risk`,
      severity: riskResult.level === 'High' ? 'high' : 'medium',
    })
  }

  return (
    <div className="card alerts-card">
      <div className="eyebrow">Flagged Items</div>
      <h3 className="alerts-title">Alerts</h3>

      {alerts.length === 0 ? (
        <div className="alerts-empty mono">No active alerts — everything checks out.</div>
      ) : (
        <div className="alerts-list">
          {alerts.map((a, i) => (
            <div className={`alert-item alert-item--${a.severity}`} key={i}>
              <span className="alert-dot" />
              <div>
                <div className="alert-kind">{a.kind}</div>
                <div className="alert-detail">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
