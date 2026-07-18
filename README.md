# 💰 Smart Financial Analyzer

An AI-powered personal finance assistant that transforms raw transaction data into meaningful financial insights. Upload your transaction history as a CSV, and the application automatically analyzes your spending, detects recurring subscriptions, identifies potential savings, evaluates financial health, and generates personalized recommendations using **Gemma AI**.

---

## 🚀 Features

### 📂 CSV Transaction Upload
- Upload bank transaction data in CSV format.
- Automatic CSV parsing and validation.
- Data normalization for accurate analysis.

### 📊 Spending Analysis
- Total spending overview
- Category-wise expense breakdown
- Highest & lowest spending categories
- Average transaction value
- Monthly spending trends

### 🏪 Merchant Analytics
- Top merchants by spending
- Merchant visit frequency
- Average spend per merchant
- Largest purchase per merchant

### 🔄 Subscription Detection
- Detect recurring subscriptions
- Estimate renewal frequency
- Monthly subscription cost

### 💸 Duplicate Subscription Detection
- Detect overlapping subscriptions
- Estimate potential monthly savings
- Group subscriptions by service type

### 🕒 Time-Based Insights
- Spending by hour
- Spending by weekday
- Weekend vs weekday spending
- Most active spending periods

### 💳 Payment Method Analysis
- Spending by payment method
- Usage percentages
- Average transaction amount


### ❤️ Financial Health Score
- Rule-based financial scoring
- Personalized strengths & weaknesses
- Spending behavior evaluation
- Improvement suggestions

### 🤖 AI Financial Advisor
Powered by **Gemma AI**

Generates:
- Executive Summary
- Spending Insights
- Saving Recommendations
- Financial Risks
- Monthly Action Plan

### 📈 Interactive Dashboard
- Overview cards
- Pie charts
- Spending trends
- Subscription summary
- Alerts
- AI recommendations

---

# 🏗️ Project Architecture

```text
                    User
                      │
                      ▼
              Upload Transaction CSV
                      │
                      ▼
              React Frontend
                      │
                      ▼
          Express.js Backend API
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 CSV Parser   Financial Analysis   AI Service
                      │
      ┌───────────────┼─────────────────────────────────────────────┐
      ▼               ▼              ▼             ▼               ▼
 Spending      Merchant      Subscription   Payment        Health
 Analysis      Analytics      Detection      Analysis       Score
                      │
                      ▼
            Financial Summary Object
                      │
                      ▼
                  Gemma AI
                      │
                      ▼
          Human-Friendly Recommendations
                      │
                      ▼
               React Dashboard
```

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Recharts

## Backend
- Node.js
- Express.js
- Multer
- csv-parser
- Axios

## AI
- Gemma AI

## Machine Learning
- Python (Anomaly Detection Service)

---

# 📂 Project Structure

```text
project/

├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── charts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── uploads/
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

# 📄 CSV Format

```csv
transaction_id,date,merchant,category,amount,payment_method,city,hour,weekday,is_weekend,anomaly
TXN000010,2025-01-28,Croma,Shopping,6877.20,Debit Card,Mumbai,12,1,0,0
TXN000011,2025-06-08,Croma,Shopping,2587.06,Net Banking,Pune,15,6,1,0
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/smart-financial-analyzer.git

cd smart-financial-analyzer
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔄 Workflow

1. Upload a transaction CSV.
2. Backend parses and validates the data.
3. Financial analysis services process the transactions.
4. A structured financial summary is generated.
5. Gemma AI converts the summary into personalized financial insights.
6. Results are displayed on an interactive dashboard.

---

# 📊 Analytics Generated

- 📈 Total Spending
- 🥧 Category Breakdown
- 📅 Monthly Trends
- 🏪 Merchant Analysis
- 🔄 Subscription Detection
- 💸 Duplicate Subscription Detection
- 💳 Payment Method Analysis
- 🏙️ City Spending
- ❤️ Financial Health Score
- 🤖 AI Recommendations

---

# 🔮 Future Enhancements

- Bank API Integration
- OCR for PDF Statements
- Budget Planner
- Investment Insights
- Savings Goal Tracker
- Multi-user Authentication
- Real-time Transaction Monitoring
- Advanced ML Anomaly Detection
- Email & WhatsApp Reports

---

# 👥 Team

Built with ❤️ during a Hackathon.

Ruhaan Narang
Sreejani Bhattacharya
Nihal Reddy K
Ritisha Patra

---

# 📜 License

This project is developed for educational and hackathon purposes.

Feel free to fork, learn from, and improve it.
