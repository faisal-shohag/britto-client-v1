import React from 'react';
import { useExams } from '@/hooks/free-exam-hooks/use-exams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Users, 
  Target,
  ArrowRight,
  Calendar
} from 'lucide-react';
// import { format } from 'date-fns';
import { Link } from 'react-router';

interface RecentExamsProps {
  limit?: number;
  packageId?: number;
  userId?: number;
  onViewExam?: (id: number) => void;
  onViewAll?: () => void;
}

// const statusColors = {
//   DRAFT: 'bg-zinc-500/10 text-zinc-400',
//   PUBLISHED: 'bg-blue-500/10 text-blue-400',
//   ACTIVE: 'bg-green-500/10 text-green-400',
//   COMPLETED: 'bg-orange-500/10 text-orange-400',
//   ARCHIVED: 'bg-red-500/10 text-red-400',
// };

export const RecentExams: React.FC<RecentExamsProps> = ({
  limit = 15,
  packageId,
  userId,
  onViewExam,
  onViewAll,
}) => {
  const { data, isLoading } = useExams({ 
    packageId, 
    userId,
    limit,
    page: 1 
  });

  if (isLoading) {
    return (
      <Card >
        <CardHeader>
          <CardTitle >পরীক্ষাসমূহ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border ">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 " />
                <Skeleton className="h-3 w-1/2 " />
              </div>
              <Skeleton className="h-6 w-16 " />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data?.exams.length) {
    return (
      <Card >
        <CardHeader>
          <CardTitle >পরীক্ষাসমূহ</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12  mx-auto mb-3" />
          <div className="mb-2">No exams found</div>
          <div className="text-sm ">
            Create your first exam to get started
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-zinc-900/50 dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="dark:text-zinc-100">পরীক্ষাসমূহ</CardTitle>
          {onViewAll && data.exams.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onViewAll}
              className="dark:text-zinc-400 hover:text-zinc-300"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data.exams.map((exam) => (
          <Link to={`/free/exam/${exam.id}`}     key={exam.id}>
          <div 
            key={exam.id}
            className="flex items-center gap-3 p-3 rounded-lg border dark:border-zinc-700/50 hover:border-zinc-600/50 transition-colors cursor-pointer"
            onClick={() => onViewExam?.(exam.id)}
          >
            <Avatar className="h-10 w-10 border dark:border-zinc-700">
              <AvatarImage src={exam.image} alt={exam.title} />
              <AvatarFallback className="dark:bg-zinc-800 dark:text-zinc-400 text-sm">
                {exam.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium dark:text-zinc-100 truncate pr-2">
                  {exam.title}
                </h4>
                {/* <Badge 
                  variant="outline" 
                  className={`${statusColors[exam.status]} text-xs shrink-0`}
                >
                  {exam.status}
                </Badge> */}
              </div>
              
              <div className="flex items-center gap-4 text-xs dark:text-zinc-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{exam.durationInMinutes} মিনিট</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>{exam.totalMarks} মার্কস</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{exam._count?.leaderboard || 0} জন</span>
                </div>
              </div>

              {/* <div className='text-xs'>
                <div>Start: {format(exam.startTime, 'yyyy-MM-dd hh:mm:ss a')}</div>
              </div> */}
              
              {/* <div className="text-xs dark:text-zinc-600 mt-1">
                Created {formatDistanceToNow(new Date(exam.startTime), { addSuffix: true })}
              </div> */}
            </div>
          </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};