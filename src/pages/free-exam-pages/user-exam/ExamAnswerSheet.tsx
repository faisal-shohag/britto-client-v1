import { FreeUserContext } from "@/context/FreeUser.context";
import { useUserAnswerSheet } from "@/hooks/free-exam-hooks/use-leaderboard";
import { use } from "react";
import { useParams } from "react-router";
import { AnswerSheet } from "./answer-sheet";
import { useExamAccess } from "@/hooks/free-exam-hooks/user-user-exams";

const ExamAnswerSheet = () => {
  const { id: examId } = useParams() as any;
  const { user } = use(FreeUserContext) as any;
  const { data, isLoading } = useUserAnswerSheet(user.id, examId);
  const { data: accessData, isLoading: accessLoading } = useExamAccess(
    examId,
    user.id
  );

  if (isLoading || accessLoading) return <div>Loading...</div>;
  const { answers } = data;
  const { timeStatus } = accessData;

  return (
    <div>
      {timeStatus.isAferEnd ? (
        <AnswerSheet answers={answers} />
      ) : (
        <div>Result is not published yet!</div>
      )}
    </div>
  );
};

export default ExamAnswerSheet;
