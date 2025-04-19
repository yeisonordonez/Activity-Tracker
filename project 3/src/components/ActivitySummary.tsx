import React from 'react';
import { ActivitySummary as ActivitySummaryType, DailySummary, ActivityLog } from '../types';
import { formatTime } from '../utils/timeUtils';
import { PieChart, Trash2, DollarSign } from 'lucide-react';
import ActivityChart from './ActivityChart';
import ActivitySparkline from './ActivitySparkline';
import ActivityTimeline from './ActivityTimeline';

interface ActivitySummaryProps {
  summary: ActivitySummaryType[];
  dailySummaries: DailySummary[];
  onClearLogs: () => void;
  logs: ActivityLog[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ summary, dailySummaries, onClearLogs, logs }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(amount);
  };

  if (summary.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <PieChart className="w-6 h-6 text-purple-500" />
          Activity Summary
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ml-2" />
        </h2>
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
          No activities logged yet. Start tracking to see your summary here.
        </div>
      </div>
    );
  }

  const sortedSummary = [...summary].sort((a, b) => b.totalSeconds - a.totalSeconds);
  
  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-purple-500" />
            Activity Summary
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ml-2" />
          </h2>
          <button
            onClick={onClearLogs}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </button>
        </div>

        <div className="mb-8">
          <ActivityChart summary={sortedSummary} />
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Activity Timeline</h3>
          <ActivityTimeline logs={logs} />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50 backdrop-blur-sm">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billable Amount
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend (14 days)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSummary.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50/50 backdrop-blur-sm transition-colors"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.activity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {formatTime(item.totalSeconds)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.totalBillable && item.currency ? (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(item.totalBillable, item.currency)}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not billable</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ActivitySparkline
                      dailySummaries={dailySummaries}
                      activity={item.activity}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dailySummaries.map((day, index) => (
        <div 
          key={day.date}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 overflow-hidden slide-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {new Date(day.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(day.activities).map(([activity, seconds], actIndex) => (
                  <tr 
                    key={activity}
                    className="hover:bg-gray-50/50 backdrop-blur-sm transition-colors"
                    style={{
                      animation: `fadeIn 0.3s ease-out ${actIndex * 0.1}s both`
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {formatTime(seconds)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 font-mono">
                    {formatTime(day.totalSeconds)}
                  </td>
                </tr>
                {day.billableAmount && (
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700">
                      Total Billable
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700 font-mono">
                      {formatCurrency(day.billableAmount, 'USD')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySummary;