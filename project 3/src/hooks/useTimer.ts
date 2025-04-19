import { useState, useRef, useCallback } from 'react';
import { formatTime } from '../utils/timeUtils';

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setStartDateTime(new Date());
    
    intervalRef.current = window.setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }, [isRunning]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsRunning(false);
    return {
      seconds: time,
      startTime: startDateTime as Date,
      endTime: new Date(),
      formattedDuration: formatTime(time)
    };
  }, [isRunning, time, startDateTime]);

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTime(0);
    setIsRunning(false);
    setStartDateTime(null);
  }, []);

  // Clean up interval on component unmount
  const cleanup = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return {
    time,
    isRunning,
    startDateTime,
    formattedTime: formatTime(time),
    start,
    stop,
    reset,
    cleanup
  };
}