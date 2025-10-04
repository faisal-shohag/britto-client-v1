
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatQuiz } from "@/lib/format-quiz";
import MarkdownRenderer from "@/utils/markdown-renderer";

export default function QuizQuestionViewer({ quizData }) {
    const data = formatQuiz(quizData);
  return (
    <div className="space-y-6">
      {data.map((item, index) =>
        item.question ? (
          <QuestionCard key={index} question={item.question} />
        ) : (
          <ContextBlock key={index} context={item.quizContext} />
        )
      )}
    </div>
  );
}

function ContextBlock({ context }) {
  return (
    <div className="space-y-4">
      <Card className="">
        <CardContent>
          <div className="mb-5"><MarkdownRenderer content={context.contextText}/></div>
      <div className="space-y-3">
                {context.questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
      </div>
        </CardContent>
      </Card>

  
    </div>
  );
}

function QuestionCard({ question }) {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);


  return (
    <Card className="">
      <CardHeader>
        <CardTitle><MarkdownRenderer content={question.title}/></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isCorrect = opt.id === question.correctOption;
            const isSelected = selected === opt.id;
            return (
              <Button
                key={opt.id}
                variant={isSelected ? (isCorrect ? "secondary" : "destructive") : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  if (!selected) {
                    setSelected(opt.id);
                    setShowExplanation(true);
                  }
                }}
              >
                {opt.title}
              </Button>
            );
          })}

          {showExplanation && (
            <>
              <Separator className="my-2" />
              <p className="text-sm text-gray-600">
                ✅ সঠিক উত্তর:{" "}
                <strong>
                  {question.options.find((o) => o.id === question.correctOption)?.title}
                </strong>
              </p>
              {question.explanation && (
                <p className="text-sm text-green-700 mt-1">
                  💡 ব্যাখ্যা: {question.explanation}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
