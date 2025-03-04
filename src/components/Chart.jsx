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
    switch (type.toLowerCase()) {
      case 'line':
        return <Line {...chartConfig} />;
      case 'bar':
        return <Bar {...chartConfig} />;
      case 'pie':
        return <Pie {...chartConfig} />;
      case 'doughnut':
        return <Doughnut {...chartConfig} />;
      default:
        return <Line {...chartConfig} />;
    }
  };

  return (
    <div className="chart-container" style={{ height }}>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;