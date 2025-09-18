import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Array<{ id: number; questionId: number }>;
  answers: Record<number, { optionId?: number; isAnswered: boolean }>;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  answers,
  currentQuestionIndex,
  onQuestionSelect,
}) => {
  const getQuestionStatus = (questionId: number) => {
    const answer = answers[questionId];
    if (answer?.isAnswered) return 'answered';
    return 'unanswered';
  };

  const getStatusIcon = (questionId: number, index: number) => {
    const status = getQuestionStatus(questionId);
    const isCurrent = index === currentQuestionIndex;
    
    if (status === 'answered') {
      return <CheckCircle className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-green-400'}`} />;
    }
    
    return <Circle className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-zinc-400'}`} />;
  };

  const getButtonClasses = (questionId: number, index: number) => {
    const status = getQuestionStatus(questionId);
    const isCurrent = index === currentQuestionIndex;
    
    if (isCurrent) {
      return 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700';
    }
    
    if (status === 'answered') {
      return 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20';
    }
    
    return 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700';
  };

  const stats = React.useMemo(() => {
    const answered = questions.filter(q => answers[q.questionId]?.isAnswered).length;
    const unanswered = questions.length - answered;
    
    return { answered, unanswered, total: questions.length };
  }, [questions, answers]);

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-zinc-100 text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Question Navigator
        </CardTitle>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-zinc-300">Answered: {stats.answered}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-300">Remaining: {stats.unanswered}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => (
          <Button
            key={question.id}
            variant="outline"
            size="sm"
            onClick={() => onQuestionSelect(index)}
            className={`h-10 w-full ${getButtonClasses(question.questionId, index)}`}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(question.questionId, index)}
              <span className="font-medium">{index + 1}</span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};