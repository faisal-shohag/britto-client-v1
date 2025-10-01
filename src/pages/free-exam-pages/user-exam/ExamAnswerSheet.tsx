import { FreeUserContext } from "@/context/FreeUser.context";
import { useUserAnswerSheet } from "@/hooks/free-exam-hooks/use-leaderboard";
import { use } from "react";
import { useParams } from "react-router";
import { AnswerSheet } from "./answer-sheet";
import { useExamAccess } from "@/hooks/free-exam-hooks/user-user-exams";
import { Spinner } from "../components/Splash";
import { useQuestionsByExam } from "@/hooks/free-exam-hooks/use-questions";
import { AnswerSheetCommon } from "./answer-sheet-common";

const ExamAnswerSheet = ({isUser}) => {
  const { id: examId, userId } = useParams() as any;
  const { user } = use(FreeUserContext) as any;
  const { data, isLoading } = useUserAnswerSheet(isUser? userId : user.id, examId);
  const { data: examData, isLoading: questionLoading } =
    useQuestionsByExam(examId);
  const { data: accessData, isLoading: accessLoading } = useExamAccess(
    examId,
    user.id
  );

  if (isLoading || accessLoading || questionLoading)
    return (
      <div className="flex justify-center flex-col items-center">
        <Spinner />
        উত্তরপত্র লোড হচ্ছে...
      </div>
    );


  const { timeStatus, hasParticipated } = accessData;

  if(user.role ==="ADMIN" && isUser){
    return  <AnswerSheet examData={data} />
  }

// console.log(accessData)
  return (
    <div>
      {hasParticipated ? (
        <AnswerSheet examData={data} />
      ) : (
        <>
          {timeStatus.isAfterEnd && !hasParticipated ? (
            <>
            <AnswerSheetCommon data={examData}/>
            </>
          ) : (
            <>এক্সামটি এখনো শেষ হয়নি!</>
          )}
        </>
      )}
    </div>
  );
};

export default ExamAnswerSheet;
