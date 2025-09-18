import React, { useState } from 'react';
import type { Question } from '@/hooks/free-exam-hooks/use-questions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatDistanceToNow } from 'date-fns';

interface QuestionCardProps {
  question: Question;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showOptions?: boolean;
  showExplanation?: boolean;
  compact?: boolean;
}

const difficultyConfig = {
  EASY: {
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    label: 'Easy'
  },
  MEDIUM: {
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    label: 'Medium'
  },
  HARD: {
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    label: 'Hard'
  },
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onView,
  onEdit,
  onDelete,
  showOptions = true,
  showExplanation = false,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showAllOptions, setShowAllOptions] = useState(false);

  const correctOption = question.options.find(opt => opt.isCorrect);
  const difficultyInfo = question.difficulty ? difficultyConfig[question.difficulty] : null;
  const optionsToShow = showAllOptions ? question.options : question.options.slice(0, 2);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10 border-2 border-zinc-700 shrink-0">
              <AvatarImage src={question.image} alt="Question" />
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-sm font-semibold">
                <HelpCircle className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-base text-zinc-100 line-clamp-2 pr-2">
                  {question.question}
                </CardTitle>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-zinc-800 shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                    <DropdownMenuItem 
                      onClick={() => onView?.(question.id)}
                      className="hover:bg-zinc-800 text-zinc-300"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onEdit?.(question.id)}
                      className="hover:bg-zinc-800 text-zinc-300"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Question
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(question.id)}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Question
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                {difficultyInfo && (
                  <Badge variant="outline" className={`${difficultyInfo.color} text-xs border`}>
                    {difficultyInfo.label}
                  </Badge>
                )}
                
                {question.subject && (
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                    {question.subject}
                  </Badge>
                )}
                
                {question.topic && (
                  <Badge variant="outline" className="border-zinc-600 text-zinc-400 text-xs">
                    {question.topic}
                  </Badge>
                )}
              </div>
              
              {question.description && (
                <p className="text-sm text-zinc-400 line-clamp-1 mb-2">
                  {question.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Question Image */}
        {question.image && (
          <div className="mb-4">
            <img 
              src={question.image} 
              alt="Question" 
              className="w-full max-w-sm mx-auto rounded-lg border border-zinc-700"
            />
          </div>
        )}

        {/* Question Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Target className="h-4 w-4" />
            <span>{question.options.length} options</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <BookOpen className="h-4 w-4" />
            <span>{question._count?.examQuestions || 0} exams</span>
          </div>
        </div>

        {/* Options Section */}
        {showOptions && question.options.length > 0 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between text-zinc-300 hover:bg-zinc-800/50"
              >
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Options ({question.options.length})
                </span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3 space-y-2">
              {optionsToShow.map((option, index) => (
                <div 
                  key={option.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    option.isCorrect 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-zinc-700 bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                      option.isCorrect 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-zinc-200">
                          {option.optionText}
                        </span>
                        {option.isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      
                      {option.description && (
                        <p className="text-xs text-zinc-500">
                          {option.description}
                        </p>
                      )}
                      
                      {option.image && (
                        <div className="mt-2">
                          <img 
                            src={option.image} 
                            alt={`Option ${index + 1}`} 
                            className="max-w-20 h-12 object-cover rounded border border-zinc-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {question.options.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllOptions(!showAllOptions)}
                  className="w-full text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                >
                  {showAllOptions ? 'Show Less' : `Show ${question.options.length - 2} More Options`}
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Explanation</span>
            </div>
            <p className="text-sm text-zinc-300">{question.explanation}</p>
          </div>
        )}

        {/* Correct Answer Highlight */}
        {correctOption && showOptions && (
          <div className="mt-3 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Correct Answer: {correctOption.optionText}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Created {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit?.(question.id)}
            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onView?.(question.id)}
            className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};