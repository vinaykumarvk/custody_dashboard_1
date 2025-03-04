import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import display_header, display_footer, set_page_config, load_css
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – Income")

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
st.markdown('<h1 style="color: #006400;">Dashboard – Income</h1>', unsafe_allow_html=True)

# Display header metrics
display_header(data)

# Main content - Income dashboard
col1, col2, col3 = st.columns(3)

with col1:
    # Monthwise income
    st.markdown('<div class="chart-title">Monthwise income</div>', unsafe_allow_html=True)
    st.markdown('<div class="chart-subtitle">Last 6 months</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    values = [18, 25, 28, 32, 34, 36]
    
    fig = px.line(
        x=months, 
        y=values,
        color_discrete_sequence=['#FF6B35']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='MonthName'),
        yaxis=dict(title=''),
        height=300
    )
    fig.update_traces(line=dict(width=3))
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Product wise income
    st.markdown('<div class="chart-title">Product wise income</div>', unsafe_allow_html=True)
    st.markdown('<div class="chart-subtitle">Last 6 months</div>', unsafe_allow_html=True)
    
    labels = ['Category A', 'Category B', 'Category C']
    values = [47, 35, 18]
    colors = ['#0052cc', '#FF6B35', '#673ab7']
    
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
        showlegend=True
    )
    # Add values to the pie chart
    annotations = []
    for i, label in enumerate(labels):
        value_text = "₹16,07,418.08" if i == 2 else "₹17,65,430.99" if i == 1 else "₹20,41,976.21"
        annotations.append(
            dict(
                text=value_text,
                x=0.5,
                y=1.2 - i * 0.1,
                font=dict(size=12),
                showarrow=False
            )
        )
    
    fig.update_layout(annotations=annotations)
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # Total income
    st.markdown('<div class="chart-title">Total income</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    values = [60, 70, 75, 82, 85, 90]
    
    fig = px.line(
        x=months, 
        y=values,
        color_discrete_sequence=['#FF6B35']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='MonthName'),
        yaxis=dict(title=''),
        height=300
    )
    fig.update_traces(line=dict(width=3))
    st.plotly_chart(fig, use_container_width=True)

# Income analysis
st.markdown('<div class="section-title">Income Analysis</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    # Income by service
    st.markdown('<div class="chart-title">Income by Service</div>', unsafe_allow_html=True)
    
    services = ['Custody Fees', 'Transaction Fees', 'Corporate Action Fees', 'Account Maintenance', 'Other Services']
    percentages = [45, 25, 15, 10, 5]
    
    fig = px.bar(
        x=services, 
        y=percentages,
        color_discrete_sequence=['#0052cc']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='', tickangle=45),
        yaxis=dict(title='Percentage (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Income growth rate
    st.markdown('<div class="chart-title">Income Growth Rate (% YoY)</div>', unsafe_allow_html=True)
    
    quarters = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024']
    growth_rates = [12.5, 14.2, 15.8, 16.5, 18.2, 19.7]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=quarters, 
        y=growth_rates,
        mode='lines+markers',
        line=dict(color='#006400', width=3),
        marker=dict(size=10, color='#006400')
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Growth Rate (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Income distribution
st.markdown('<div class="section-title">Income Distribution</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    # Income by client segment
    st.markdown('<div class="chart-title">Income by Client Segment</div>', unsafe_allow_html=True)
    
    segments = ['Institutional', 'HNI', 'Corporate', 'Retail', 'Others']
    percentages = [55, 20, 15, 8, 2]
    
    fig = px.pie(
        values=percentages, 
        names=segments,
        color_discrete_sequence=['#0052cc', '#FF6B35', '#FFC107', '#673ab7', '#6c757d']
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
    # Income by geography
    st.markdown('<div class="chart-title">Income by Geography</div>', unsafe_allow_html=True)
    
    regions = ['North', 'South', 'East', 'West', 'Central']
    percentages = [30, 25, 15, 20, 10]
    
    fig = px.bar(
        x=regions, 
        y=percentages,
        color_discrete_sequence=['#673ab7']
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
    # Income by product
    st.markdown('<div class="chart-title">Income by Product</div>', unsafe_allow_html=True)
    
    products = ['Equity', 'Debt', 'Mutual Funds', 'Insurance', 'Others']
    percentages = [40, 30, 15, 10, 5]
    
    fig = px.pie(
        values=percentages, 
        names=products,
        color_discrete_sequence=['#0052cc', '#FF6B35', '#FFC107', '#673ab7', '#6c757d']
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
