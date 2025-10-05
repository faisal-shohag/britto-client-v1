import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { bnNumber } from "@/lib/bnNumbers";
import { MessageCircleQuestionMarkIcon, TimerIcon } from "lucide-react";

const QuizView = ({ content }) => {
  const { quiz } = content;

  return (

      <Card className="min-h-[200px] flex flex-col items-center justify-center ">
        <div >
          <div className="space-y-2 text-center">
            <h1 className="font-bold">{quiz.title}</h1>
            <div className="text-sm">
              <div className="flex items-center justify-center gap-1">
                <TimerIcon size={16} /> {bnNumber(quiz.duration)} মিনিট |{" "}
                <MessageCircleQuestionMarkIcon size={16} /> প্রশ্ন{" "}
                {bnNumber(quiz.duration)} টি
              </div>
            </div>
            <Button
              size={"sm"}
              className="bg-gradient-to-r from-red-500 to-pink-500"
            >
              শুরু করো
            </Button>
          </div>
        </div>
      </Card>
  );
};

export default QuizView;
