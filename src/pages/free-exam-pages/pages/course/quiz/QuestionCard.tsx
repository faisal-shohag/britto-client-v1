import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/utils/markdown-renderer";
import { useState } from "react";
export const QuestionCard = ({ question, handleAnswer }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className=" px-3 bg-white py-3 rounded-lg border dark:bg-zinc-900">
      <MarkdownRenderer content={question.title} />

      <div>
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <Button
                key={opt.id}
                variant={"outline"}
                className={`w-full justify-start ${
                  isSelected ? "bg-blue-500 hover:bg-blue-500 text-white" : ""
                }`}
                onClick={() => {
                  if (!selected) {
                    setSelected(opt.id);
                    handleAnswer({ questionId: question.id, optionId: opt.id });
                  }
                }}
              >
                {opt.title}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
