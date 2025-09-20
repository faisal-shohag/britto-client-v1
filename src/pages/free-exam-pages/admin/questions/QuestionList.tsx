import React, { useState } from 'react';
import { useCreateQuestion, useDeleteQuestion, useQuestionsByExam, type CreateQuestionData } from '@/hooks/free-exam-hooks/use-questions';
import { QuestionCard } from './QuestionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
} from 'lucide-react';
import api from '@/lib/api';
import { QuestionForm } from './QuestionForm';

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
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);
  const { data, isLoading, error } = useQuestionsByExam(examId as number);
  const deleteQuestionMutation = useDeleteQuestion();
 

  const handleDeleteConfirm = () => {
    if (deleteQuestionId) {
      deleteQuestionMutation.mutate(deleteQuestionId);
      setDeleteQuestionId(null);
    }
  };

    const createQuestionMutation = useCreateQuestion();
    const handleCreateQuestion = (data: CreateQuestionData) => {
      createQuestionMutation.mutate(
        { ...data }, // Include examId in the data
        {
          onSuccess: async (response) => {
            const { data } = response.data;
            await api.post(`/freeExam/exams/${examId}/questions/${data.id}`);
          },
          onError: (error) => {
            console.error("Failed to create question:", error);
          },
        }
      );
    };

    if(isLoading) {
      return (
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
      ) 
    }

  const {examData} = data
  const questions = data.questions


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
            {examId ?` ${examData.title}(${questions.length})` : 'Question Bank'}
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

        <QuestionForm
          onSubmit={handleCreateQuestion}
          isLoading={createQuestionMutation.isPending}
          submitLabel="Create Question"
        />

      {/* Question Grid */}
    { questions.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-12 text-center">
          No Question found!

          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question.question}
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