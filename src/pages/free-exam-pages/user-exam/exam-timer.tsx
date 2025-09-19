import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
  startTime?: string;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  durationInMinutes,
  onTimeUp,
  isActive,
  startTime,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60); // in seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // If startTime is provided, calculate actual remaining time
    if (startTime) {
      const start = new Date(startTime);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
      const remaining = Math.max(0, (durationInMinutes * 60) - elapsedSeconds);
      setTimeLeft(remaining);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        
        // Show warning when 5 minutes left
        if (newTime <= 300 && !isWarning) {
          setIsWarning(true);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, startTime, durationInMinutes, onTimeUp, isWarning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // const getProgressPercentage = () => {
  //   const totalSeconds = durationInMinutes * 60;
  //   return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  // };

  const getColorClasses = () => {
    if (timeLeft <= 300) return 'text-red-400 border-red-500/30 bg-red-500/5'; // 5 minutes
    if (timeLeft <= 900) return 'text-orange-400 border-orange-500/30 bg-orange-500/5'; // 15 minutes
    return '';
  };

  return (
    <div className={`${getColorClasses()} transition-colors duration-300`}>
      <div className="">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Clock className={`h-5 w-5 ${isWarning ? 'animate-pulse' : ''}`} />
              {isWarning && (
                <AlertTriangle className="h-3 w-3 text-red-400 absolute -top-1 -right-1" />
              )}
            </div>
            {/* <span className="text-sm font-medium">Time Remaining</span> */}
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${isWarning ? 'animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            {/* <div className="text-xs opacity-75">
              {Math.floor((timeLeft / (durationInMinutes * 60)) * 100)}% left
            </div> */}
          </div>
        </div>
        
        {/* Progress bar */}
        {/* <div className="mt-3">
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                timeLeft <= 300 ? 'bg-red-400' : 
                timeLeft <= 900 ? 'bg-orange-400' : 'bg-green-400'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};