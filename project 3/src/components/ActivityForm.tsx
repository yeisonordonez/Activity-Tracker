import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { Play, Square, RotateCcw, DollarSign } from 'lucide-react';
import { ActivityLog, ActivityRate } from '../types';
import { generateId } from '../utils/timeUtils';

interface ActivityFormProps {
  onActivityComplete: (log: ActivityLog) => void;
  onUpdateRate: (rate: ActivityRate) => void;
  getActivityRate: (activity: string) => ActivityRate | undefined;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  onActivityComplete, 
  onUpdateRate,
  getActivityRate 
}) => {
  const [activityName, setActivityName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { time, isRunning, formattedTime, start, stop, reset, cleanup } = useTimer();

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  useEffect(() => {
    if (activityName) {
      const rate = getActivityRate(activityName);
      if (rate) {
        setHourlyRate(rate.hourlyRate.toString());
        setCurrency(rate.currency);
      }
    }
  }, [activityName, getActivityRate]);

  const handleStart = () => {
    if (activityName.trim() === '') {
      alert('Please enter an activity name');
      return;
    }
    
    if (hourlyRate) {
      onUpdateRate({
        activity: activityName,
        hourlyRate: parseFloat(hourlyRate),
        currency
      });
    }
    
    start();
  };

  const handleStop = () => {
    const result = stop();
    if (result) {
      const { seconds, startTime, endTime, formattedDuration } = result;
      
      const newLog: ActivityLog = {
        id: generateId(),
        activity: activityName,
        duration: formattedDuration,
        startTime: startTime.toLocaleString(),
        endTime: endTime.toLocaleString(),
        durationInSeconds: seconds,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        currency: hourlyRate ? currency : undefined
      };
      
      onActivityComplete(newLog);
      setActivityName('');
      setHourlyRate('');
      reset();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2 slide-in">
        Start New Activity
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-2" />
      </h2>
      
      <div className="space-y-6">
        <div className="slide-in" style={{ animationDelay: '0.1s' }}>
          <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-2">
            Activity Name
          </label>
          <input
            type="text"
            id="activityName"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            disabled={isRunning}
            placeholder="e.g. UI Design, Coding, Meeting"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 slide-in" style={{ animationDelay: '0.15s' }}>
          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="hourlyRate"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                disabled={isRunning}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={isRunning}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className={`timer-display text-6xl font-mono text-center py-8 my-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-100 shadow-inner transition-all duration-300 ${isRunning ? 'timer-pulse' : ''}`}>
        <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {formattedTime}
        </div>
      </div>
      
      <div className="flex gap-4 slide-in" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg text-white font-medium transition-all duration-300 transform ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0'
          }`}
        >
          <Play className="w-5 h-5" />
          Start
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg text-white font-medium transition-all duration-300 transform ${
            !isRunning 
              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0'
          }`}
        >
          <Square className="w-5 h-5" />
          Stop
        </button>
        
        {time > 0 && !isRunning && (
          <button
            onClick={reset}
            className="flex items-center justify-center p-4 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityForm;