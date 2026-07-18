import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './AIInsights.css'

export default function AIInsights({ insight, onAsk }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [asking, setAsking] = useState(false)

  const submit = async () => {
    if (!question.trim()) return
    setAsking(true)
    const response = await onAsk(question)
    setAnswer(response)
    setAsking(false)
  }

  return (
    <div className="card ai-card">
      <div className="ai-head">
        <div>
          <div className="eyebrow">Gemma · Generated Report</div>
          <h3 className="ai-title">AI Insights</h3>
        </div>
        <div className="ai-badge mono">summary only, no raw data sent</div>
      </div>

      <div className="ai-body">
        <ReactMarkdown>{insight}</ReactMarkdown>
      </div>

      <div className="ai-followup">
        <div className="ai-followup-label">Ask a follow-up</div>
        <div className="ai-followup-row">
          <input
            className="ai-input mono"
            placeholder="How can I save ₹1,000 next month?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <button className="btn-primary" onClick={submit} disabled={!question.trim() || asking}>
            {asking ? 'Thinking…' : 'Ask'}
          </button>
        </div>
        {answer && (
          <div className="ai-answer">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
