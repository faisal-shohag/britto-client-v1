import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExamForm } from './ExamForm';
import { useCreateExam, useUpdateExam, useExam} from '@/hooks/free-exam-hooks/use-exams';
import type  { CreateExamData } from '@/hooks/free-exam-hooks/use-exams';

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId?: number;
  mode?: 'create' | 'edit';
  currentUserId: number;
  defaultPackageId?: number;
}

export const ExamDialog: React.FC<ExamDialogProps> = ({
  open,
  onOpenChange,
  examId,
  mode = 'create',
  currentUserId,
  defaultPackageId,
}) => {
  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();
  
  const { data: examData } = useExam(examId || 0);

  const handleSubmit = (data: CreateExamData) => {
    if (mode === 'create') {
        console.log(data)
      createExamMutation.mutate({
        ...data,
        ...(defaultPackageId && !data.packageId && { packageId: defaultPackageId }),
      }, {
        onSuccess: () => onOpenChange(false),
      });
    } else if (examId) {
      updateExamMutation.mutate(
        { id: examId, data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    }
  };

  const isLoading = createExamMutation.isPending || updateExamMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {mode === 'create' ? 'Create Exam' : 'Edit Exam'}
          </DialogTitle>
        </DialogHeader>
        
        <ExamForm
          initialData={mode === 'edit' ? examData : { packageId: defaultPackageId }}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          submitLabel={mode === 'create' ? 'Create Exam' : 'Update Exam'}
          currentUserId={currentUserId}
        />
      </DialogContent>
    </Dialog>
  );
};