import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import './SpendingCharts.css'

const SLICE_COLORS = ['#E3A23D', '#6FBF8B', '#D9694F', '#8FA895', '#F4C05C', '#4E7A5C']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip mono">
      {label && <div className="chart-tooltip-label">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="chart-tooltip-row">
          <span>{p.name}</span>
          <span>₹{Math.round(p.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

export default function SpendingCharts({ totals, trend }) {
  const pieData = Object.entries(totals).map(([name, value]) => ({ name, value }))

  return (
    <div className="charts-row">
      <div className="card chart-card">
        <div className="chart-card-head">
          <div>
            <div className="eyebrow">By Category</div>
            <h3 className="chart-card-title">Spending Breakdown</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={2}
              stroke="var(--bg-panel)"
              strokeWidth={2}
            >
              {pieData.map((entry, i) => (
                <Cell key={entry.name} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          {pieData.map((entry, i) => (
            <div className="chart-legend-item" key={entry.name}>
              <span className="chart-legend-dot" style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }} />
              <span className="chart-legend-name">{entry.name}</span>
              <span className="chart-legend-value mono">₹{Math.round(entry.value).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-card-head">
          <div>
            <div className="eyebrow">Over Time</div>
            <h3 className="chart-card-title">Spending Trend</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={trend} margin={{ top: 8, right: 14, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 5" stroke="var(--line-soft)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--ink-faint)" fontSize={11} tickLine={false} axisLine={{ stroke: 'var(--line)' }} />
            <YAxis stroke="var(--ink-faint)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="total" name="Total" stroke="var(--gold)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--gold-bright)', strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-caption">Monthly total across all transactions</div>
      </div>
    </div>
  )
}
