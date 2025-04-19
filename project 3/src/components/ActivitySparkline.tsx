import React from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { DailySummary } from '../types';

interface ActivitySparklineProps {
  dailySummaries: DailySummary[];
  activity: string;
}

const ActivitySparkline: React.FC<ActivitySparklineProps> = ({ dailySummaries, activity }) => {
  const data = dailySummaries
    .slice()
    .reverse()
    .map(day => day.activities[activity] || 0)
    .slice(0, 14); // Last 14 days

  if (data.every(value => value === 0)) {
    return null;
  }

  return (
    <div className="w-24 h-8">
      <Sparklines data={data} height={32}>
        <SparklinesLine
          style={{
            stroke: "rgba(147, 51, 234, 0.5)",
            strokeWidth: 2,
            fill: "none"
          }}
        />
        <SparklinesSpots
          size={2}
          style={{
            stroke: "rgba(147, 51, 234, 0.9)",
            strokeWidth: 2,
            fill: "white"
          }}
        />
      </Sparklines>
    </div>
  );
};

export default ActivitySparkline;