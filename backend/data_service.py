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
    
    total_rows = 0
    categories = {}
    counts = [0] * 6  # col 3 to 8 sums
    
    # For average per hour (06:00 to 23:00)
    # We will initialize an array for hours 6 to 23 (18 elements)
    hour_counts = {h: [] for h in range(6, 24)} 
    
    # 1. Hour Data (Average vehicles per hour)
    hour_data_list = []
    max_avg = -1
    busiest_hour = 6
    
    # Track top record per day for highlights
    daily_max = {}
    
    for f in csv_files:
        try:
            day_name = os.path.basename(f).replace('.csv', '')
            df = pd.read_csv(f, header=None)
            
            max_count_for_day = -1
            best_time = "00:00"
            best_cat = "Empty"
            
            for _, row in df.iterrows():
                if len(row) < 9:
                    continue
                
                total_rows += 1
                cat = str(row[2])
                categories[cat] = categories.get(cat, 0) + 1
                
                for i in range(6):
                    try:
                        counts[i] += int(row[3+i])
                    except:
                        pass
                
                try:
                    dt = pd.to_datetime(row[1])
                    total_count = int(row[3])
                    if 6 <= dt.hour <= 23:
                        hour_counts[dt.hour].append(total_count)
                        
                    # Find max for highlight
                    if total_count > max_count_for_day:
                        max_count_for_day = total_count
                        best_time = f"{str(dt.hour).zfill(2)}:{str(dt.minute).zfill(2)}"
                        best_cat = cat
                except:
                    pass
                    
            if max_count_for_day >= 0:
                daily_max[day_name] = {
                    "day": day_name,
                    "time": best_time,
                    "density": best_cat,
                    "count": max_count_for_day
                }
        except Exception as e:
            print(f"Error reading {f}: {e}")
            pass
            
    # Process Hour Data
    for h in range(6, 24):
        h_list = hour_counts[h]
        avg = int(sum(h_list) / len(h_list)) if len(h_list) > 0 else 0
        hour_data_list.append(avg)
        if avg > max_avg:
            max_avg = avg
            busiest_hour = h
            
    busiest_hour_str = f"{str(busiest_hour).zfill(2)}:00 - {str(min(busiest_hour+1, 23)).zfill(2)}:59"
        
    # 2. Density Distribution (%)
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
            
    # 3. Vehicle Composition (%)
    total_vehicles = sum(counts[1:]) 
    vehicle_types = []
    if total_vehicles > 0:
        vehicle_types = [
            {"label": "Sepeda Motor", "pct": int((counts[2] / total_vehicles) * 100), "color": "bg-brand-500"},
            {"label": "Mobil", "pct": int((counts[3] / total_vehicles) * 100), "color": "bg-cyan-500"},
            {"label": "Bus", "pct": int((counts[4] / total_vehicles) * 100), "color": "bg-amber-500"},
            {"label": "Truk", "pct": int((counts[5] / total_vehicles) * 100), "color": "bg-orange-500"},
            {"label": "Lainnya", "pct": int((counts[1] / total_vehicles) * 100), "color": "bg-slate-400"},
        ]
        vehicle_types.sort(key=lambda x: x['pct'], reverse=True)

    # 4. Highlights (Top 5 busiest days)
    highlights = list(daily_max.values())
    highlights.sort(key=lambda x: x['count'], reverse=True)
    highlights = highlights[:5]
    
    # Map advice and badge
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
