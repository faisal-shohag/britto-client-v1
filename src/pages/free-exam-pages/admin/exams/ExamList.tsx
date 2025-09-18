import React, { useState } from 'react';
import { useExams, useDeleteExam } from '@/hooks/free-exam-hooks/use-exams';
import type { ExamFilters } from '@/hooks/free-exam-hooks/use-exams';
import { ExamCard } from './ExamCard'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  Users,
  Target,
  PlayCircle
} from 'lucide-react';


interface ExamListProps {
  onCreateExam?: () => void;
  onEditExam?: (id: number) => void;
  onViewExam?: (id: number) => void;
  onManageQuestions?: (id: number) => void;
  onViewResults?: (id: number) => void;
  packageId?: number;
  userId?: number;
}

export const ExamList: React.FC<ExamListProps> = ({
  onCreateExam,
  onEditExam,
  onViewExam,
  onManageQuestions,
  onViewResults,
  packageId,
  userId,
}) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deleteExamId, setDeleteExamId] = useState<number | null>(null);

  const filters: ExamFilters = {
    page,
    limit: 12,
    ...(selectedStatus && { status: selectedStatus }),
    ...(packageId && { packageId }),
    ...(userId && { userId }),
  };

  const { data, isLoading, error } = useExams(filters);
  const deleteExamMutation = useDeleteExam();

  const handleDeleteConfirm = () => {
    if (deleteExamId) {
      deleteExamMutation.mutate(deleteExamId);
      setDeleteExamId(null);
    }
  };

  const filteredExams = data?.exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.package.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = React.useMemo(() => {
    if (!data?.exams) return { total: 0, active: 0, completed: 0, totalParticipants: 0 };
    
    const total = data.exams.length;
    const active = data.exams.filter(exam => exam.status === 'ACTIVE').length;
    const completed = data.exams.filter(exam => exam.status === 'COMPLETED').length;
    const totalParticipants = data.exams.reduce((sum, exam) => sum + (exam._count?.leaderboard || 0), 0);
    
    return { total, active, completed, totalParticipants };
  }, [data]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-2">Failed to load exams</div>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">
            {packageId ? 'Package Exams' : userId ? 'My Exams' : 'All Exams'}
          </h1>
          <p className="text-zinc-400 mt-1">
            {packageId ? 'Manage exams in this package' : userId ? 'Exams created by you' : 'Manage and organize your exams'}
          </p>
        </div>
        <Button 
          onClick={onCreateExam}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Exam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Exams</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Active Exams</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.active}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.completed}</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-800 border-zinc-700 text-zinc-100">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-300 hover:bg-zinc-800">All Status</SelectItem>
                <SelectItem value="DRAFT" className="text-zinc-300 hover:bg-zinc-800">Draft</SelectItem>
                <SelectItem value="PUBLISHED" className="text-zinc-300 hover:bg-zinc-800">Published</SelectItem>
                <SelectItem value="ACTIVE" className="text-zinc-300 hover:bg-zinc-800">Active</SelectItem>
                <SelectItem value="COMPLETED" className="text-zinc-300 hover:bg-zinc-800">Completed</SelectItem>
                <SelectItem value="ARCHIVED" className="text-zinc-300 hover:bg-zinc-800">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || selectedStatus) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-zinc-400">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedStatus && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Status: {selectedStatus}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                }}
                className="text-zinc-400 hover:text-zinc-300 ml-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exam Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                    <Skeleton className="h-3 w-16 bg-zinc-800" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full bg-zinc-800 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-6 bg-zinc-800" />
                  <Skeleton className="h-6 bg-zinc-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">
              {searchTerm || selectedStatus ? 'No exams found' : 'No exams yet'}
            </h3>
            <p className="text-zinc-500 mb-4">
              {searchTerm || selectedStatus 
                ? 'Try adjusting your search or filters'
                : 'Create your first exam to get started'
              }
            </p>
            {!searchTerm && !selectedStatus && (
              <Button onClick={onCreateExam} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Exam
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
        
            <ExamCard
             key={exam.id}
              exam={exam}
              onView={onViewExam}
              onEdit={onEditExam}
              onDelete={setDeleteExamId}
              onManageQuestions={onManageQuestions}
              onViewResults={onViewResults}
            />
      
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(data.totalPages, page - 2 + i));
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  className={
                    pageNum === page
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteExamId} 
        onOpenChange={() => setDeleteExamId(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Delete Exam</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this exam? This action cannot be undone 
              and will remove all associated questions, answers, and leaderboard data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteExamMutation.isPending}
            >
              {deleteExamMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};