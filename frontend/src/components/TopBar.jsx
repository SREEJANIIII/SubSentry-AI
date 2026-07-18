import './TopBar.css'

export default function TopBar({ onUploadClick, fileName }) {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">Compliance Dashboard</div>
        <h1 className="topbar-title">Financial Risk Overview</h1>
      </div>

      <div className="topbar-actions">
        {fileName && (
          <div className="topbar-file mono">
            <span className="topbar-file-dot" />
            {fileName}
          </div>
        )}
        <button className="btn-primary" onClick={onUploadClick}>
          Upload Transactions
        </button>
      </div>
    </header>
  )
}
