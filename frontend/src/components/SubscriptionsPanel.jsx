import './SubscriptionsPanel.css'

export default function SubscriptionsPanel({ recurring, duplicates }) {
  const dupMerchants = new Set(duplicates.flatMap((d) => d.services))

  return (
    <div className="card subs-card">
      <div className="subs-head">
        <div>
          <div className="eyebrow">Recurring Charges</div>
          <h3 className="subs-title">Subscriptions</h3>
        </div>
        <div className="subs-count mono">{recurring.length} detected</div>
      </div>

      <div className="subs-ledger">
        <div className="subs-row subs-row--head mono">
          <span>Merchant</span>
          <span>Category</span>
          <span>Frequency</span>
          <span className="subs-amt">Amount</span>
        </div>
        {recurring.map((r) => (
          <div className="subs-row" key={r.merchant}>
            <span className="subs-merchant">
              {r.merchant}
              {dupMerchants.has(r.merchant) && <span className="subs-flag">overlap</span>}
            </span>
            <span className="subs-muted">{r.category}</span>
            <span className="subs-muted">{r.frequency}</span>
            <span className="subs-amt mono">₹{r.amount.toLocaleString('en-IN')}</span>
          </div>
        ))}
        {recurring.length === 0 && (
          <div className="subs-empty">No recurring merchants detected in this dataset yet.</div>
        )}
      </div>

      {duplicates.length > 0 && (
        <div className="subs-duplicates">
          {duplicates.map((d) => (
            <div className="dup-row" key={d.group}>
              <div className="dup-group">{d.group} overlap</div>
              <div className="dup-services">{d.services.join(' · ')}</div>
              <div className="dup-savings mono">save ~₹{d.potentialSavings.toLocaleString('en-IN')}/mo</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
