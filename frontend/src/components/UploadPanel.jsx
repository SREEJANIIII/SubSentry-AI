import { useRef, useState } from 'react'
import './UploadPanel.css'

export default function UploadPanel({ onData, fileName, loading, serverError }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (file) => {
    if (!file) return
    setError(null)
    setDragActive(false)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/csv/upload', {
        method: 'POST',
        body: formData,
      })
      
      const payload = await response.json()
      
      if (!response.ok) {
        throw new Error(payload.message || 'Upload failed')
      }
      
      const rows = payload?.data?.transactions
      
      if (!rows || rows.length === 0) {
        setError('Could not find valid rows. Expected columns like Date, Merchant, Category, Amount.')
        return
      }

      onData(rows, file.name)
    } catch (err) {
      setError(err.message || 'Could not upload that file.')
    }
  }

  const displayError = serverError || error

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
            {loading ? 'Analyzing…' : 'Choose CSV'}
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

      {displayError && <div className="upload-error">{displayError}</div>}
      {fileName && !displayError && (
        <div className="upload-status mono">
          <span className="upload-status-dot" /> {loading ? 'Analyzing upload…' : `Loaded ${fileName}`}
        </div>
      )}
    </div>
  )
}
