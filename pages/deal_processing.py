import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import display_header, display_footer, set_page_config, load_css
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – Deal Processing")

# Load custom CSS
load_css()

# Generate sample data
data = generate_sample_data()

# Create main header
st.markdown("""
<div class="header">
    <div class="logo">
        <span class="logo-text">i</span>ICICI Bank
    </div>
    <div class="header-center">
        <div class="dropdown">
            <button class="dropbtn">Accounts ▼</button>
        </div>
        <div class="dropdown">
            <button class="dropbtn">Departments ▼</button>
        </div>
    </div>
    <div class="header-right">
        <button class="chat-btn">CRM Contact</button>
        <div class="user-info">
            <div>Sumeet Neniwal</div>
            <div class="user-id">User Login : 09-10-2023, 18:35</div>
        </div>
    </div>
</div>
<div class="sub-header">
    <div class="sub-header-left"></div>
    <div class="sub-header-right">
        <div class="dropdown">
            <button class="filter-btn">Value ▼</button>
        </div>
        <div class="dropdown">
            <button class="filter-btn">Volume ▼</button>
        </div>
        <button class="view-btn"><span class="icon">📊</span> View Balance</button>
        <button class="customize-btn"><span class="icon">⚙️</span> Customize</button>
    </div>
</div>
""", unsafe_allow_html=True)

# Page title
st.markdown('<h1 style="color: #006400;">Dashboard – Deal Processing</h1>', unsafe_allow_html=True)

# Display header metrics
display_header(data)

# Main content - Deal Processing dashboard
col1, col2, col3 = st.columns([2, 2, 1])

with col1:
    # Transaction prediction
    st.markdown('<div class="chart-title">Transaction prediction</div>', unsafe_allow_html=True)
    
    months = ['Sep', 'Oct', 'Nov']
    years = ['2023', '2024', '2025']
    
    # Create a DataFrame for grouped bar chart
    data_dict = {
        'Month': months * 3,
        'Year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'Count': [2.74, 3.71, 2.21, 3.0, 3.73, 3.89, 4.3, 4.54, 3.98]
    }
    df = pd.DataFrame(data_dict)
    
    fig = px.bar(
        df,
        x='Month',
        y='Count',
        color='Year',
        barmode='group',
        color_discrete_sequence=['#0052cc', '#FF6B35', '#673ab7']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='Month'),
        yaxis=dict(title='Count'),
        height=300,
        legend=dict(orientation="h", yanchor="bottom", y=-0.3, xanchor="center", x=0.5)
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Client count prediction
    st.markdown('<div class="chart-title">Client count prediction</div>', unsafe_allow_html=True)
    
    months = ['Sep', 'Oct', 'Nov']
    years = ['2023', '2024', '2025']
    
    # Create a DataFrame for grouped bar chart
    data_dict = {
        'Month': months * 3,
        'Year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'Count': [21.67, 37.27, 23.13, 30.03, 30.51, 39.81, 48.23, 49.61, 45.39]
    }
    df = pd.DataFrame(data_dict)
    
    fig = px.bar(
        df,
        x='Month',
        y='Count',
        color='Year',
        barmode='group',
        color_discrete_sequence=['#0052cc', '#FF6B35', '#673ab7']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='Month'),
        yaxis=dict(title='Count'),
        height=300,
        legend=dict(orientation="h", yanchor="bottom", y=-0.3, xanchor="center", x=0.5)
    )
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # Reach Us Here
    st.markdown('<div class="chart-title">Reach Us Here</div>', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="contact-section">
        <div class="contact-card">
            <div class="contact-icon">💬</div>
            <div class="contact-text">Chat With Agent</div>
        </div>
        <div class="contact-card">
            <div class="contact-icon">📞</div>
            <div class="contact-text">Speak With Us</div>
        </div>
        <div class="contact-card">
            <div class="contact-icon">✉️</div>
            <div class="contact-text">Connect Via Mail</div>
        </div>
        <div class="contact-card">
            <div class="contact-icon">🏢</div>
            <div class="contact-text">Branch/Atm</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Process analytics
st.markdown('<div class="section-title">Process Analytics</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    # Process efficiency
    st.markdown('<div class="chart-title">Process Efficiency</div>', unsafe_allow_html=True)
    
    categories = ['Trade Processing', 'Settlement', 'Reconciliation', 'Corporate Actions', 'Reporting']
    values_2023 = [85, 78, 92, 87, 90]
    values_2024 = [91, 86, 95, 92, 94]
    
    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=categories,
        y=values_2023,
        name='2023',
        marker_color='#0052cc'
    ))
    fig.add_trace(go.Bar(
        x=categories,
        y=values_2024,
        name='2024',
        marker_color='#FF6B35'
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Efficiency (%)', range=[70, 100]),
        height=300,
        barmode='group',
        legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5)
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # SLA adherence
    st.markdown('<div class="chart-title">SLA Adherence</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    values = [94.2, 95.7, 93.8, 96.5, 97.8, 98.2]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=months, 
        y=values,
        mode='lines+markers',
        line=dict(color='#006400', width=3),
        marker=dict(size=10, color='#006400')
    ))
    
    # Add target line
    fig.add_trace(go.Scatter(
        x=months,
        y=[95] * len(months),
        mode='lines',
        line=dict(color='red', width=2, dash='dash'),
        name='Target'
    ))
    
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Adherence (%)', range=[90, 100]),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Operational metrics
st.markdown('<div class="section-title">Operational Metrics</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    # Average processing time
    st.markdown('<div class="chart-title">Average Processing Time (Hours)</div>', unsafe_allow_html=True)
    
    process_types = ['Trade Capture', 'Validation', 'Settlement', 'Reconciliation', 'Reporting']
    times = [1.5, 0.8, 2.3, 1.7, 0.9]
    
    fig = px.bar(
        x=process_types, 
        y=times,
        color_discrete_sequence=['#673ab7']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='', tickangle=45),
        yaxis=dict(title='Hours'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Exception rates
    st.markdown('<div class="chart-title">Exception Rates (%)</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    rates = [3.2, 2.8, 2.5, 2.1, 1.9, 1.7]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=months, 
        y=rates,
        mode='lines+markers',
        line=dict(color='#FF6B35', width=3),
        marker=dict(size=10, color='#FF6B35')
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Exception Rate (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # Automation level
    st.markdown('<div class="chart-title">Automation Level</div>', unsafe_allow_html=True)
    
    processes = ['Trade Processing', 'Settlement', 'Reconciliation', 'Corporate Actions', 'Reporting']
    automation = [85, 75, 90, 65, 95]
    
    fig = px.bar(
        x=processes, 
        y=automation,
        color_discrete_sequence=['#0052cc']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='', tickangle=45),
        yaxis=dict(title='Automation (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Payment aging and Tickets aging in the footer
display_footer()
