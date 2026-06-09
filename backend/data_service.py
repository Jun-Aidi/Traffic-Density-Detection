import os
import json
import glob
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "collected_data")
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")

# 1. HISTORY MANAGEMENT
def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_prediction(day_name, hour, minute, density):
    history = load_history()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {
        "day": day_name,
        "hour": str(hour).zfill(2),
        "minute": str(minute).zfill(2),
        "density": density,
        "timestamp": now_str,
        "total": "—" # Model prediction doesn't output total vehicles, only class
    }
    history.insert(0, entry) # Prepend
    
    # Keep only the last 100 to avoid huge files
    history = history[:100]
    
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)
        
    return entry

# 2. ANALYTICS MANAGEMENT
# Cache the analytics so we don't recalculate thousands of rows on every request
_analytics_cache = None

def load_analytics_data():
    global _analytics_cache
    if _analytics_cache is not None:
        return _analytics_cache

    csv_files = glob.glob(os.path.join(DATA_DIR, "*.csv"))
    
    if not csv_files:
        return {
            "hour_data": [0]*18,
            "density_dist": [],
            "vehicle_types": [],
            "total_data": 0,
            "busiest_hour": "06:00 - 06:59",
            "highlights": []
        }

    df_list = []
    for f in csv_files:
        try:
            day_name = os.path.basename(f).replace('.csv', '')
            df = pd.read_csv(f, header=None, names=['idx', 'dt', 'cat', 'total', 'sepeda', 'motor', 'mobil', 'bus', 'truk'])
            df = df.dropna()
            df['day_name'] = day_name
            df_list.append(df)
        except Exception as e:
            print(f"Error reading {f}: {e}")
            
    if not df_list:
        return {}

    full_df = pd.concat(df_list, ignore_index=True)
    full_df['dt'] = pd.to_datetime(full_df['dt'], errors='coerce')
    full_df = full_df.dropna(subset=['dt'])
    
    full_df['hour'] = full_df['dt'].dt.hour
    full_df['minute'] = full_df['dt'].dt.minute
    
    total_rows = len(full_df)
    
    # Categories counts
    categories = full_df['cat'].value_counts().to_dict()
    
    # Vehicle sums
    counts = [
        full_df['total'].sum(),
        full_df['sepeda'].sum(),
        full_df['motor'].sum(),
        full_df['mobil'].sum(),
        full_df['bus'].sum(),
        full_df['truk'].sum()
    ]
    
    # Average vehicles per hour (6 to 23)
    valid_hours = full_df[(full_df['hour'] >= 6) & (full_df['hour'] <= 23)]
    hour_means = valid_hours.groupby('hour')['total'].mean().to_dict()
    
    max_avg = -1
    busiest_hour = 6
    hour_data_list = []
    
    for h in range(6, 24):
        avg = int(hour_means.get(h, 0))
        hour_data_list.append(avg)
        if avg > max_avg:
            max_avg = avg
            busiest_hour = h
            
    busiest_hour_str = f"{str(busiest_hour).zfill(2)}:00 - {str(min(busiest_hour+1, 23)).zfill(2)}:59"
    
    # Highlights: Top 1 record per day
    idx_max = full_df.groupby('day_name')['total'].idxmax()
    top_records = full_df.loc[idx_max]
    
    highlights = []
    for _, row in top_records.iterrows():
        time_str = f"{str(row['hour']).zfill(2)}:{str(row['minute']).zfill(2)}"
        highlights.append({
            "day": row['day_name'],
            "time": time_str,
            "density": row['cat'],
            "count": int(row['total'])
        })
        
    # Density Distribution
    density_dist = []
    color_map = {
        'Empty': 'bg-slate-400', 'Low': 'bg-green-500', 'Medium': 'bg-amber-500', 
        'High': 'bg-orange-500', 'Heavy': 'bg-red-500'
    }
    label_map = {
        'Empty': 'Kosong (Empty)', 'Low': 'Sepi (Low)', 'Medium': 'Sedang (Medium)', 
        'High': 'Padat (High)', 'Heavy': 'Macet (Heavy)'
    }
    for k, v in categories.items():
        if k in label_map:
            pct = int((v / total_rows) * 100) if total_rows > 0 else 0
            density_dist.append({
                "label": label_map.get(k, k),
                "count": pct,
                "color": color_map.get(k, 'bg-slate-400')
            })
            
    density_order = ['Kosong (Empty)', 'Sepi (Low)', 'Sedang (Medium)', 'Padat (High)', 'Macet (Heavy)']
    density_dist.sort(key=lambda x: density_order.index(x['label']) if x['label'] in density_order else 99)
            
    # Vehicle Composition
    total_vehicles = sum(counts[1:]) 
    vehicle_types = []
    if total_vehicles > 0:
        vehicle_types = [
            {"label": "Sepeda Motor", "pct": int((counts[2] / total_vehicles) * 100), "color": "bg-brand-500"},
            {"label": "Mobil", "pct": int((counts[3] / total_vehicles) * 100), "color": "bg-cyan-500"},
            {"label": "Bus", "pct": int((counts[4] / total_vehicles) * 100), "color": "bg-amber-500"},
            {"label": "Truk", "pct": int((counts[5] / total_vehicles) * 100), "color": "bg-orange-500"},
            {"label": "Sepeda", "pct": int((counts[1] / total_vehicles) * 100), "color": "bg-emerald-500"},
        ]
        vehicle_types.sort(key=lambda x: x['pct'], reverse=True)

    # Highlights (Top 5 busiest days)
    highlights.sort(key=lambda x: x['count'], reverse=True)
    highlights = highlights[:5]
    
    badge_map = {
        'Empty': 'badge badge-empty', 'Low': 'badge badge-low',
        'Medium': 'badge badge-medium', 'High': 'badge badge-high', 'Heavy': 'badge badge-heavy'
    }
    advice_map = {
        'Empty': 'Jalanan sangat lengang', 'Low': 'Lancar, aman untuk melintas',
        'Medium': 'Mulai padat, tetap waspada', 'High': 'Kepadatan tinggi, rawan tersendat',
        'Heavy': 'Macet total, hindari rute ini!'
    }
    label_indo = {
        'Empty': 'Kosong', 'Low': 'Sepi', 'Medium': 'Sedang', 'High': 'Padat', 'Heavy': 'Macet'
    }
    
    final_highlights = []
    for h in highlights:
        final_highlights.append({
            "day": h['day'],
            "time": h['time'],
            "density": label_indo.get(h['density'], h['density']),
            "badge": badge_map.get(h['density'], 'badge badge-empty'),
            "advice": advice_map.get(h['density'], 'Kondisi terpantau AI')
        })

    _analytics_cache = {
        "hour_data": hour_data_list,
        "density_dist": density_dist,
        "vehicle_types": vehicle_types,
        "total_data": total_rows,
        "busiest_hour": busiest_hour_str,
        "highlights": final_highlights
    }
    return _analytics_cache


# 3. HEATMAP DATA (day x hour average vehicle count)
_heatmap_cache = None

def load_heatmap_data():
    global _heatmap_cache
    if _heatmap_cache is not None:
        return _heatmap_cache

    DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    HOURS = list(range(6, 24))  # 06:00 - 23:00

    csv_files = glob.glob(os.path.join(DATA_DIR, "*.csv"))
    df_list = []
    
    for f in csv_files:
        try:
            day_name = os.path.basename(f).replace('.csv', '')
            if day_name not in DAY_ORDER:
                continue
            df = pd.read_csv(f, header=None, names=['idx', 'dt', 'cat', 'total', 'sepeda', 'motor', 'mobil', 'bus', 'truk'])
            df = df.dropna()
            df['day_name'] = day_name
            df_list.append(df)
        except Exception as e:
            print(f"Heatmap error reading {f}: {e}")

    matrix = []
    if df_list:
        full_df = pd.concat(df_list, ignore_index=True)
        full_df['dt'] = pd.to_datetime(full_df['dt'], errors='coerce')
        full_df = full_df.dropna(subset=['dt'])
        full_df['hour'] = full_df['dt'].dt.hour
        
        valid_df = full_df[(full_df['hour'] >= 6) & (full_df['hour'] <= 23)]
        grouped = valid_df.groupby(['day_name', 'hour'])['total'].mean().to_dict()
        
        for day in DAY_ORDER:
            for h in HOURS:
                avg = round(grouped.get((day, h), 0), 1)
                matrix.append({
                    "day": day,
                    "hour": h,
                    "avg": avg
                })
    else:
        for day in DAY_ORDER:
            for h in HOURS:
                matrix.append({"day": day, "hour": h, "avg": 0})

    all_avgs = [item["avg"] for item in matrix]
    global_max = max(all_avgs) if all_avgs else 1

    _heatmap_cache = {
        "matrix": matrix,
        "days": DAY_ORDER,
        "hours": HOURS,
        "max_avg": global_max
    }
    return _heatmap_cache
