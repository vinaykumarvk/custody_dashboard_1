import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import display_header, display_footer, set_page_config, load_css
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – Customers")

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
st.markdown('<h1 style="color: #006400;">Dashboard – Customers</h1>', unsafe_allow_html=True)

# Display header metrics
display_header(data)

# Main content - Customer dashboard
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

# More detailed customer analysis
st.markdown('<div class="section-title">Customer Analysis</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    # Customer growth rate
    st.markdown('<div class="chart-title">Customer Growth Rate (Monthly)</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    growth_rates = [5.2, 7.8, 4.3, 3.9, 6.1, 8.4]
    
    fig = px.line(
        x=months, 
        y=growth_rates,
        color_discrete_sequence=['#006400']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Growth Rate (%)'),
        height=300
    )
    fig.update_traces(line=dict(width=3))
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Customer retention
    st.markdown('<div class="chart-title">Customer Retention Rate</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    retention_rates = [92, 91, 94, 93, 95, 96]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=months, 
        y=retention_rates,
        mode='lines+markers',
        line=dict(color='#006400', width=3),
        marker=dict(size=10, color='#006400')
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Retention Rate (%)', range=[85, 100]),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Customer segmentation
st.markdown('<div class="section-title">Customer Segmentation</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    # Customer by product
    st.markdown('<div class="chart-title">Customers by Product</div>', unsafe_allow_html=True)
    
    products = ['Mutual Funds', 'Fixed Deposits', 'Portfolio Management', 'Custody Services', 'Others']
    counts = [45, 28, 15, 8, 4]
    
    fig = px.pie(
        values=counts, 
        names=products,
        color_discrete_sequence=['#006400', '#FF6B35', '#FFC30B', '#577590', '#F1F1F1'],
        hole=0.4
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        height=300
    )
    fig.update_traces(textinfo='percent+label')
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Customer by value
    st.markdown('<div class="chart-title">Customers by Value (₹ in Lakhs)</div>', unsafe_allow_html=True)
    
    value_ranges = ['< 10L', '10L-50L', '50L-1Cr', '1Cr-5Cr', '> 5Cr']
    percentages = [35, 25, 20, 15, 5]
    
    fig = px.bar(
        x=value_ranges, 
        y=percentages,
        color_discrete_sequence=['#006400']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Percentage (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # Customer acquisition channel
    st.markdown('<div class="chart-title">Customer Acquisition Channel</div>', unsafe_allow_html=True)
    
    channels = ['Branch Referral', 'Digital', 'Direct Sales', 'Partnerships', 'Others']
    counts = [40, 30, 15, 10, 5]
    
    fig = px.pie(
        values=counts, 
        names=channels,
        color_discrete_sequence=['#006400', '#FF6B35', '#FFC30B', '#577590', '#F1F1F1']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        height=300
    )
    fig.update_traces(textinfo='percent+label')
    st.plotly_chart(fig, use_container_width=True)

# Payment aging and Tickets aging in the footer
display_footer()
