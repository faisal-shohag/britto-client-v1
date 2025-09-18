import React, { useState } from 'react';
import { useQuestions, useDeleteQuestion } from '@/hooks/free-exam-hooks/use-questions';
import type {  QuestionFilters } from '@/hooks/free-exam-hooks/use-questions';
import { QuestionCard } from './QuestionCard';
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
  HelpCircle,
  Target,
  BookOpen,
  // TrendingUp,
  Brain
} from 'lucide-react';

interface QuestionListProps {
  onCreateQuestion?: () => void;
  onEditQuestion?: (id: number) => void;
  onViewQuestion?: (id: number) => void;
  examId?: number;
  showOptions?: boolean;
  showExplanation?: boolean;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  onCreateQuestion,
  onEditQuestion,
  onViewQuestion,
  examId,
  showOptions = true,
  showExplanation = false,
}) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);

  const filters: QuestionFilters = {
    page,
    limit: 12,
    ...(selectedDifficulty && { difficulty: selectedDifficulty }),
    ...(selectedSubject && { subject: selectedSubject }),
    ...(examId && { examId }),
  };

  const { data, isLoading, error } = useQuestions(filters);
  const deleteQuestionMutation = useDeleteQuestion();

  const handleDeleteConfirm = () => {
    if (deleteQuestionId) {
      deleteQuestionMutation.mutate(deleteQuestionId);
      setDeleteQuestionId(null);
    }
  };

  const filteredQuestions = data?.questions.filter(question =>
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = React.useMemo(() => {
    if (!data?.questions) return { total: 0, easy: 0, medium: 0, hard: 0, totalOptions: 0 };
    
    const total = data.questions.length;
    const easy = data.questions.filter(q => q.difficulty === 'EASY').length;
    const medium = data.questions.filter(q => q.difficulty === 'MEDIUM').length;
    const hard = data.questions.filter(q => q.difficulty === 'HARD').length;
    const totalOptions = data.questions.reduce((sum, q) => sum + q.options.length, 0);
    
    return { total, easy, medium, hard, totalOptions };
  }, [data]);

  // Get unique subjects for filter
  const subjects = React.useMemo(() => {
    if (!data?.questions) return [];
    return [...new Set(data.questions.map(q => q.subject).filter(Boolean))] as string[];
  }, [data]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-2">Failed to load questions</div>
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
            {examId ? 'Exam Questions' : 'Question Bank'}
          </h1>
          <p className="text-zinc-400 mt-1">
            {examId ? 'Manage questions for this exam' : 'Create and manage your question repository'}
          </p>
        </div>
        <Button 
          onClick={onCreateQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Question
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Questions</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
              <HelpCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Options</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalOptions}</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Subjects</p>
                <p className="text-2xl font-bold text-zinc-100">{subjects.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Avg Options/Q</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {stats.total > 0 ? Math.round((stats.totalOptions / stats.total) * 10) / 10 : 0}
                </p>
              </div>
              <Brain className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      {/* <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-zinc-400" />
            <h3 className="font-medium text-zinc-200">Difficulty Distribution</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.easy}</div>
              <div className="text-sm text-zinc-500">Easy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
              <div className="text-sm text-zinc-500">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.hard}</div>
              <div className="text-sm text-zinc-500">Hard</div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Filters */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-800 border-zinc-700 text-zinc-100">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-300 hover:bg-zinc-800">All Difficulties</SelectItem>
                <SelectItem value="EASY" className="text-zinc-300 hover:bg-zinc-800">Easy</SelectItem>
                <SelectItem value="MEDIUM" className="text-zinc-300 hover:bg-zinc-800">Medium</SelectItem>
                <SelectItem value="HARD" className="text-zinc-300 hover:bg-zinc-800">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-800 border-zinc-700 text-zinc-100">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-300 hover:bg-zinc-800">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject} className="text-zinc-300 hover:bg-zinc-800">
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || selectedDifficulty || selectedSubject) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-zinc-400">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedDifficulty && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Difficulty: {selectedDifficulty}
                </Badge>
              )}
              {selectedSubject && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Subject: {selectedSubject}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDifficulty('');
                  setSelectedSubject('');
                }}
                className="text-zinc-400 hover:text-zinc-300 ml-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Grid */}
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
      ) : filteredQuestions.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">
              {searchTerm || selectedDifficulty || selectedSubject ? 'No questions found' : 'No questions yet'}
            </h3>
            <p className="text-zinc-500 mb-4">
              {searchTerm || selectedDifficulty || selectedSubject
                ? 'Try adjusting your search or filters'
                : 'Create your first question to get started'
              }
            </p>
            {!searchTerm && !selectedDifficulty && !selectedSubject && (
              <Button onClick={onCreateQuestion} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Question
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onView={onViewQuestion}
              onEdit={onEditQuestion}
              onDelete={setDeleteQuestionId}
              showOptions={showOptions}
              showExplanation={showExplanation}
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
        open={!!deleteQuestionId} 
        onOpenChange={() => setDeleteQuestionId(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Delete Question</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this question? This action cannot be undone 
              and will remove all associated options and explanations.
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
              disabled={deleteQuestionMutation.isPending}
            >
              {deleteQuestionMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};