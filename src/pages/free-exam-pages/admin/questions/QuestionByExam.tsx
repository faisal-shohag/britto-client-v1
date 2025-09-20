import { useParams } from "react-router";
import { QuestionList } from "./QuestionList";
const QuestionByExam = () => {
  const { id } = useParams() as { id: string }; // Type the params properly




  return (
    <div className="p-6 bg-zinc-950 min-h-screen">
      

        <QuestionList
          examId={Number(id)}
          showExplanation={true}
          showOptions={true}
        />
  
    </div>
  );
};

export default QuestionByExam;
