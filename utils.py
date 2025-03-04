import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

def set_page_config(title):
    """Configure the page settings."""
    st.set_page_config(
        page_title=title,
        page_icon="📊",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
def load_css():
    """Load custom CSS."""
    with open("style.css", "r") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def create_card(title, value, subtitle="", icon=None, color="#ffffff"):
    """Create a metric card with custom styling."""
    card_html = f"""
    <div class="metric-card" style="background-color: {color};">
        <div class="metric-title">{title}</div>
        <div class="metric-value">{value}</div>
        <div class="metric-subtitle">{subtitle}</div>
    </div>
    """
    return card_html

def display_header(data):
    """Display the header metrics section."""
    col1, col2, col3, col4, col5, col6 = st.columns(6)
    
    with col1:
        st.markdown("""
        <div class="metric-container">
            <div class="metric-title">Customers</div>
            <div class="metric-value">139860</div>
            <div class="metric-subtitle">New customers</div>
            <div class="metric-subvalue">20800</div>
            <div class="metric-subtext">Last 1 month</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="metric-container">
            <div class="metric-title">Income</div>
            <div class="metric-value">₹80.51.872</div>
            <div class="metric-subtitle">New income</div>
            <div class="metric-subvalue">₹25.61.736</div>
            <div class="metric-subtext">Last 3 months</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="metric-container">
            <div class="metric-title">Open events</div>
            <div class="metric-value">16</div>
            <div class="metric-subtitle">Open entitlements</div>
            <div class="metric-subvalue">5059041</div>
            <div class="metric-subtext">All months</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="metric-container">
            <div class="metric-title">Total trades</div>
            <div class="metric-value">1021258</div>
            <div class="metric-subtitle">Total volume</div>
            <div class="metric-subvalue">11853498</div>
            <div class="metric-subtext">All months</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col5:
        st.markdown("""
        <div class="metric-container">
            <div class="metric-title">CA Processing</div>
            <div class="metric-subtitle">Predictions</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col6:
        st.markdown("""
        <div class="metric-container">
            <div class="metric-title">Deal processing</div>
            <div class="metric-subtitle">Predictions</div>
        </div>
        """, unsafe_allow_html=True)

def display_footer():
    """Display the footer with payment aging and tickets aging."""
    st.markdown('<div class="section-divider"></div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('<div class="footer-title">Payment aging</div>', unsafe_allow_html=True)
        
        col1_1, col1_2, col1_3, col1_4 = st.columns(4)
        
        with col1_1:
            st.markdown("""
            <div class="payment-card payment-green">
                <div class="payment-title">0-30 Days</div>
                <div class="payment-value">₹2,679</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col1_2:
            st.markdown("""
            <div class="payment-card payment-yellow">
                <div class="payment-title">31-60 Days</div>
                <div class="payment-value">₹0</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col1_3:
            st.markdown("""
            <div class="payment-card payment-orange">
                <div class="payment-title">61-90 Days</div>
                <div class="payment-value">₹3,669,666</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col1_4:
            st.markdown("""
            <div class="payment-card payment-red">
                <div class="payment-title">91+ Days</div>
                <div class="payment-value">₹36,805</div>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="footer-title">Tickets aging</div>', unsafe_allow_html=True)
        
        col2_1, col2_2, col2_3, col2_4 = st.columns(4)
        
        with col2_1:
            st.markdown("""
            <div class="ticket-card ticket-green">
                <div class="ticket-title">0-15 days</div>
                <div class="ticket-circle">0</div>
                <div class="ticket-label">Open</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2_2:
            st.markdown("""
            <div class="ticket-card ticket-yellow">
                <div class="ticket-title">16-30 days</div>
                <div class="ticket-circle">2</div>
                <div class="ticket-label">Open</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2_3:
            st.markdown("""
            <div class="ticket-card ticket-orange">
                <div class="ticket-title">31-45 days</div>
                <div class="ticket-circle">7</div>
                <div class="ticket-label">Open</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2_4:
            st.markdown("""
            <div class="ticket-card ticket-red">
                <div class="ticket-title">45+ days</div>
                <div class="ticket-circle">29</div>
                <div class="ticket-label">Open</div>
            </div>
            """, unsafe_allow_html=True)
