import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ActivityLog } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const datasets = Array.from(new Set(logs.map(log => log.activity))).map(activity => {
    const activityLogs = sortedLogs.filter(log => log.activity === activity);
    return {
      label: activity,
      data: activityLogs.map(log => ({
        x: new Date(log.startTime),
        y: log.durationInSeconds / 3600 // Convert to hours
      })),
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.5)`,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    };
  });

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
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context: any) => {
            return `Duration: ${context.parsed.y.toFixed(2)} hours`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Duration (hours)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 0,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full slide-in" style={{ animationDelay: '0.2s' }}>
      <Line data={{ datasets }} options={options} />
    </div>
  );
};

export default ActivityTimeline;