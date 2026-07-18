import { useState } from 'react'
import { fetchJson } from '../lib/api'
import './PaymentChecker.css'

export default function PaymentChecker({ onResult, result }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!value.trim()) return
    setLoading(true)
    setError('')

    try {
      const payload = await fetchJson('/api/payment-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: value }),
      })

      onResult(payload.data)
    } catch (err) {
      setError(err.message || 'Unable to assess payment risk.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card payment-card">
      <div className="eyebrow">Risk Assessment</div>
      <h3 className="payment-title">Payment Authenticity Checker</h3>
      <p className="payment-sub">
        Enter a UPI ID or payment link before you pay. This is a heuristic risk read, not a guarantee — verify anything flagged through an official channel.
      </p>

      <div className="payment-input-row">
        <input
          className="payment-input mono"
          placeholder="e.g. paytm-help-fast.in or name@upi"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
        />
        <button className="btn-primary" onClick={run} disabled={!value.trim() || loading}>
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {result && (
        <div className={`payment-result payment-result--${result.level.toLowerCase()}`}>
          <div className="payment-result-head">
            <div>
              <div className="payment-result-input mono">{result.input}</div>
              <div className="payment-result-type">{result.isUpi ? 'UPI ID' : result.isUrl ? 'URL' : 'Identifier'}</div>
            </div>
            <div className="payment-result-score">
              <div className="mono payment-result-score-num">{result.score}</div>
              <div className={`payment-result-level payment-result-level--${result.level.toLowerCase()}`}>{result.level} risk</div>
            </div>
          </div>
          <ul className="payment-reasons">
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
