import React, { useState } from 'react';
import type { UserAnswerDetail } from '@/hooks/free-exam-hooks/use-leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AnswerSheetProps {
  answers: any;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({ answers }) => {
  // const [showExplanations, setShowExplanations] = useState(false);

  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  const filteredAnswers = answers.filter(answer => {
    switch (filter) {
      case 'correct': return answer.isCorrect;
      case 'wrong': return answer.isAnswered && !answer.isCorrect;
      case 'unanswered': return !answer.isAnswered;
      default: return true;
    }
  });

  const stats = React.useMemo(() => {
    return {
      total: answers.length,
      correct: answers.filter(a => a.isCorrect).length,
      wrong: answers.filter(a => a.isAnswered && !a.isCorrect).length,
      unanswered: answers.filter(a => !a.isAnswered).length,
    };
  }, [answers]);

  const getStatusIcon = (answer: any) => {
    if (!answer.isAnswered) return <AlertCircle className="h-5 w-5 text-zinc-400" />;
    return answer.isCorrect 
      ? <CheckCircle className="h-5 w-5 text-green-400" />
      : <XCircle className="h-5 w-5 text-red-400" />;
  };

  const getStatusColor = (answer: UserAnswerDetail) => {
    if (!answer.isAnswered) return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    return answer.isCorrect 
      ? 'bg-green-500/10 text-green-400 border-green-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Filter and Stats */}
      <Card className="dark:bg-zinc-900/50 bg-white dark:border-zinc-800">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="dark:text-zinc-100 text-lg">উত্তরপত্র</CardTitle>

            <div>তুমি মার্ক <span>{stats.correct}</span> পেয়েছো!</div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExplanations(!showExplanations)}
              className="border-zinc-700 dark:text-zinc-300 hover:bg-zinc-800"
            >
              {showExplanations ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showExplanations ? 'Hide' : 'Show'} Explanations
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center flex-wrap gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-blue-600' : 'border-zinc-700 dark:text-zinc-300'}
            >
              সব ({stats.total})
            </Button>
            <Button
              variant={filter === 'correct' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('correct')}
              className={filter === 'correct' ? 'bg-green-600' : 'border-zinc-700 dark:text-zinc-300'}
            >
              ঠিক ({stats.correct})
            </Button>
            <Button
              variant={filter === 'wrong' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('wrong')}
              className={filter === 'wrong' ? 'bg-red-600' : 'border-zinc-700 dark:text-zinc-300'}
            >
              ভুল ({stats.wrong})
            </Button>
            <Button
              variant={filter === 'unanswered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unanswered')}
              className={filter === 'unanswered' ? 'bg-zinc-600' : 'border-zinc-700 dark:text-zinc-300'}
            >
              অনুত্তর ({stats.unanswered})
            </Button>
          </div>
          {/* <div className="text-sm dark:text-zinc-400">
            Showing {filteredAnswers.length} question{filteredAnswers.length !== 1 ? 's' : ''}
          </div> */}
        </CardContent>
      </Card>

      {/* All Questions Display */}
      {filteredAnswers.length === 0 ? (
        <Card className="">
          <CardContent className="p-6">
            <p className="dark:text-zinc-400">No questions match the selected filter.</p>
          </CardContent>
        </Card>
      ) : (
        filteredAnswers.map((answer) => (
          <Card key={answer.id} className="">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(answer)}
                    <span className="text-sm dark:text-zinc-400">
                      Question {answers.findIndex(a => a.id === answer.id) + 1}
                    </span>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(answer)} border`}>
                    {!answer.isAnswered ? 'Unanswered' :
                     answer.isCorrect ? 'Correct' : 'Wrong'}
                  </Badge>
                  {answer.question.difficulty && (
                    <Badge variant="secondary" className=" text-zinc-300 text-xs">
                      {answer.question.difficulty}
                    </Badge>
                  )}
                </div>
                <div className="text-sm dark:text-zinc-400">
                  +{answer.marksAwarded} marks
                </div>
              </div>
              <CardTitle className="text-xl dark:text-zinc-100 leading-relaxed mt-4">
                {answer.question.question}
              </CardTitle>
              {/* {answer.question.description && (
                <p className="dark:text-zinc-400 mt-2">
                  {answer.question.description}
                </p>
              )} */}
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
                      const isSelected = answer.option && answer.option.id === option.id;
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
                          className={`p-4 rounded-lg border ${borderColor} ${bgColor} transition-colors`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                              isCorrect ? 'bg-green-500/20 text-green-400' :
                              isWrongSelection ? 'bg-red-500/20 text-red-400' :
                              'bg-zinc-700 text-zinc-400'
                            }`}>
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
                              {/* {option.description && (
                                <div className="text-sm text-zinc-400 mt-2">
                                  {option.description}
                                </div>
                              )} */}
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
                  answer.option && (
                    <div
                      className={`p-4 rounded-lg border ${
                        answer.isCorrect
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                          answer.isCorrect
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {String.fromCharCode(65 + (answer.option.optionOrder - 1))}
                        </div>
                        <div className="flex-1">
                          <div className="text-zinc-200 leading-relaxed flex items-center gap-2">
                            {answer.option.optionText}
                            <Badge variant="outline" className="text-xs ml-2">
                              Your Answer
                            </Badge>
                            {answer.isCorrect && (
                              <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                            )}
                          </div>
                          {/* {answer.option.description && (
                            <div className="text-sm text-zinc-400 mt-2">
                              {answer.option.description}
                            </div>
                          )} */}
                          {answer.option.image && (
                            <div className="mt-3">
                              <img
                                src={answer.option.image}
                                alt={`Option ${String.fromCharCode(65 + (answer.option.optionOrder - 1))}`}
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
                    <HelpCircle className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-blue-400">ব্যাখ্যা:</span>
                  </div>
                  <p className="dark:text-zinc-300 leading-relaxed">
                    {answer.question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};