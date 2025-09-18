import React from 'react';
import type { ExamResultSummary } from '@/hooks/free-exam-hooks/use-leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface ResultSummaryProps {
  result: ExamResultSummary;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const { examInfo, userStats, submissionInfo } = result;
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (percentage >= 60) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (percentage >= 40) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getGradeFromPercentage = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-400' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-400' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-400' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400' };
    if (percentage >= 50) return { grade: 'C+', color: 'text-orange-400' };
    if (percentage >= 40) return { grade: 'C', color: 'text-orange-400' };
    return { grade: 'F', color: 'text-red-400' };
  };

  const gradeInfo = getGradeFromPercentage(userStats.percentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-zinc-100 mb-2">
                {examInfo.title}
              </CardTitle>
              <p className="text-zinc-400 mb-3">
                Package: {examInfo.package.title} • Group: {examInfo.package.group}
              </p>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Submitted {format(new Date(submissionInfo.submittedAt), 'PPP • p')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Time taken: {submissionInfo.timeTakenMinutes} minutes
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-bold ${gradeInfo.color} mb-1`}>
                {gradeInfo.grade}
              </div>
              <div className="text-sm text-zinc-400">Grade</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Score Card */}
        <Card className={`border ${getScoreColor(userStats.percentage)}`}>
          <CardContent className="p-6">
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-current" />
              <div className="text-3xl font-bold mb-2">
                {userStats.score} / {examInfo.totalMarks}
              </div>
              <div className="text-lg font-medium mb-4">
                {userStats.percentage.toFixed(1)}%
              </div>
              
              <Progress 
                value={userStats.percentage} 
                className="h-3 mb-4"
              />
              
              {userStats.rank && (
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">
                    Rank #{userStats.rank} of {userStats.totalParticipants}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <div>
                    <div className="text-lg font-semibold text-green-400">
                      {userStats.correctAnswers}
                    </div>
                    <div className="text-sm text-zinc-400">Correct</div>
                  </div>
                </div>
                <div className="text-right text-green-400">
                  +{userStats.correctAnswers} marks
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-400" />
                  <div>
                    <div className="text-lg font-semibold text-red-400">
                      {userStats.wrongAnswers}
                    </div>
                    <div className="text-sm text-zinc-400">Wrong</div>
                  </div>
                </div>
                <div className="text-right text-red-400">
                  -{(userStats.wrongAnswers * examInfo.negativeMark).toFixed(1)} marks
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-500/10 border-zinc-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-zinc-400" />
                  <div>
                    <div className="text-lg font-semibold text-zinc-400">
                      {userStats.unanswered}
                    </div>
                    <div className="text-sm text-zinc-400">Unanswered</div>
                  </div>
                </div>
                <div className="text-right text-zinc-400">
                  0 marks
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Stats */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-200 mb-1">
                {userStats.totalQuestions}
              </div>
              <div className="text-sm text-zinc-500">Total Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {((userStats.correctAnswers / userStats.totalQuestions) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-zinc-500">Accuracy</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {userStats.timeTaken}min
              </div>
              <div className="text-sm text-zinc-500">Time Used</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {examInfo.negativeMark > 0 ? examInfo.negativeMark : 'No'}
              </div>
              <div className="text-sm text-zinc-500">Negative Mark</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
