import random
from faker import Faker
import pandas as pd
from datetime import datetime,timedelta
import os

fake = Faker("en_IN")

MERCHANTS = {
    "Food": [
        "Swiggy", "Zomato", "McDonald's", "KFC",
        "Domino's", "Pizza Hut", "Subway"
    ],

    "Shopping": [
        "Amazon", "Flipkart", "Myntra",
        "Ajio", "Croma", "Apple Store"
    ],

    "Travel": [
        "Uber", "Ola", "Rapido",
        "IRCTC"
    ],

    "Subscription": [
        "Netflix",
        "Spotify",
        "Prime Video",
        "Disney+ Hotstar"
    ],

    "Groceries": [
        "Blinkit",
        "BigBasket",
        "DMart",
        "Reliance Fresh"
    ],

    "Fuel": [
        "Indian Oil",
        "Shell",
        "HP Petrol",
        "Bharat Petroleum"
    ],

    "Bills": [
        "Jio",
        "Airtel",
        "ACT Fibernet",
        "BESCOM"
    ]
}

AMOUNT_RANGE = {

    "Food": (150, 900),

    "Shopping": (500, 12000),

    "Travel": (80, 1200),

    "Subscription": (99, 999),

    "Groceries": (500, 5000),

    "Fuel": (300, 3500),

    "Bills": (400, 6000)
}

PAYMENT_METHODS = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking"
]

CITIES = [
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Pune"
]

USER_TYPES = [
    "Student",
    "Working Professional",
    "Family"
]

NUM_USERS = 500
TRANSACTIONS = 100000

start_date = datetime(2025, 1, 1)
end_date = datetime(2026, 7, 1)

date_difference = (end_date - start_date).days

rows = []

for txn in range(TRANSACTIONS):

    user = random.randint(1, NUM_USERS)    
    category = random.choice(list(MERCHANTS.keys()))
    merchant = random.choice(MERCHANTS[category])
    low, high = AMOUNT_RANGE[category]
    amount = round(random.uniform(low, high), 2)

    anomaly = 0

    if random.random() < 0.02:
        amount *= random.randint(8, 20)
        anomaly = 1
    
    transaction_date = start_date + timedelta(
        days = random.randint(0, date_difference)
    )

    hour = random.randint(0, 24)

    weekday = transaction_date.weekday()

    weekend = 1 if weekday > 5 else 0

    rows.append({

        "transaction_id": f"TXN{txn+1:06}",

        "user_id": f"USER{user:03}",

        "date": transaction_date.strftime("%Y-%m-%d"),

        "merchant": merchant,

        "category": category,

        "amount": round(amount, 2),

        "payment_method": random.choice(PAYMENT_METHODS),

        "city": random.choice(CITIES),

        "hour": hour,

        "weekday": weekday,

        "is_weekend": weekend,

        "anomaly": anomaly

    })

df = pd.DataFrame(rows)

# Save original dataset
output_path = os.path.join(
    os.path.dirname(__file__),
    "transactions.csv"
)

df.to_csv(output_path, index=False)

# Create a copy without user_id
df_no_user = df.drop(columns=["user_id"])

output_path_no_user = os.path.join(
    os.path.dirname(__file__),
    "transactions_without_userid.csv"
)

df_no_user.to_csv(output_path_no_user, index=False)

print("Datasets created successfully!")