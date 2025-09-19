import { useExam } from "@/hooks/free-exam-hooks/use-exams";
import { useParams } from "react-router";
import ExamCard from "../components/ExamCard";
import { Leaderboard } from "./leaderboard";
import { useExamAccess } from "@/hooks/free-exam-hooks/user-user-exams";
import { use } from "react";
import { FreeUserContext } from "@/context/FreeUser.context";
import { Participants } from "./participants";

const ExamDetails = () => {
  const { id } = useParams() as any;
  const {user} = use(FreeUserContext) as any
  const { data: exam, isLoading } = useExam(id) as any;
  const { data: accessData, isLoading: loading } = useExamAccess(id, user.id);
  if(loading) return <div>Loading...</div>
 const timeStatus = accessData?.timeStatus
  return (
    <div className="space-y-5">
      <ExamCard exam={exam} loading={isLoading} />
      {
        timeStatus.isAfterEnd ?<Leaderboard examId={id} /> : <Participants examId={id}/>
      }
      
    </div>
  );
};

export default ExamDetails;
