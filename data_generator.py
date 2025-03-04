import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_data():
    """Generate sample data for the dashboard."""
    
    # Current timestamp
    now = datetime.now()
    
    # Generate date range for the past 12 months
    end_date = now
    start_date = end_date - timedelta(days=365)
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    
    # Customer data
    customers_data = {
        'date': date_range,
        'total_customers': np.cumsum(np.random.randint(10, 100, size=len(date_range))),
        'new_customers': np.random.randint(10, 200, size=len(date_range))
    }
    customers_df = pd.DataFrame(customers_data)
    
    # Monthly aggregation
    customers_monthly = customers_df.resample('ME', on='date').agg({
        'total_customers': 'last',
        'new_customers': 'sum'
    }).reset_index()
    
    # Income data
    income_data = {
        'date': date_range,
        'total_income': np.cumsum(np.random.randint(10000, 50000, size=len(date_range))),
        'new_income': np.random.randint(1000, 5000, size=len(date_range))
    }
    income_df = pd.DataFrame(income_data)
    
    # Monthly aggregation
    income_monthly = income_df.resample('ME', on='date').agg({
        'total_income': 'last',
        'new_income': 'sum'
    }).reset_index()
    
    # Trade data
    trade_data = {
        'date': date_range,
        'total_trades': np.cumsum(np.random.randint(100, 500, size=len(date_range))),
        'trade_volume': np.random.randint(10000, 50000, size=len(date_range))
    }
    trade_df = pd.DataFrame(trade_data)
    
    # Monthly aggregation
    trade_monthly = trade_df.resample('ME', on='date').agg({
        'total_trades': 'sum',
        'trade_volume': 'sum'
    }).reset_index()
    
    # Event data
    event_data = {
        'date': date_range,
        'open_events': np.random.randint(0, 5, size=len(date_range)),
        'open_entitlements': np.random.randint(1000, 10000, size=len(date_range))
    }
    event_df = pd.DataFrame(event_data)
    
    # Monthly aggregation
    event_monthly = event_df.resample('ME', on='date').agg({
        'open_events': 'sum',
        'open_entitlements': 'sum'
    }).reset_index()
    
    # Product distribution data
    product_data = {
        'product': ['MUTUAL FUND', 'FD', 'PORTFOLIO'],
        'customers': [2800, 3100, 4100],
        'income': [2041976.21, 1765430.99, 1607418.08],
        'trades': [69200.00, 1564498.00, 3369000.00]
    }
    product_df = pd.DataFrame(product_data)
    
    # Payment aging data
    payment_aging_data = {
        'range': ['0-30 Days', '31-60 Days', '61-90 Days', '91+ Days'],
        'amount': [2679, 0, 3669666, 36805]
    }
    payment_aging_df = pd.DataFrame(payment_aging_data)
    
    # Tickets aging data
    tickets_aging_data = {
        'range': ['0-15 days', '16-30 days', '31-45 days', '45+ days'],
        'count': [0, 2, 7, 29]
    }
    tickets_aging_df = pd.DataFrame(tickets_aging_data)
    
    # Prediction data for years (2023, 2024, 2025)
    months = ['Sep', 'Oct', 'Nov']
    
    transaction_prediction_data = {
        'month': months * 3,
        'year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'count': [2.74, 3.71, 2.21, 3.0, 3.73, 3.89, 4.3, 4.54, 3.98]
    }
    transaction_prediction_df = pd.DataFrame(transaction_prediction_data)
    
    client_count_prediction_data = {
        'month': months * 3,
        'year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'count': [21.67, 29.27, 22.14, 30.03, 26.6, 30.54, 40.23, 49.61, 45.39]
    }
    client_prediction_df = pd.DataFrame(client_count_prediction_data)
    
    events_details_data = {
        'month': months * 3,
        'year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'count': [240, 290, 320, 250, 220, 200, 350, 340, 340]
    }
    events_details_df = pd.DataFrame(events_details_data)
    
    entitlements_prediction_data = {
        'month': months * 3,
        'year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'count': [34.26, 24.59, 14.79, 20.07, 27.27, 13.91, 36.87, 36.36, 35.34]
    }
    entitlements_prediction_df = pd.DataFrame(entitlements_prediction_data)
    
    # Return all generated data
    return {
        'customers_monthly': customers_monthly,
        'income_monthly': income_monthly,
        'trade_monthly': trade_monthly,
        'event_monthly': event_monthly,
        'product_df': product_df,
        'payment_aging_df': payment_aging_df,
        'tickets_aging_df': tickets_aging_df,
        'transaction_prediction_df': transaction_prediction_df,
        'client_prediction_df': client_prediction_df,
        'events_details_df': events_details_df,
        'entitlements_prediction_df': entitlements_prediction_df
    }
