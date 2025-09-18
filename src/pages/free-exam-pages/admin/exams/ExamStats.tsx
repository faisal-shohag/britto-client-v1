import React from 'react';
import { useExams } from '@/hooks/free-exam-hooks/use-exams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 

  CheckCircle2, 
  Users,

  Target,
  TrendingUp,

} from 'lucide-react';

interface ExamStatsProps {
  packageId?: number;
  userId?: number;
}

export const ExamStats: React.FC<ExamStatsProps> = ({ packageId, userId }) => {
  const { data, isLoading } = useExams({ 
    packageId, 
    userId,
    limit: 1000 
  });

  const stats = React.useMemo(() => {
    if (!data?.exams) return null;

    const totalExams = data.exams.length;
    const activeExams = data.exams.filter(exam => exam.status === 'ACTIVE').length;
    const completedExams = data.exams.filter(exam => exam.status === 'COMPLETED').length;
    const totalParticipants = data.exams.reduce((sum, exam) => sum + (exam._count?.leaderboard || 0), 0);
    const totalQuestions = data.exams.reduce((sum, exam) => sum + (exam._count?.examQuestions || 0), 0);
    const totalMarks = data.exams.reduce((sum, exam) => sum + exam.totalMarks, 0);

    const examsByStatus = data.exams.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgParticipants = totalExams > 0 ? Math.round(totalParticipants / totalExams) : 0;

    return {
      totalExams,
      activeExams,
      completedExams,
      totalParticipants,
      totalQuestions,
      totalMarks,
      avgParticipants,
      examsByStatus,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-8 mb-4 bg-zinc-800" />
              <Skeleton className="h-8 w-16 mb-2 bg-zinc-800" />
              <Skeleton className="h-4 w-24 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const mainStatCards = [
    {
      title: 'Total Exams',
      value: stats.totalExams,
      icon: BookOpen,
      color: 'text-blue-400',
      subtitle: `${stats.activeExams} active`,
    },
    {
      title: 'Total Questions',
      value: stats.totalQuestions,
      icon: Target,
      color: 'text-green-400',
      subtitle: `${stats.totalMarks} total marks`,
    },
    {
      title: 'Total Participants',
      value: stats.totalParticipants,
      icon: Users,
      color: 'text-purple-400',
      subtitle: `${stats.avgParticipants} avg per exam`,
    },
    {
      title: 'Completed Exams',
      value: stats.completedExams,
      icon: CheckCircle2,
      color: 'text-orange-400',
      subtitle: `${Math.round((stats.completedExams / Math.max(stats.totalExams, 1)) * 100)}% completion rate`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mainStatCards.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">{stat.title}</p>
                <p className="text-zinc-500 text-xs mt-1">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exam Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-400">
                {stats.examsByStatus.DRAFT || 0}
              </div>
              <div className="text-sm text-zinc-500">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.examsByStatus.PUBLISHED || 0}
              </div>
              <div className="text-sm text-zinc-500">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.examsByStatus.ACTIVE || 0}
              </div>
              <div className="text-sm text-zinc-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {stats.examsByStatus.COMPLETED || 0}
              </div>
              <div className="text-sm text-zinc-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {stats.examsByStatus.ARCHIVED || 0}
              </div>
              <div className="text-sm text-zinc-500">Archived</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};