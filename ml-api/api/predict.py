import os
import joblib
import pandas as pd

from fastapi import FastAPI

app = FastAPI()

model_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "model.pkl"
)

model = joblib.load(model_path)

encoder_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "encoders.pkl"
)

encoders = joblib.load(encoder_path)

@app.get("/")
def home():

    return {
        "message": "Smart Finance ML API is running!"
    }

@app.get("/options")
def get_options():

    return {

        "merchant": encoders["merchant"].classes_.tolist(),

        "category": encoders["category"].classes_.tolist(),

        "payment_method": encoders["payment_method"].classes_.tolist(),

        "city": encoders["city"].classes_.tolist()

    }

@app.post("/predict")
def predict(data: dict):

    # Store original values before encoding
    original_amount = data["amount"]
    original_hour = data["hour"]
    original_category = data["category"]

    # Convert JSON to DataFrame
    df = pd.DataFrame([data])
    if "date" in df.columns:
        df = df.drop(columns=["date"])
    if "transaction_id" in df.columns:
        df = df.drop(columns=["transaction_id"])

    categorical_columns = [
        "merchant",
        "category",
        "payment_method",
        "city"
    ]

    # Validate and Encode
    for column in categorical_columns:

        value = df[column].iloc[0]

        if value not in encoders[column].classes_:

            return {

                "success": False,

                "error": f"Unknown {column}: {value}",

                "allowed_values": encoders[column].classes_.tolist()

            }

        df[column] = encoders[column].transform(df[column])

    # Model Prediction
    prediction = model.predict(df)

    # Isolation Forest anomaly score
    score = model.decision_function(df)[0]

    # Convert score into a risk score (0-100)
    risk_score = round((1 - score) * 50, 2)
    risk_score = max(0, min(100, risk_score))

    # Prediction label
    result = "Anomaly" if prediction[0] == -1 else "Normal"

    # Confidence
    if risk_score >= 80:
        confidence = "High"
    elif risk_score >= 50:
        confidence = "Medium"
    else:
        confidence = "Low"

    # Dynamic reason
    if result == "Normal":
        reason = "Transaction matches normal spending behaviour."

    elif original_amount > 10000:
        reason = f"Large {original_category.lower()} transaction detected."

    elif original_hour <= 5:
        reason = "Transaction occurred during unusual hours."

    elif original_category == "Shopping" and original_amount > 8000:
        reason = "High-value shopping transaction."

    else:
        reason = "Transaction deviates from normal spending patterns."

    return {

        "success": True,

        "prediction": result,

        "risk_score": risk_score,

        "confidence": confidence,

        "reason": reason

    }