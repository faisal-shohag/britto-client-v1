import { FreeUserContext } from "@/context/FreeUser.context";
import { useUserAnswerSheet } from "@/hooks/free-exam-hooks/use-leaderboard";
import { use } from "react";
import { useParams } from "react-router";
import { AnswerSheet } from "./answer-sheet";
import { useExamAccess } from "@/hooks/free-exam-hooks/user-user-exams";
import { Spinner } from "../components/Splash";

const ExamAnswerSheet = () => {
  const { id: examId } = useParams() as any;
  const { user } = use(FreeUserContext) as any;
  const { data, isLoading } = useUserAnswerSheet(user.id, examId);
  const { data: accessData, isLoading: accessLoading } = useExamAccess(
    examId,
    user.id
  );

  if (isLoading || accessLoading) return <div>
    <Spinner/>
    Loading...</div>;
  const { answers } = data;
  const { hasParticipated } = accessData;
  console.log(accessData)

  return (
    <div>
      {hasParticipated ? 
        <AnswerSheet answers={answers} />
       : 
        <div>তুমি এই এক্সাম টি দাও নি!</div>
      }
    </div>
  );
};

export default ExamAnswerSheet;
