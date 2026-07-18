import { useRef, useState } from 'react'
import Papa from 'papaparse'
import './UploadPanel.css'

export default function UploadPanel({ onData, onUseSample, fileName }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    setError(null)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((r) => ({
            date: r.Date || r.date,
            merchant: r.Merchant || r.merchant,
            category: r.Category || r.category,
            amount: Number(r.Amount || r.amount),
          }))
          .filter((r) => r.date && r.merchant && !Number.isNaN(r.amount))

        if (rows.length === 0) {
          setError('Could not find valid rows. Expected columns: Date, Merchant, Category, Amount.')
          return
        }
        onData(rows, file.name)
      },
      error: () => setError('Could not parse that file as CSV.'),
    })
  }

  return (
    <div className="upload-panel card" id="upload-panel">
      <div
        className={`upload-dropzone ${dragActive ? 'is-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        <div className="upload-icon">↑</div>
        <div className="upload-title">Drop a transaction CSV, or browse</div>
        <div className="upload-sub mono">Date, Merchant, Category, Amount</div>

        <div className="upload-actions">
          <button className="btn-primary" onClick={() => inputRef.current?.click()}>
            Choose CSV
          </button>
          <button className="btn-ghost" onClick={onUseSample}>
            Use sample data
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <div className="upload-error">{error}</div>}
      {fileName && !error && (
        <div className="upload-status mono">
          <span className="upload-status-dot" /> Loaded {fileName}
        </div>
      )}
    </div>
  )
}
