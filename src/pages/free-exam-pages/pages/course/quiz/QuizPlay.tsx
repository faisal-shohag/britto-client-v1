import { useGetQuizById } from "@/hooks/course/use-quiz";
import { useParams } from "react-router";
import { QuestionCard } from "./QuestionCard";
import { ContextBlock } from "./ContextBlock";
import { formatQuiz } from "@/lib/format-quiz";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useFreeUser from "@/hooks/free-exam-hooks/use-free-user";

interface UserAnswer {
  questionId: number;
  optionId: number;
  userId: number;
}
const QuizPlay = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const user = useFreeUser()
  const { quizId } = useParams();
  const { data: quizData, isLoading } = useGetQuizById(Number(quizId));
  if (isLoading) return <div>Loading...</div>;
  const data = formatQuiz(quizData);

  const handleAnswer = ({questionId, optionId}: {questionId:number, optionId:number}) => {
    const newAnswers = [...userAnswers, {questionId, optionId, userId: user.id}];
    setUserAnswers([...newAnswers])
  }

  console.log(data);
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 fixed top-0 w-full left-0 shadow-lg flex z-50 justify-between items-center px-3 border">
        <div>
          <img
            className="h-12 w-12"
            src="https://i.postimg.cc/TYpCjqyD/image.png"
          />
        </div>
        <h1 className="text-xl font-bold">{quizData.title}</h1>

        <div className="font-bold">19:09</div>
      </div>
      <div className="mt-13 space-y-3">
        {data.map((item, index) =>
          item.question ? (
            <QuestionCard handleAnswer={handleAnswer} key={index} question={item.question} />
          ) : (
            <ContextBlock handleAnswer={handleAnswer} key={index} context={item.quizContext} />
          )
        )}
      </div>

      <div className="text-center">
        <Button className="bg-gradient-to-r from-green-500 to to-cyan-500 border">
          সাবমিট করো
        </Button>
      </div>
    </div>
  );
};

export default QuizPlay;
