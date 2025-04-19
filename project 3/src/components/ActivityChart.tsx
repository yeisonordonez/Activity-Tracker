import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ActivitySummary } from '../types';
import { formatTime } from '../utils/timeUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityChartProps {
  summary: ActivitySummary[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ summary }) => {
  const data = {
    labels: summary.map(item => item.activity),
    datasets: [
      {
        label: 'Time Spent (hours)',
        data: summary.map(item => (item.totalSeconds / 3600).toFixed(2)),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const seconds = context.raw * 3600;
            return `Time: ${formatTime(seconds)}`;
          },
        },
        animation: {
          duration: 200
        },
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    hover: {
      mode: 'nearest',
      intersect: false,
      animationDuration: 200
    }
  };

  return (
    <div className="h-[300px] w-full slide-in" style={{ animationDelay: '0.2s' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ActivityChart;