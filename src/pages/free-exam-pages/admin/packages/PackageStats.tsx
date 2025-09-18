import React from 'react';
import { usePackages } from '@/hooks/free-exam-hooks/use-packages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Package as PackageIcon, 
  BookOpen, 
  TrendingUp, 
  Users,
  BarChart3
} from 'lucide-react';

interface PackageStatsProps {
  group?: 'SCIENCE' | 'ARTS' | 'COMMERCE';
}

export const PackageStats: React.FC<PackageStatsProps> = ({ group }) => {
  const { data, isLoading } = usePackages({ group, limit: 1000 }); // Get all packages for stats

  const stats = React.useMemo(() => {
    if (!data?.packages) return null;

    const totalPackages = data.packages.length;
    const totalExams = data.packages.reduce((sum, pkg) => sum + pkg.freeExams.length, 0);
    const activeExams = data.packages.reduce((sum, pkg) => 
      sum + pkg.freeExams.filter(exam => exam.status === 'ACTIVE').length, 0
    );
    const avgExamsPerPackage = totalPackages > 0 ? totalExams / totalPackages : 0;

    const packagesByGroup = data.packages.reduce((acc, pkg) => {
      acc[pkg.group] = (acc[pkg.group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPackages,
      totalExams,
      activeExams,
      avgExamsPerPackage: Math.round(avgExamsPerPackage * 10) / 10,
      packagesByGroup,
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

  const statCards = [
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: PackageIcon,
      color: 'text-blue-400',
    },
    {
      title: 'Total Exams',
      value: stats.totalExams,
      icon: BookOpen,
      color: 'text-green-400',
    },
    {
      title: 'Active Exams',
      value: stats.activeExams,
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      title: 'Avg Exams/Package',
      value: stats.avgExamsPerPackage,
      icon: BarChart3,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!group && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Packages by Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {stats.packagesByGroup.SCIENCE || 0}
                </div>
                <div className="text-sm text-zinc-400">Science</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.packagesByGroup.ARTS || 0}
                </div>
                <div className="text-sm text-zinc-400">Arts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {stats.packagesByGroup.COMMERCE || 0}
                </div>
                <div className="text-sm text-zinc-400">Commerce</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};