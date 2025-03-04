import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import display_header, display_footer, set_page_config, load_css
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – Corporate Actions")

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
st.markdown('<h1 style="color: #006400;">Dashboard – Corporate Actions</h1>', unsafe_allow_html=True)

# Display header metrics
display_header(data)

# Main content - Corporate Actions dashboard
col1, col2, col3 = st.columns(3)

with col1:
    # Client count prediction
    st.markdown('<div class="chart-title">Client count prediction</div>', unsafe_allow_html=True)
    
    months = ['Sep', 'Oct', 'Nov']
    years = ['2023', '2024', '2025']
    
    # Create a DataFrame for grouped bar chart
    data_dict = {
        'Month': months * 3,
        'Year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'Count': [36.29, 32.74, 25.48, 39.01, 28.44, 41.74, 45.56, 24.46, 25.34]
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
    # Events details
    st.markdown('<div class="chart-title">Events details</div>', unsafe_allow_html=True)
    
    months = ['Sep', 'Oct', 'Nov']
    years = ['2023', '2024', '2025']
    
    # Create a DataFrame for grouped bar chart
    data_dict = {
        'Month': months * 3,
        'Year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'Count': [240, 290, 320, 250, 220, 200, 350, 340, 340]
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
    # Entitlements prediction
    st.markdown('<div class="chart-title">Entitlements prediction</div>', unsafe_allow_html=True)
    
    months = ['Sep', 'Oct', 'Nov']
    years = ['2023', '2024', '2025']
    
    # Create a DataFrame for grouped bar chart
    data_dict = {
        'Month': months * 3,
        'Year': ['2023'] * 3 + ['2024'] * 3 + ['2025'] * 3,
        'Count': [34.26, 24.59, 14.79, 20.07, 27.27, 13.91, 36.87, 36.36, 35.34]
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

# Corporate action types
st.markdown('<div class="section-title">Corporate Action Types</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    # Corporate action distribution
    st.markdown('<div class="chart-title">Corporate Action Distribution</div>', unsafe_allow_html=True)
    
    action_types = ['Dividend', 'Rights Issue', 'Stock Split', 'Bonus', 'Merger/Acquisition', 'Others']
    percentages = [40, 15, 12, 10, 8, 15]
    
    fig = px.pie(
        values=percentages, 
        names=action_types,
        color_discrete_sequence=['#0052cc', '#FF6B35', '#FFC107', '#673ab7', '#28a745', '#6c757d']
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
    # Corporate action trend
    st.markdown('<div class="chart-title">Corporate Action Trend</div>', unsafe_allow_html=True)
    
    months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    dividends = [55, 48, 62, 70, 58, 65]
    rights = [15, 20, 18, 22, 25, 28]
    splits = [10, 15, 12, 8, 14, 16]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=months, 
        y=dividends,
        mode='lines+markers',
        name='Dividend',
        line=dict(color='#0052cc', width=3),
        marker=dict(size=8)
    ))
    fig.add_trace(go.Scatter(
        x=months, 
        y=rights,
        mode='lines+markers',
        name='Rights Issue',
        line=dict(color='#FF6B35', width=3),
        marker=dict(size=8)
    ))
    fig.add_trace(go.Scatter(
        x=months, 
        y=splits,
        mode='lines+markers',
        name='Stock Split',
        line=dict(color='#FFC107', width=3),
        marker=dict(size=8)
    ))
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Count'),
        height=300,
        legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5)
    )
    st.plotly_chart(fig, use_container_width=True)

# Corporate action processing
st.markdown('<div class="section-title">Corporate Action Processing</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    # Processing efficiency
    st.markdown('<div class="chart-title">Processing Efficiency</div>', unsafe_allow_html=True)
    
    action_types = ['Dividend', 'Rights Issue', 'Stock Split', 'Bonus', 'Merger/Acquisition']
    efficiency = [92, 85, 88, 90, 82]
    
    fig = px.bar(
        x=action_types, 
        y=efficiency,
        color_discrete_sequence=['#006400']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='', tickangle=45),
        yaxis=dict(title='Efficiency (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # Processing time
    st.markdown('<div class="chart-title">Average Processing Time (Days)</div>', unsafe_allow_html=True)
    
    action_types = ['Dividend', 'Rights Issue', 'Stock Split', 'Bonus', 'Merger/Acquisition']
    days = [2, 5, 3, 4, 7]
    
    fig = px.bar(
        x=action_types, 
        y=days,
        color_discrete_sequence=['#FF6B35']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='', tickangle=45),
        yaxis=dict(title='Days'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

with col3:
    # SLA adherence
    st.markdown('<div class="chart-title">SLA Adherence (%)</div>', unsafe_allow_html=True)
    
    action_types = ['Dividend', 'Rights Issue', 'Stock Split', 'Bonus', 'Merger/Acquisition']
    adherence = [98, 92, 95, 96, 90]
    
    fig = px.bar(
        x=action_types, 
        y=adherence,
        color_discrete_sequence=['#673ab7']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title='', tickangle=45),
        yaxis=dict(title='Adherence (%)'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Payment aging and Tickets aging in the footer
display_footer()
