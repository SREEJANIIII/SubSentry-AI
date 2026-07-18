import './HealthStamp.css'

export default function HealthStamp({ score, deductions }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const tone = score >= 75 ? 'good' : score >= 50 ? 'watch' : 'risk'

  return (
    <div className="stamp-card card">
      <div className="stamp-wrap">
        <svg viewBox="0 0 140 140" className="stamp-svg">
          <defs>
            <path id="stampRing" d="M 70,70 m -58,0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0" />
          </defs>
          <text className="stamp-ring-text mono">
            <textPath href="#stampRing" startOffset="0%">
              SUBSENTRY · COMPLIANCE VERIFIED · SUBSENTRY · COMPLIANCE VERIFIED ·
            </textPath>
          </text>
          <circle cx="70" cy="70" r="54" className="stamp-track" />
          <circle
            cx="70"
            cy="70"
            r="54"
            className={`stamp-progress stamp-progress--${tone}`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="stamp-center">
          <div className={`stamp-score mono stamp-score--${tone}`}>{score}</div>
          <div className="stamp-score-label">/ 100</div>
        </div>
      </div>

      <div className="stamp-details">
        <div className="eyebrow">Financial Health Score</div>
        <p className="stamp-desc">
          Composite score across spending discipline, subscription overlap, and payment risk exposure.
        </p>
        {deductions.length > 0 ? (
          <ul className="stamp-deductions">
            {deductions.map((d) => (
              <li key={d.label}>
                <span>{d.label}</span>
                <span className="mono stamp-deduction-points">−{d.points}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="stamp-clean mono">No deductions — clean record this period</div>
        )}
      </div>
    </div>
  )
}
