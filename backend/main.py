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
