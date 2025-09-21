import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface QuestionOption {
  id: number;
  optionText: string;
  description: string;
  image: string;
  isCorrect: boolean;
  optionOrder: number;
  questionId: number;
}

interface Question {
  id: number;
  question: string;
  description: string;
  explanation: string;
  correctOption: number;
  image: string;
  difficulty: string;
  subject: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
  options: QuestionOption[];
}

interface Answer {
  id: number;
  examId: number;
  questionId: number;
  order: number | null;
  marks: number;
  question: Question;
  selectedOption?: QuestionOption; // Optional, as user answers may not be provided
}

interface ExamData {
  examData: {
    title: string;
    negativeMark: number;
    durationInMinutes: number;
    totalMarks: number;
  };
  questions: Answer[];
}

interface AnswerSheetProps {
  data: ExamData;
}

export const AnswerSheetCommon: React.FC<AnswerSheetProps> = ({ data }) => {
  const { questions, examData } = data;




  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="dark:bg-zinc-900/50 bg-white dark:border-zinc-800">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="dark:text-zinc-100 text-lg">উত্তরপত্র - {examData.title}</CardTitle>
            <div>মোট নম্বর: {examData.totalMarks}</div>
          </div>
        </CardHeader>
      </Card>

      {/* Questions Display */}
      {questions.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="dark:text-zinc-400">No questions available.</p>
          </CardContent>
        </Card>
      ) : (
        questions.map((answer) => (
          <Card key={answer.id} className="">
            <CardHeader>
              <CardTitle className=" dark:text-zinc-100 leading-relaxed mt-4">
               {questions.findIndex(a => a.id === answer.id) + 1}. {answer.question.question}
              </CardTitle>
              {answer.question.description && (
                <p className="dark:text-zinc-400 mt-2">{answer.question.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Image */}
              {answer.question.image && (
                <div className="flex justify-center">
                  <img
                    src={answer.question.image}
                    alt="Question"
                    className="max-w-lg w-full rounded-lg border"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {answer.question.options && answer.question.options.length > 0 ? (
                  answer.question.options
                    .sort((a, b) => a.optionOrder - b.optionOrder)
                    .map((option, index) => {
                      const isSelected = answer.selectedOption && answer.selectedOption.id === option.id;
                      const isCorrect = option.isCorrect;
                      const isWrongSelection = isSelected && !isCorrect;

                      let borderColor = 'dark:border-zinc-700';
                      let bgColor = 'dark:bg-zinc-800/30';
                      let textColor = 'dark:text-zinc-200';

                      if (isCorrect) {
                        borderColor = 'border-green-500/50';
                        bgColor = 'bg-green-500/10';
                        textColor = 'dark:text-zinc-200';
                      } else if (isWrongSelection) {
                        borderColor = 'border-red-500/50';
                        bgColor = 'bg-red-500/10';
                        textColor = 'dark:text-zinc-200';
                      }

                      return (
                        <div
                          key={option.id}
                          className={`px-3 py-1 rounded-lg border ${borderColor} ${bgColor} transition-colors`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium shrink-0 ${
                                isCorrect
                                  ? 'bg-green-500/20 text-green-400'
                                  : isWrongSelection
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-white-700 text-zinc-400'
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1">
                              <div className={`${textColor} leading-relaxed flex items-center gap-2`}>
                                {option.optionText}
                                {isSelected && (
                                  <Badge variant="outline" className="text-xs ml-2">
                                    Your Answer
                                  </Badge>
                                )}
                                {isCorrect && (
                                  <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                                )}
                              </div>
                              {option.description && (
                                <div className="text-sm text-zinc-400 mt-2">{option.description}</div>
                              )}
                              {option.image && (
                                <div className="mt-3">
                                  <img
                                    src={option.image}
                                    alt={`Option ${String.fromCharCode(65 + index)}`}
                                    className="max-w-32 h-20 object-cover rounded border border-zinc-700"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  answer.selectedOption && (
                    <div
                      className={`p-4 rounded-lg border ${
                        answer.selectedOption.isCorrect
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                            answer.selectedOption.isCorrect
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {String.fromCharCode(65 + (answer.selectedOption.optionOrder - 1))}
                        </div>
                        <div className="flex-1">
                          <div className="text-zinc-200 leading-relaxed flex items-center gap-2">
                            {answer.selectedOption.optionText}
                            <Badge variant="outline" className="text-xs ml-2">
                              Your Answer
                            </Badge>
                            {answer.selectedOption.isCorrect && (
                              <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                            )}
                          </div>
                          {answer.selectedOption.description && (
                            <div className="text-sm text-zinc-400 mt-2">
                              {answer.selectedOption.description}
                            </div>
                          )}
                          {answer.selectedOption.image && (
                            <div className="mt-3">
                              <img
                                src={answer.selectedOption.image}
                                alt={`Option ${String.fromCharCode(65 + (answer.selectedOption.optionOrder - 1))}`}
                                className="max-w-32 h-20 object-cover rounded border border-zinc-700"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Explanation */}
              {answer.question.explanation && (
                <div className="p-2 bg-blue-500/5 text-sm border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-1 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-blue-400">ব্যাখ্যা:</span>
                  </div>
                  <p className="dark:text-zinc-300 leading-relaxed">{answer.question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};