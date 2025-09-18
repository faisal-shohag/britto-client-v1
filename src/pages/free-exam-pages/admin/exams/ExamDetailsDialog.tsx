import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useExam } from '@/hooks/free-exam-hooks/use-exams';
import { 
  Edit, 
  BookOpen, 
  Calendar,
  Users,
  Trophy,
  Target,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  AlertCircle,

  BarChart3,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow, format, isAfter, isBefore } from 'date-fns';

interface ExamDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: number;
  onEdit?: (id: number) => void;
  onManageQuestions?: (id: number) => void;
  onViewResults?: (id: number) => void;
}

const statusConfig = {
  DRAFT: {
    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Draft'
  },
  PUBLISHED: {
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: <BookOpen className="h-4 w-4" />,
    label: 'Published'
  },
  ACTIVE: {
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: <PlayCircle className="h-4 w-4" />,
    label: 'Active'
  },
  COMPLETED: {
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Completed'
  },
  ARCHIVED: {
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: <PauseCircle className="h-4 w-4" />,
    label: 'Archived'
  },
};

const groupColors = {
  SCIENCE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ARTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  COMMERCE: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export const ExamDetailDialog: React.FC<ExamDetailDialogProps> = ({
  open,
  onOpenChange,
  examId,
  onEdit,
  onManageQuestions,
  onViewResults,
}) => {
  const { data: examData, isLoading, error } = useExam(examId);

  if (!open) return null;

  const getTimeStatus = (exam: any) => {
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    
    const isUpcoming = isAfter(startTime, now);
    const isOngoing = isBefore(startTime, now) && isAfter(endTime, now);
    // const isEnded = isBefore(endTime, now);
    
    if (isUpcoming) {
      return {
        label: 'Starts in',
        time: formatDistanceToNow(startTime),
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
      };
    } else if (isOngoing) {
      return {
        label: 'Ends in',
        time: formatDistanceToNow(endTime),
        color: 'text-green-400',
        bgColor: 'bg-green-500/10'
      };
    } else {
      return {
        label: 'Ended',
        time: formatDistanceToNow(endTime, { addSuffix: true }),
        color: 'text-zinc-400',
        bgColor: 'bg-zinc-500/10'
      };
    }
  };

  const participationRate = examData?._count ? 
    Math.min(100, Math.round((examData._count.leaderboard / Math.max(examData._count.leaderboard, 50)) * 100)) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="sr-only">Exam Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/4 bg-zinc-800" />
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 bg-zinc-800" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Failed to load exam details</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : examData ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-16 w-16 border-2 border-zinc-700">
                  <AvatarImage src={examData.image} alt={examData.title} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xl font-bold">
                    {examData.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-zinc-100 mb-2">
                    {examData.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${statusConfig[examData.status].color} border`}>
                      {statusConfig[examData.status].icon}
                      <span className="ml-1">{statusConfig[examData.status].label}</span>
                    </Badge>
                    <Badge className={`${groupColors[examData.package.group]} border`}>
                      {examData.package.group}
                    </Badge>
                    {examData.type && (
                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                        {examData.type}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-zinc-500 mb-2">
                    Package: {examData.package.title}
                  </p>
                  
                  {examData.description && (
                    <p className="text-zinc-400 leading-relaxed">
                      {examData.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onManageQuestions?.(examData.id)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Questions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEdit?.(examData.id)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            {/* Time Status Card */}
            {examData && (
              (() => {
                const timeStatus = getTimeStatus(examData);
                return (
                  <Card className={`${timeStatus.bgColor} border-zinc-700`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-lg font-semibold ${timeStatus.color}`}>
                            {timeStatus.label}: {timeStatus.time}
                          </div>
                          <div className="text-sm text-zinc-400">
                            {format(new Date(examData.startTime), 'PPP • p')} - {format(new Date(examData.endTime), 'PPP • p')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-zinc-400">Duration</div>
                          <div className="text-lg font-medium text-zinc-200">
                            {examData.durationInMinutes} minutes
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">
                    {examData._count?.examQuestions || 0}
                  </div>
                  <div className="text-sm text-zinc-400">Questions</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">
                    {examData._count?.leaderboard || 0}
                  </div>
                  <div className="text-sm text-zinc-400">Participants</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">
                    {examData.totalMarks}
                  </div>
                  <div className="text-sm text-zinc-400">Total Marks</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">
                    {examData.negativeMark || 0}
                  </div>
                  <div className="text-sm text-zinc-400">Negative Mark</div>
                </CardContent>
              </Card>
            </div>

            {/* Participation Progress */}
            {examData._count && examData._count.leaderboard > 0 && (
              <Card className="bg-zinc-800/30 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-zinc-100 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Participation Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Students Participated</span>
                      <span className="text-zinc-200 font-medium">
                        {examData._count.leaderboard} students
                      </span>
                    </div>
                    <Progress value={participationRate} className="h-3 bg-zinc-800" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-400">
                          {examData._count.leaderboard}
                        </div>
                        <div className="text-xs text-zinc-500">Participated</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-blue-400">
                          {examData._count.answers || 0}
                        </div>
                        <div className="text-xs text-zinc-500">Total Answers</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-400">
                          {participationRate}%
                        </div>
                        <div className="text-xs text-zinc-500">Participation</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-zinc-800/30 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-zinc-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => onManageQuestions?.(examData.id)}
                    className="flex items-center justify-center gap-2 h-16 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Manage Questions</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => onViewResults?.(examData.id)}
                    className="flex items-center justify-center gap-2 h-16 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Trophy className="h-5 w-5" />
                    <span>View Results</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => onEdit?.(examData.id)}
                    className="flex items-center justify-center gap-2 h-16 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Edit Exam</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="bg-zinc-800/30 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-zinc-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Exam Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Created By</div>
                      <div className="text-zinc-300">{examData.user.name}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Created</div>
                      <div className="text-zinc-300">
                        {format(new Date(examData.createdAt), 'PPP')} at{' '}
                        {format(new Date(examData.createdAt), 'p')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Last Updated</div>
                      <div className="text-zinc-300">
                        {format(new Date(examData.updatedAt), 'PPP')} at{' '}
                        {format(new Date(examData.updatedAt), 'p')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Exam ID</div>
                      <div className="text-zinc-300 font-mono">{examData.id}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Package</div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-300">{examData.package.title}</span>
                        <Badge className={`${groupColors[examData.package.group]} border text-xs`}>
                          {examData.package.group}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Current Status</div>
                      <Badge className={`${statusConfig[examData.status].color} border`}>
                        {statusConfig[examData.status].icon}
                        <span className="ml-1">{statusConfig[examData.status].label}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};