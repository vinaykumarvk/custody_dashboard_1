import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { generateChartConfig } from '../utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartComponent = ({ type, data, options, height = '100%' }) => {
  // Generate chart config with Smart Bank styling
  const chartConfig = generateChartConfig(type, { data, ...options });
  
  // Render appropriate chart based on type
  const renderChart = () => {
    const chartProps = {
      data: chartConfig.data,
      options: chartConfig.options || {}
    };
    
    switch (type.toLowerCase()) {
      case 'line':
        return <Line data={chartProps.data} options={chartProps.options} />;
      case 'bar':
        return <Bar data={chartProps.data} options={chartProps.options} />;
      case 'pie':
        return <Pie data={chartProps.data} options={chartProps.options} />;
      case 'doughnut':
        return <Doughnut data={chartProps.data} options={chartProps.options} />;
      default:
        return <Line data={chartProps.data} options={chartProps.options} />;
    }
  };

  return (
    <div className="chart-container" style={{ height }}>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;