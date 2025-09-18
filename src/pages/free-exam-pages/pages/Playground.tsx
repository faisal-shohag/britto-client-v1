
import { useParams } from "react-router";
import { UserExam } from "../user-exam/exam-main";
import { use } from "react";
import { FreeUserContext } from "@/context/FreeUser.context";


const ExamComponent: React.FC = () => {
  const {id:examId} = useParams() as any
  const { user } = use(FreeUserContext) as any





  return (
    <>
    <UserExam examId={examId} userId={user.id}/>
    </>
  );
};

export default ExamComponent;
