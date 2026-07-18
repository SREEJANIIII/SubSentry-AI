import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report

dataset_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "datasets",
    "transactions.csv"
)

df = pd.read_csv(dataset_path)

print("Dataset Loaded\n")
print(df.head())
print()

df = df.drop(columns=[
    "transaction_id",
    "user_id",
    "date"
])

categorical_columns = [
    "merchant",
    "category",
    "payment_method",
    "city"
]

encoders = {}

for column in categorical_columns:

    encoder = LabelEncoder()

    df[column] = encoder.fit_transform(df[column])

    encoders[column] = encoder

encoder_path = os.path.join(
    os.path.dirname(__file__),
    "encoders.pkl"
)

joblib.dump(encoders, encoder_path)

print("Categorical Encoding Complete\n")

y_true = df["anomaly"]

X = df.drop(columns=["anomaly"])

print("Features\n")
print(X.head())
print()

model = IsolationForest(
    contamination=0.02,
    random_state=42
)

model.fit(X)

print("Model Trained Successfully\n")

predictions = model.predict(X)

# Isolation Forest returns:
#  1  -> Normal
# -1  -> Anomaly
predictions = [1 if p == -1 else 0 for p in predictions]

print("Classification Report\n")

print(
    classification_report(
        y_true,
        predictions
    )
)

model_path = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)

joblib.dump(
    model,
    model_path
)

print("\nModel Saved Successfully!")
print(f"Location: {model_path}")