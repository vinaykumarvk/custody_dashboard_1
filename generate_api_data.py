import json
import os
from data_generator import generate_sample_data
import pandas as pd
import numpy as np

class CustomJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle pandas Timestamp objects and numpy data types."""
    def default(self, obj):
        if isinstance(obj, (pd.Timestamp, pd.Period)):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

def process_dataframe(df):
    """Convert pandas DataFrame to JSON-serializable format."""
    result = []
    for _, row in df.iterrows():
        record = {}
        for column, value in row.items():
            if isinstance(value, (pd.Timestamp, pd.Period)):
                record[column] = value.strftime('%Y-%m-%d')
            elif isinstance(value, (np.integer, np.floating)):
                record[column] = value.item()
            else:
                record[column] = value
        result.append(record)
    return result

def generate_dashboard_json():
    """Generate and save dashboard data as JSON."""
    # Get the raw data
    data = generate_sample_data()
    
    # Create a serializable version of the data
    serializable_data = {}
    for key, value in data.items():
        serializable_data[key] = process_dataframe(value)
    
    # Add summary metrics
    serializable_data['summary'] = {
        'total_customers': 10000,
        'total_income': 5414825.28,
        'total_trades': 5002698,
        'open_events': 38,
        'open_entitlements': 3709150
    }
    
    # Ensure the directory exists
    os.makedirs('public/api/dashboard', exist_ok=True)
    
    # Write to JSON file
    with open('public/api/dashboard/index.json', 'w') as f:
        json.dump(serializable_data, f, indent=2, cls=CustomJSONEncoder)
    
    # Create a simpler version for backward compatibility
    with open('public/api/dashboard.json', 'w') as f:
        json.dump(serializable_data, f, indent=2, cls=CustomJSONEncoder)
    
    print("Dashboard API data generated successfully")

if __name__ == "__main__":
    generate_dashboard_json()