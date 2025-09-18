import React from 'react';
import type { ExamQuestion } from '@/hooks/free-exam-hooks/user-user-exams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  HelpCircle, 
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface QuestionDisplayProps {
  question: ExamQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswerSelect: (optionId: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  const handleValueChange = (value: string) => {
    onAnswerSelect(parseInt(value));
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-zinc-400">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              <Target className="h-3 w-3 mr-1" />
              {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-xl text-zinc-100 leading-relaxed">
          {question.question.question}
        </CardTitle>
        
        {question.question.description && (
          <p className="text-zinc-400 mt-2 leading-relaxed">
            {question.question.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Image */}
        {question.question.image && (
          <div className="flex justify-center">
            <div className="relative max-w-lg w-full">
              <img
                src={question.question.image}
                alt="Question"
                className="w-full rounded-lg border border-zinc-700"
              />
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-zinc-200 mb-4">
            Select your answer:
          </h4>
          
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={handleValueChange}
            className="space-y-3"
          >
            {question.question.options
              .sort((a, b) => a.optionOrder - b.optionOrder)
              .map((option, index) => (
                <div key={option.id}>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/30 transition-all cursor-pointer">
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={option.id.toString()}
                      className="mt-1 text-blue-400 border-zinc-600 focus:ring-blue-400"
                    />
                    <Label
                      htmlFor={option.id.toString()}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-zinc-300 text-sm font-medium shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-zinc-200 leading-relaxed">
                            {option.optionText}
                          </div>
                          
                          {option.description && (
                            <div className="text-sm text-zinc-400 mt-2">
                              {option.description}
                            </div>
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
                    </Label>
                  </div>
                </div>
              ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-sm text-zinc-500">
            {selectedAnswer ? 'Answer selected' : 'Select an answer to continue'}
          </div>
          
          <Button
            variant="outline"
            onClick={onNext}
            disabled={!canGoNext}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};