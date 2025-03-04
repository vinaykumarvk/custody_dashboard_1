import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import (
    set_page_config, 
    display_header, 
    display_footer, 
    create_card,
    load_css
)
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – eMACH.ai Custody")

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

# Display header metrics
display_header(data)

# Main content - Home page overview dashboard
st.markdown('<div class="section-title">Overview Dashboard</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    # Monthwise new customers
    st.markdown('<div class="chart-title">Monthwise new customers</div>', unsafe_allow_html=True)
    st.markdown('<div class="chart-subtitle">Last 6 months</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    values = [8000, 45000, 15000, 22000, 8000, 3000]
    
    fig = px.bar(
        x=months, 
        y=values,
        color_discrete_sequence=['#FF6B35']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title=''),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Productwise new customers
    st.markdown('<div class="chart-title">Productwise new customers</div>', unsafe_allow_html=True)
    st.markdown('<div class="chart-subtitle">Last 6 months</div>', unsafe_allow_html=True)
    
    labels = ['MUTUAL FUND', 'FD', 'PORTFOLIO']
    values = [28, 31, 41]
    colors = ['#FFA15A', '#FF6B35', '#FF3A00']
    
    fig = px.pie(
        values=values, 
        names=labels,
        color_discrete_sequence=colors,
        hole=0.5
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        height=300,
        showlegend=True,
        legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5)
    )
    # Add percentages to the pie chart
    fig.update_traces(textinfo='percent+label')
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # Total customers
    st.markdown('<div class="chart-title">Total customers</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    values = [60, 50, 48, 45, 50, 70]
    
    fig = px.line(
        x=months, 
        y=values,
        color_discrete_sequence=['#FF6B35']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title=''),
        height=300
    )
    fig.update_traces(line=dict(width=3))
    st.plotly_chart(fig, use_container_width=True)

# Payment aging and Tickets aging in the footer
display_footer()

# Information about other dashboard pages
st.markdown("""
<div class="info-box">
    <h3>Dashboard Navigation</h3>
    <p>Explore different sections of the dashboard using the sidebar navigation menu:</p>
    <ul>
        <li><strong>Customers</strong> - View customer metrics, growth, and distribution</li>
        <li><strong>Total Trades</strong> - Analyze trading volume and patterns</li>
        <li><strong>Deal Processing</strong> - Monitor transaction predictions and client count</li>
        <li><strong>Corporate Actions</strong> - Track corporate action events and entitlements</li>
        <li><strong>Open Events</strong> - View pending events and entitlements</li>
        <li><strong>Income</strong> - Analyze income metrics and trends</li>
    </ul>
</div>
""", unsafe_allow_html=True)

# App description in the sidebar
with st.sidebar:
    st.image("https://via.placeholder.com/150x50/006400/FFFFFF/?text=eMACH.ai")
    st.title("eMACH.ai Custody")
    st.write("Financial Dashboard powered by CT Sigma")
    
    st.markdown("---")
    st.markdown("### Dashboard Views")
    st.markdown("- Customers")
    st.markdown("- Total Trades")
    st.markdown("- Deal Processing")
    st.markdown("- Corporate Actions")
    st.markdown("- Open Events")
    st.markdown("- Income")
