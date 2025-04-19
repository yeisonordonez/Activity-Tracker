import React from 'react';
import { ActivityLog as ActivityLogType } from '../types';
import { Clock } from 'lucide-react';

interface ActivityLogProps {
  logs: ActivityLogType[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          Activity Log
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-2" />
        </h2>
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          No activities logged yet. Start tracking to see your history here.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-500" />
        Activity Log
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-2" />
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr 
                key={log.id} 
                className="hover:bg-gray-50/50 backdrop-blur-sm transition-colors"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.activity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {log.duration}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {log.startTime}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {log.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;