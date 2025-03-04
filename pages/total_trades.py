import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import display_header, display_footer, set_page_config, load_css
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – Total Trades")

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
st.markdown('<h1 style="color: #006400;">Dashboard – Total Trades</h1>', unsafe_allow_html=True)

# Display header metrics
display_header(data)

# Main content - Total Trades dashboard
col1, col2, col3 = st.columns(3)

with col1:
    # Trade and Volume
    st.markdown('<div class="chart-title">Trade and Volume</div>', unsafe_allow_html=True)
    
    months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    volume = [1.78, 4.76, 9.81, 58.71, 7.87, 13.65]
    counts = [2.55, 5.25, 9.04, 48.3, 20.6, 15.1]
    
    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=months, 
        y=volume,
        name='Volume (in Mn)',
        marker_color='#0052cc'
    ))
    fig.add_trace(go.Scatter(
        x=months, 
        y=counts,
        name='Count of Trades',
        mode='lines+markers',
        marker=dict(color='#FF6B35', size=8),
        line=dict(color='#FF6B35', width=3)
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='MONTHNAME'),
        yaxis=dict(title=''),
        height=300,
        legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5)
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Total volume
    st.markdown('<div class="chart-title">Total volume</div>', unsafe_allow_html=True)
    
    labels = ['Product A', 'Product B', 'Product C']
    values = [55, 25, 20]
    colors = ['#0052cc', '#FF6B35', '#FFC107']
    
    fig = px.pie(
        values=values, 
        names=labels,
        color_discrete_sequence=colors,
        hole=0.6
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        height=300,
        showlegend=True,
        annotations=[dict(text=f'₹69.20<br>Mn', x=0.5, y=0.5, font_size=14, showarrow=False)]
    )
    # Add values to the pie chart
    annotations = []
    for i, label in enumerate(labels):
        value_text = "₹15.64 Mn" if i == 1 else "₹33.69 Mn" if i == 2 else "₹69.20 Mn"
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
    # Total trade
    st.markdown('<div class="chart-title">Total trade</div>', unsafe_allow_html=True)
    
    labels = ['Category A', 'Category B', 'Category C']
    values = [50, 30, 20]
    colors = ['#673ab7', '#ff6b35', '#ffc107']
    
    fig = px.pie(
        values=values, 
        names=labels,
        color_discrete_sequence=colors,
        hole=0.6
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        height=300,
        showlegend=True,
        annotations=[dict(text=f'₹10.81<br>Mn', x=0.5, y=0.5, font_size=14, showarrow=False)]
    )
    # Add values to the pie chart
    annotations = []
    for i, label in enumerate(labels):
        value_text = "₹7.40 K" if i == 1 else "₹10.03 L" if i == 2 else "₹10.81 Mn"
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

# Trade analysis
st.markdown('<div class="section-title">Trade Analysis</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    # Trade success rate
    st.markdown('<div class="chart-title">Trade Success Rate</div>', unsafe_allow_html=True)
    
    months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    success_rates = [98.2, 97.5, 99.1, 98.7, 99.3, 99.5]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=months, 
        y=success_rates,
        mode='lines+markers',
        line=dict(color='#006400', width=3),
        marker=dict(size=10, color='#006400')
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Success Rate (%)', range=[95, 100]),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Average trade value
    st.markdown('<div class="chart-title">Average Trade Value (₹ in Lakhs)</div>', unsafe_allow_html=True)
    
    months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    avg_values = [28.5, 32.1, 35.4, 42.8, 38.2, 40.5]
    
    fig = px.bar(
        x=months, 
        y=avg_values,
        color_discrete_sequence=['#0052cc']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Avg Value (₹ Lakhs)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Trade distribution
st.markdown('<div class="section-title">Trade Distribution</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    # Trade by product type
    st.markdown('<div class="chart-title">Trade by Product Type</div>', unsafe_allow_html=True)
    
    product_types = ['Equity', 'Debt', 'Derivatives', 'MF', 'Others']
    percentages = [45, 25, 15, 10, 5]
    
    fig = px.bar(
        x=product_types, 
        y=percentages,
        color_discrete_sequence=['#0052cc']
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

with col2:
    # Trade by client type
    st.markdown('<div class="chart-title">Trade by Client Type</div>', unsafe_allow_html=True)
    
    client_types = ['Institutional', 'HNI', 'Retail', 'Corporate']
    values = [50, 30, 15, 5]
    
    fig = px.pie(
        values=values, 
        names=client_types,
        color_discrete_sequence=['#0052cc', '#FF6B35', '#FFC107', '#6c757d']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        height=300
    )
    fig.update_traces(textinfo='percent+label')
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # Trade by channel
    st.markdown('<div class="chart-title">Trade by Channel</div>', unsafe_allow_html=True)
    
    channels = ['FIX API', 'Web Platform', 'Mobile App', 'Dealer Terminal', 'Others']
    percentages = [40, 30, 15, 10, 5]
    
    fig = px.bar(
        x=channels, 
        y=percentages,
        color_discrete_sequence=['#673ab7']
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

# Payment aging and Tickets aging in the footer
display_footer()
