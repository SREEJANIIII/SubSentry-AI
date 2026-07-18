import './Sidebar.css'

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'charts', label: 'Spending' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'payment-check', label: 'Payment Check' },
  { id: 'ai-report', label: 'AI Report'},
]

export default function Sidebar({ active, onNavigate }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onNavigate?.(id)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-mark">SS</div>
        <div>
          <div className="sidebar-name">SubSentry</div>
          <div className="sidebar-tag">Financial Risk Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${active === item.id ? 'is-active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            <span className="sidebar-link-mark mono">{item.mark}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Analysis engine</div>
        <div className="sidebar-footer-value mono">Gemma · live</div>
      </div>
    </aside>
  )
}
