import React, { useState } from 'react';
import { ExamAccessGate } from './exam-acccess-gate';
import { ExamInterface } from './exam-interfaces';

interface UserExamProps {
  examId: number;
  userId: number;
}

export const UserExam: React.FC<UserExamProps> = ({ examId, userId }) => {
  const [hasAccess, setHasAccess] = useState(false);

  if (!hasAccess) {
    return (
      <ExamAccessGate
        examId={examId}
        userId={userId}
        onAccessGranted={() => setHasAccess(true)}
      />
    );
  }

  return <ExamInterface examId={examId} userId={userId} />;
};