# SubSentry AI — Frontend

React (JavaScript, no TypeScript) dashboard for the SubSentry AI hackathon
project: CSV upload, spending analysis, subscription/duplicate detection,
spending-spike alerts, a payment authenticity checker, and a Gemma-style AI
report — all wired to run standalone in the browser with a client-side
analysis engine (`src/lib/analyze.js`) that mirrors the Node/Express backend
described in the architecture doc.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. Loads with sample data pre-populated —
click **Use sample data** any time, or drag in a real CSV
(`Date, Merchant, Category, Amount` columns).

## Wiring in the real backend / Gemma

Everything in `src/lib/analyze.js` currently runs in the browser so the UI
works with zero backend. To connect the real pipeline:

1. Replace the CSV parse in `UploadPanel.jsx` with a `POST` to your
   Express `/upload` endpoint, and set `transactions` from the response.
2. Replace `generateInsight()` / `answerFollowUp()` in `App.jsx` with a
   fetch to your `/insights` endpoint that calls Gemma with the summarized
   JSON (not raw transactions).
3. `checkPaymentRisk()` in `analyze.js` is the rule-based heuristic from
   Step 6 — swap in any server-side check the same way if you add one.

## Structure

```
src/
  App.jsx                 # layout + state, wires everything together
  lib/analyze.js           # spending/subscription/risk/health-score logic
  components/
    Sidebar, TopBar
    HealthStamp             # financial health score seal
    UploadPanel              # CSV upload / drag-drop
    OverviewCards             # summary stat tiles
    SpendingCharts             # pie + line charts (recharts)
    SubscriptionsPanel          # recurring charges + duplicate overlaps
    AlertsPanel                  # spikes, overlaps, high-risk payments
    PaymentChecker                 # UPI/link risk checker
    AIInsights                      # Gemma report + follow-up question
```

## Theme

Dark green background (`#08170F`) with warm gold/amber accents
(`#E3A23D` / `#F4C05C`), `Fraunces` for display type, `Inter` for body,
`IBM Plex Mono` for ledger/data. Tokens live in `src/index.css`.
