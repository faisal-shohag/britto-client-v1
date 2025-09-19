import { useExam } from "@/hooks/free-exam-hooks/use-exams";
import { useParams } from "react-router";
import ExamCard from "../components/ExamCard";
import { Leaderboard } from "./leaderboard";
import { useExamAccess } from "@/hooks/free-exam-hooks/user-user-exams";
import { use } from "react";
import { FreeUserContext } from "@/context/FreeUser.context";
import { Participants } from "./participants";
import { Spinner } from "../components/Splash";

const ExamDetails = () => {
  const { id } = useParams() as any;
  const {user} = use(FreeUserContext) as any
  const { data: exam, isLoading } = useExam(id) as any;
  const { data: accessData, isLoading: loading } = useExamAccess(id, user.id);
  if(loading || isLoading) return <div>
    <Spinner/>
  </div>
 const timeStatus = accessData?.timeStatus
 console.log(accessData)
  return (
    <div className="space-y-5">
      <ExamCard exam={exam} loading={isLoading} hasParticipated={accessData.hasParticipated}/>
      {
        timeStatus.isAfterEnd ?<Leaderboard examId={id} userId={user.id} /> : <Participants examId={id} userId={user.id}/>
      }
      
    </div>
  );
};

export default ExamDetails;
