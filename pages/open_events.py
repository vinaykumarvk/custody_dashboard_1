import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils import display_header, display_footer, set_page_config, load_css
from data_generator import generate_sample_data

# Set page configuration
set_page_config("Dashboard – Open Events")

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
st.markdown('<h1 style="color: #006400;">Dashboard – Open Events</h1>', unsafe_allow_html=True)

# Display header metrics
display_header(data)

# Main content - Open Events dashboard
col1, col2, col3 = st.columns([2, 2, 1])

with col1:
    # Open CA events
    st.markdown('<div class="chart-title">Open CA events</div>', unsafe_allow_html=True)
    
    months = ['Aug', 'Sep', 'Oct', 'Nov']
    values = [5, 5, 4, 2]
    
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
    # Open entitlements
    st.markdown('<div class="chart-title">Open entitlements</div>', unsafe_allow_html=True)
    
    labels = ['Category A', 'Category B', 'Category C']
    values = [66, 33, 1]
    colors = ['#FFD700', '#FF6B35', '#0052cc']
    
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
        showlegend=True
    )
    # Add values to the pie chart
    annotations = []
    for i, label in enumerate(labels):
        value_text = "₹12,862.00" if i == 2 else "₹17,45,292.00" if i == 1 else "₹1,06,351.00"
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

# Event details
st.markdown('<div class="section-title">Event Details</div>', unsafe_allow_html=True)

# Create a sample DataFrame for event details
event_data = {
    'Event ID': ['EV001', 'EV002', 'EV003', 'EV004', 'EV005'],
    'Event Type': ['Dividend', 'Rights Issue', 'Bonus', 'Stock Split', 'Dividend'],
    'Security': ['HDFC Bank Ltd', 'Reliance Industries', 'TCS Ltd', 'Infosys Ltd', 'ITC Ltd'],
    'Record Date': ['2023-10-15', '2023-10-22', '2023-10-30', '2023-11-05', '2023-11-10'],
    'Status': ['Pending', 'In Progress', 'Pending', 'Pending', 'In Progress'],
    'Value (₹)': ['50,000', '1,25,000', '75,000', '60,000', '45,000']
}
event_df = pd.DataFrame(event_data)

# Display the DataFrame with styling
st.dataframe(
    event_df,
    column_config={
        "Event ID": st.column_config.TextColumn("Event ID"),
        "Event Type": st.column_config.TextColumn("Event Type"),
        "Security": st.column_config.TextColumn("Security"),
        "Record Date": st.column_config.DateColumn("Record Date", format="MMM DD, YYYY"),
        "Status": st.column_config.TextColumn("Status"),
        "Value (₹)": st.column_config.TextColumn("Value (₹)")
    },
    hide_index=True,
    use_container_width=True
)

# Event analytics
st.markdown('<div class="section-title">Event Analytics</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    # Events by status
    st.markdown('<div class="chart-title">Events by Status</div>', unsafe_allow_html=True)
    
    status = ['Pending', 'In Progress', 'Awaiting Approval', 'On Hold']
    counts = [8, 5, 2, 1]
    
    fig = px.pie(
        values=counts, 
        names=status,
        color_discrete_sequence=['#FFC107', '#FF6B35', '#0052cc', '#6c757d']
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
    # Events by type
    st.markdown('<div class="chart-title">Events by Type</div>', unsafe_allow_html=True)
    
    event_types = ['Dividend', 'Rights Issue', 'Stock Split', 'Bonus', 'Merger/Acquisition']
    counts = [6, 3, 3, 2, 2]
    
    fig = px.bar(
        x=event_types, 
        y=counts,
        color_discrete_sequence=['#0052cc']
    )
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=10, r=10, t=10, b=10),
        xaxis=dict(title=''),
        yaxis=dict(title='Count'),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)

# Entitlement details
st.markdown('<div class="section-title">Entitlement Details</div>', unsafe_allow_html=True)

# Create a sample DataFrame for entitlement details
entitlement_data = {
    'Entitlement ID': ['ENT001', 'ENT002', 'ENT003', 'ENT004', 'ENT005'],
    'Event Type': ['Dividend', 'Rights Issue', 'Dividend', 'Stock Split', 'Bonus'],
    'Client': ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'],
    'Security': ['HDFC Bank Ltd', 'Reliance Industries', 'ITC Ltd', 'Infosys Ltd', 'TCS Ltd'],
    'Quantity': ['1,000', '500', '750', '2,000', '1,500'],
    'Value (₹)': ['25,000', '75,000', '18,750', '40,000', '37,500']
}
entitlement_df = pd.DataFrame(entitlement_data)

# Display the DataFrame with styling
st.dataframe(
    entitlement_df,
    column_config={
        "Entitlement ID": st.column_config.TextColumn("Entitlement ID"),
        "Event Type": st.column_config.TextColumn("Event Type"),
        "Client": st.column_config.TextColumn("Client"),
        "Security": st.column_config.TextColumn("Security"),
        "Quantity": st.column_config.TextColumn("Quantity"),
        "Value (₹)": st.column_config.TextColumn("Value (₹)")
    },
    hide_index=True,
    use_container_width=True
)

# Payment aging and Tickets aging in the footer
display_footer()
