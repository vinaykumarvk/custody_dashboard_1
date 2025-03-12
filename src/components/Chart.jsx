import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const Chart = ({ type, data, options, height = '250px' }) => {
  const chartRef = useRef(null);

  // Default options with Smart Bank styling
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            size: 12
          },
          color: '#333'
        }
      }
    }
  };

  // Merge default options with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options
  };

  // Set height style for the container
  const containerStyle = {
    height: height,
    width: '100%'
  };

  // Render the appropriate chart type
  const renderChart = () => {
    switch (type.toLowerCase()) {
      case 'bar':
        return <Bar data={data} options={mergedOptions} />;
      case 'pie':
        return <Pie data={data} options={mergedOptions} />;
      case 'line':
        return <Line data={data} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />;
      default:
        return <div className="alert alert-warning">Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className="chart-container" style={containerStyle}>
      {renderChart()}
    </div>
  );
};

export default Chart;