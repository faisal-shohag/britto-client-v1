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
import { usePackage } from '@/hooks/free-exam-hooks/use-packages';
import { 
  Edit, 
  BookOpen, 
  Calendar,
  Clock,
  Play,
  Archive,
  CheckCircle,
  FileText
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface PackageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: number;
  onEdit?: (id: number) => void;
}

const statusIcons = {
  DRAFT: <FileText className="h-4 w-4" />,
  PUBLISHED: <BookOpen className="h-4 w-4" />,
  ACTIVE: <Play className="h-4 w-4" />,
  COMPLETED: <CheckCircle className="h-4 w-4" />,
  ARCHIVED: <Archive className="h-4 w-4" />,
};

const statusColors = {
  DRAFT: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  PUBLISHED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
  COMPLETED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  ARCHIVED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const groupColors = {
  SCIENCE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ARTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  COMMERCE: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export const PackageDetailDialog: React.FC<PackageDetailDialogProps> = ({
  open,
  onOpenChange,
  packageId,
  onEdit,
}) => {
  const { data: packageData, isLoading, error } = usePackage(packageId);



  const stats:any = React.useMemo(() => {
    if (!packageData?.freeExams) return {};
    
    const examsByStatus = packageData.freeExams.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: packageData.freeExams.length,
      ...examsByStatus,
    };
  }, [packageData]);

    if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="sr-only">Package Details</DialogTitle>
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
                <Skeleton key={i} className="h-20 bg-zinc-800" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Failed to load package details</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : packageData ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-16 w-16 border-2 border-zinc-700">
                  <AvatarImage src={packageData.image} alt={packageData.title} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xl font-bold">
                    {packageData.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-zinc-100 mb-2">
                    {packageData.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${groupColors[packageData.group]} border`}>
                      {packageData.group}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      Created {formatDistanceToNow(new Date(packageData.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {packageData.description && (
                    <p className="text-zinc-400 leading-relaxed">
                      {packageData.description}
                    </p>
                  )}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => onEdit?.(packageData.id)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Package
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">{stats.total || 0}</div>
                  <div className="text-sm text-zinc-400">Total Exams</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <Play className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">{stats.ACTIVE || 0}</div>
                  <div className="text-sm text-zinc-400">Active</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">{stats.COMPLETED || 0}</div>
                  <div className="text-sm text-zinc-400">Completed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">{stats.DRAFT || 0}</div>
                  <div className="text-sm text-zinc-400">Draft</div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4 text-center">
                  <Archive className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-zinc-100">{stats.ARCHIVED || 0}</div>
                  <div className="text-sm text-zinc-400">Archived</div>
                </CardContent>
              </Card>
            </div>

            {/* Exams List */}
            <Card className="bg-zinc-800/30 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-zinc-100 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Exams ({packageData.freeExams.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {packageData.freeExams.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                    <div className="text-zinc-400 mb-2">No exams yet</div>
                    <div className="text-sm text-zinc-500">
                      Exams will appear here once they are added to this package
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {packageData.freeExams.map((exam) => (
                      <div 
                        key={exam.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-zinc-800">
                            {statusIcons[exam.status]}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-100">
                              {exam.title}
                            </div>
                            <div className="text-sm text-zinc-500">
                              Exam ID: {exam.id}
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={`${statusColors[exam.status]} border`}>
                          {exam.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="bg-zinc-800/30 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-zinc-100 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Package Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Created</div>
                      <div className="text-zinc-300">
                        {format(new Date(packageData.createdAt), 'PPP')} at{' '}
                        {format(new Date(packageData.createdAt), 'p')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Last Updated</div>
                      <div className="text-zinc-300">
                        {format(new Date(packageData.updatedAt), 'PPP')} at{' '}
                        {format(new Date(packageData.updatedAt), 'p')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Package ID</div>
                      <div className="text-zinc-300 font-mono">
                        {packageData.id}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Academic Group</div>
                      <Badge className={`${groupColors[packageData.group]} border`}>
                        {packageData.group}
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