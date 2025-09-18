import React from 'react';
import type { Exam } from '@/hooks/free-exam-hooks/use-exams';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Users,
  Trophy,
  PlayCircle,
  PauseCircle,
  Calendar,
  Timer,
  Target,
  BookOpen,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow, format, isAfter, isBefore } from 'date-fns';
import { Link } from 'react-router';

interface ExamCardProps {
  exam: Exam;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onManageQuestions?: (id: number) => void;
  onViewResults?: (id: number) => void;
}

const statusConfig = {
  DRAFT: {
    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    icon: <AlertCircle className="h-3 w-3" />,
    label: 'Draft'
  },
  PUBLISHED: {
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: <BookOpen className="h-3 w-3" />,
    label: 'Published'
  },
  ACTIVE: {
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: <PlayCircle className="h-3 w-3" />,
    label: 'Active'
  },
  COMPLETED: {
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: 'Completed'
  },
  ARCHIVED: {
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: <PauseCircle className="h-3 w-3" />,
    label: 'Archived'
  },
};

const groupColors = {
  SCIENCE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ARTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  COMMERCE: 'bg-green-500/10 text-green-400 border-green-500/20',
  HUMANITY: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onView,
  onEdit,
  onDelete,
  onManageQuestions,
  onViewResults,
}) => {
  const now = new Date();
  const startTime = new Date(exam.startTime);
  const endTime = new Date(exam.endTime);
  
  const isUpcoming = isAfter(startTime, now);
  const isOngoing = isBefore(startTime, now) && isAfter(endTime, now);
  const isEnded = isBefore(endTime, now);
  
  const statusInfo = statusConfig[exam.status];
  const progress = exam._count ? 
    Math.round((exam._count.leaderboard / Math.max(exam._count.leaderboard, 100)) * 100) : 0;

  const getTimeStatus = () => {
    if (isUpcoming) {
      return {
        label: 'Starts in',
        time: formatDistanceToNow(startTime),
        color: 'text-blue-400',
        icon: <Clock className="h-4 w-4" />
      };
    } else if (isOngoing) {
      return {
        label: 'Ends in',
        time: formatDistanceToNow(endTime),
        color: 'text-green-400',
        icon: <Timer className="h-4 w-4" />
      };
    } else {
      return {
        label: 'Ended',
        time: formatDistanceToNow(endTime, { addSuffix: true }),
        color: 'text-zinc-400',
        icon: <CheckCircle2 className="h-4 w-4" />
      };
    }
  };

  const timeStatus = getTimeStatus();


  return (
   <Card className="group hover:shadow-lg transition-all duration-200 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 relative overflow-hidden">
      {/* Status indicator stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isOngoing ? 'bg-green-500' : 
        isUpcoming ? 'bg-blue-500' : 
        isEnded ? 'bg-zinc-600' : 'bg-zinc-700'
      }`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
              <Link    to={`/free/admin/questionbyexam/${exam.id}`}>
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12 border-2 border-zinc-700">
              <AvatarImage src={exam.image} alt={exam.title} />
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-lg font-semibold">
                {exam.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-zinc-100 line-clamp-2 mb-1">
                {exam.title}
              </CardTitle>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`${statusInfo.color} text-xs border`}>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.label}</span>
                </Badge>
                
                <Badge variant="outline" className={`${groupColors[exam.package.group]} text-xs`}>
                  {exam.package.group}
                </Badge>
              </div>
              
              <p className="text-xs text-zinc-500 truncate">
                {exam.package.title}
              </p>
            </div>
          </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-zinc-800"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
              <DropdownMenuItem 
                onClick={() => onView?.(exam.id)}
                className="hover:bg-zinc-800 text-zinc-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onManageQuestions?.(exam.id)}
                className="hover:bg-zinc-800 text-zinc-300"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Questions
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onViewResults?.(exam.id)}
                className="hover:bg-zinc-800 text-zinc-300"
              >
                <Trophy className="mr-2 h-4 w-4" />
                View Results
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={() => onEdit?.(exam.id)}
                className="hover:bg-zinc-800 text-zinc-300"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Exam
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(exam.id)}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Exam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {exam.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
            {exam.description}
          </p>
        )}
        
        {/* Exam Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Timer className="h-4 w-4" />
            <span>{exam.durationInMinutes}min</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Target className="h-4 w-4" />
            <span>{exam.totalMarks} marks</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <BookOpen className="h-4 w-4" />
            <span>{exam._count?.examQuestions || 0} questions</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="h-4 w-4" />
            <span>{exam._count?.leaderboard || 0} taken</span>
          </div>
        </div>

        {/* Time Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
          <div className="flex items-center gap-2">
            <div className={timeStatus.color}>
              {timeStatus.icon}
            </div>
            <span className="text-sm text-zinc-300">
              {timeStatus.label}: <span className={timeStatus.color}>{timeStatus.time}</span>
            </span>
          </div>
          
          {exam._count && exam._count.leaderboard > 0 && (
            <div className="text-xs text-zinc-500">
              {exam._count.leaderboard} participants
            </div>
          )}
        </div>

        {/* Schedule Info */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span>Start:</span>
            <span>{format(startTime, 'MMM dd, yyyy • hh:mm a')}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-500">
            <span>End:</span>
            <span>{format(endTime, 'MMM dd, yyyy • hh:mm a')}</span>
          </div>
        </div>

        {/* Progress Bar for participation */}
        {exam._count && exam._count.leaderboard > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
              <span>Participation</span>
              <span>{exam._count.leaderboard} students</span>
            </div>
            <Progress value={progress} className="h-2 bg-zinc-800" />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Created {formatDistanceToNow(new Date(exam.createdAt), { addSuffix: true })}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onManageQuestions?.(exam.id)}
            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <BookOpen className="mr-1 h-3 w-3" />
            Questions
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onView?.(exam.id)}
            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
