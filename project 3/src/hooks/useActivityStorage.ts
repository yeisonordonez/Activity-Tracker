import { useState, useEffect } from 'react';
import { ActivityLog, ActivitySummary, DailySummary, ActivityRate } from '../types';
import { parseTimeToSeconds, formatDate } from '../utils/timeUtils';

const STORAGE_KEY = 'activityLogs';
const RATES_KEY = 'activityRates';

export function useActivityStorage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<ActivitySummary[]>([]);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [rates, setRates] = useState<ActivityRate[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedLogs = localStorage.getItem(STORAGE_KEY);
    const savedRates = localStorage.getItem(RATES_KEY);
    
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    if (savedRates) {
      setRates(JSON.parse(savedRates));
    }
  }, []);

  // Update summary whenever logs or rates change
  useEffect(() => {
    const summaryData: Record<string, { seconds: number; rate?: ActivityRate }> = {};
    const dailyData: Record<string, Record<string, number>> = {};
    
    logs.forEach(log => {
      // Overall summary
      if (!summaryData[log.activity]) {
        summaryData[log.activity] = {
          seconds: 0,
          rate: rates.find(r => r.activity === log.activity)
        };
      }
      summaryData[log.activity].seconds += log.durationInSeconds;

      // Daily summary
      const date = formatDate(new Date(log.startTime));
      if (!dailyData[date]) {
        dailyData[date] = {};
      }
      if (!dailyData[date][log.activity]) {
        dailyData[date][log.activity] = 0;
      }
      dailyData[date][log.activity] += log.durationInSeconds;
    });

    // Convert summary data
    const summaryArray = Object.entries(summaryData).map(([activity, data]) => ({
      activity,
      totalSeconds: data.seconds,
      hourlyRate: data.rate?.hourlyRate,
      currency: data.rate?.currency,
      totalBillable: data.rate ? (data.seconds / 3600) * data.rate.hourlyRate : undefined
    }));

    // Convert daily data
    const dailySummaryArray = Object.entries(dailyData).map(([date, activities]) => {
      let billableAmount = 0;
      Object.entries(activities).forEach(([activity, seconds]) => {
        const rate = rates.find(r => r.activity === activity);
        if (rate) {
          billableAmount += (seconds / 3600) * rate.hourlyRate;
        }
      });

      return {
        date,
        activities,
        totalSeconds: Object.values(activities).reduce((a, b) => a + b, 0),
        billableAmount: billableAmount || undefined
      };
    });

    setSummary(summaryArray);
    setDailySummaries(dailySummaryArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs, rates]);

  const addActivityLog = (newLog: ActivityLog) => {
    setLogs(prevLogs => [...prevLogs, newLog]);
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      setLogs([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const updateActivityRate = (rate: ActivityRate) => {
    setRates(prevRates => {
      const newRates = prevRates.filter(r => r.activity !== rate.activity);
      newRates.push(rate);
      localStorage.setItem(RATES_KEY, JSON.stringify(newRates));
      return newRates;
    });
  };

  const getActivityRate = (activity: string) => {
    return rates.find(r => r.activity === activity);
  };

  return { 
    logs, 
    summary, 
    dailySummaries, 
    addActivityLog, 
    clearLogs,
    updateActivityRate,
    getActivityRate
  };
}