export interface ActivityLog {
  id: string;
  activity: string;
  duration: string;
  startTime: string;
  endTime: string;
  durationInSeconds: number;
  hourlyRate?: number;
  currency?: string;
}

export interface ActivitySummary {
  activity: string;
  totalSeconds: number;
  hourlyRate?: number;
  currency?: string;
  totalBillable?: number;
}

export interface DailySummary {
  date: string;
  activities: {
    [key: string]: number;
  };
  totalSeconds: number;
  billableAmount?: number;
}

export interface ActivityRate {
  activity: string;
  hourlyRate: number;
  currency: string;
}