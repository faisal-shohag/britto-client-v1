import React, { use, useState } from 'react';
import { ExamList } from './ExamList';
import { ExamDialog } from './ExamDialog';
import { ExamDetailDialog } from './ExamDetailsDialog'
import { FreeUserContext } from '@/context/FreeUser.context';

interface ExamManagementProps {
  packageId?: number;
  showUserExams?: boolean;
}

 const ExamManagement: React.FC<ExamManagementProps> = ({ 
  packageId,
  showUserExams = false
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const {user} = use(FreeUserContext) as any

  const handleCreateExam = () => {
    setCreateDialogOpen(true);
  };

  const handleEditExam = (id: number) => {
    setSelectedExamId(id);
    setEditDialogOpen(true);
  };

  const handleViewExam = (id: number) => {
    setSelectedExamId(id);
    setDetailDialogOpen(true);
  };

  const handleManageQuestions = (id: number) => {
    // This would typically navigate to a questions management page
    console.log('Manage questions for exam:', id);
  };

  const handleViewResults = (id: number) => {
    // This would typically navigate to a results/leaderboard page
    console.log('View results for exam:', id);
  };

  const handleEditFromDetail = (id: number) => {
    setDetailDialogOpen(false);
    setSelectedExamId(id);
    setEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <ExamList
          onCreateExam={handleCreateExam}
          onEditExam={handleEditExam}
          onViewExam={handleViewExam}
          onManageQuestions={handleManageQuestions}
          onViewResults={handleViewResults}
          packageId={packageId}
          userId={showUserExams ?  user.id : undefined}
        />

        {/* Create Exam Dialog */}
        <ExamDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          mode="create"
          currentUserId={ user.id}
          defaultPackageId={packageId}
        />

        {/* Edit Exam Dialog */}
        <ExamDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setSelectedExamId(null);
          }}
          examId={selectedExamId || undefined}
          mode="edit"
           currentUserId={user.id}
        />

        {/* Exam Detail Dialog */}
        {selectedExamId && (
          <ExamDetailDialog
            open={detailDialogOpen}
            onOpenChange={(open) => {
              setDetailDialogOpen(open);
              if (!open) setSelectedExamId(null);
            }}
            examId={selectedExamId}
            onEdit={handleEditFromDetail}
            onManageQuestions={handleManageQuestions}
            onViewResults={handleViewResults}
          />
        )}
      </div>
    </div>
  );
};

export default ExamManagement;