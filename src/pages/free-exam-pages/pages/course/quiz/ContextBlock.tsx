import { Card, CardContent } from "@/components/ui/card";
import MarkdownRenderer from "@/utils/markdown-renderer";
import { QuestionCard } from "./QuestionCard";

export const ContextBlock = ({ context, handleAnswer }) => {
  return (
    <div className="space-y-4">
      <Card className="">
        <CardContent>
          <div className="mb-5"><MarkdownRenderer content={context.contextText}/></div>
      <div className="space-y-3">
                {context.questions.map((question) => (
        <QuestionCard handleAnswer={handleAnswer} key={question.id} question={question} />
      ))}
      </div>
        </CardContent>
      </Card>

  
    </div>
  );
}