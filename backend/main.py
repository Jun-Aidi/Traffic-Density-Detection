from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Traffic AI Forecaster API")

# Setup CORS to allow React Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with the frontend URL (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained Machine Learning Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "traffic_model.pkl")
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define the Input Data structure
class TrafficData(BaseModel):
    day: int      # 0 for Monday, 6 for Sunday
    hour: int     # 0 to 23
    minute: int   # e.g., 0, 15, 30, 45

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Traffic Prediction API is running!"}

@app.post("/predict")
def predict_traffic(data: TrafficData):
    if model is None:
        return {"error": "Model not loaded"}
    
    input_df = pd.DataFrame([{
        "day_of_week": data.day,
        "hour": data.hour,
        "minute": data.minute
    }])
    
    prediction = model.predict(input_df)
    result_class = prediction[0]
    
    # Simpan riwayat prediksi
    import data_service
    DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    day_name = DAYS[data.day] if 0 <= data.day <= 6 else 'Unknown'
    
    data_service.save_prediction(day_name, data.hour, data.minute, result_class)
    
    return {
        "density": result_class,
        "input_used": {
            "day": data.day,
            "hour": data.hour,
            "minute": data.minute
        }
    }

@app.get("/history")
def get_history():
    import data_service
    return data_service.load_history()

@app.get("/analytics")
def get_analytics():
    import data_service
    return data_service.load_analytics_data()

@app.get("/dashboard-stats")
def get_dashboard_stats():
    import data_service
    analytics = data_service.load_analytics_data()
    return {
        "total_data": f"{analytics['total_data']:,}".replace(",", "."),
        "accuracy": "~80%", # Updated based on classification report
        "dominant_vehicle": analytics['vehicle_types'][0]['label'] if analytics['vehicle_types'] else "N/A",
        "busiest_hour": analytics.get("busiest_hour", "07:00 - 08:00"),
        "highlights": analytics.get("highlights", [])
    }

@app.get("/heatmap")
def get_heatmap():
    from collections import Counter

    DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    HOURS = list(range(6, 24))  # 06:00 – 23:00

    # Numeric score for each density class (used for color intensity)
    DENSITY_SCORE = {
        'Empty': 2,
        'Low':   6,
        'Medium': 11,
        'High':  16,
        'Heavy': 22,
    }
    DENSITY_LABEL_ID = {
        'Empty': 'Kosong',
        'Low':   'Sepi',
        'Medium': 'Sedang',
        'High':  'Padat',
        'Heavy': 'Macet',
    }
    # Short 2-char label shown inside each cell
    DENSITY_SHORT = {
        'Empty': 'K',
        'Low':   'S',
        'Medium': 'Sd',
        'High':  'P',
        'Heavy': 'M',
    }

    if model is None:
        # Fallback to CSV-based data if model not loaded
        import data_service
        return data_service.load_heatmap_data()

    matrix = []
    for day_idx, day_name in enumerate(DAY_NAMES):
        for h in HOURS:
            # Predict at 4 time-points within the hour, take majority vote
            preds = []
            for minute in [0, 15, 30, 45]:
                input_df = pd.DataFrame([{
                    "day_of_week": day_idx,
                    "hour": h,
                    "minute": minute
                }])
                try:
                    pred = model.predict(input_df)[0]
                    preds.append(pred)
                except Exception:
                    pass

            if not preds:
                most_common = 'Empty'
            else:
                most_common = Counter(preds).most_common(1)[0][0]

            score = DENSITY_SCORE.get(most_common, 0)
            matrix.append({
                "day":     day_name,
                "hour":    h,
                "avg":     score,
                "density": most_common,
                "label":   DENSITY_LABEL_ID.get(most_common, most_common),
                "short":   DENSITY_SHORT.get(most_common, '?'),
            })

    all_scores = [item["avg"] for item in matrix]
    global_max = max(all_scores) if all_scores else 22

    return {
        "matrix":   matrix,
        "days":     DAY_NAMES,
        "hours":    HOURS,
        "max_avg":  global_max,
        "source":   "model"
    }
