import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Clock, AlertTriangle } from 'lucide-react';
import type { ExamData } from '@/hooks/free-exam-hooks/user-user-exams';

interface ExamHeaderProps {
  examData: ExamData;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  examData,
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
}) => {
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">
              {examData.title}
            </h1>
            {examData.description && (
              <p className="text-zinc-400 mb-3">
                {examData.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <Target className="h-4 w-4" />
                <span>Total Marks: {examData.totalMarks}</span>
              </div>
              
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="h-4 w-4" />
                <span>Duration: {examData.durationInMinutes} minutes</span>
              </div>
              
              {examData.negativeMark > 0 && (
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Negative Marking: -{examData.negativeMark}</span>
                </div>
              )}
            </div>
          </div>
          
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            <BookOpen className="h-3 w-3 mr-1" />
            {totalQuestions} Questions
          </Badge>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Progress</span>
            <span className="text-zinc-300">
              {answeredCount} of {totalQuestions} answered ({Math.round(progress)}%)
            </span>
          </div>
          
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{totalQuestions - answeredCount} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};