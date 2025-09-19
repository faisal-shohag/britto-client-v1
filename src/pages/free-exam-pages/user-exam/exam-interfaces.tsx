import React, { useState, useEffect, useCallback } from 'react';
import { 
  useExamQuestions, 
  useSubmitAnswer, 
  useSubmitExam, 
  useUserExamStatus,
} from '@/hooks/free-exam-hooks/user-user-exams';
import type { UserAnswer } from '@/hooks/free-exam-hooks/user-user-exams';
import { ExamTimer } from './exam-timer';
// import { ExamHeader } from './exam-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock,
  Trophy,
  ArrowUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { bnNumber } from '@/lib/bnNumbers';

interface ExamInterfaceProps {
  examId: number;
  userId: number;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({
  examId,
  userId,
}) => {
  const navigate = useNavigate();

  // State management
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [examStartTime, setExamStartTime] = useState<string | null>(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // API hooks
  const { data: examData, isLoading, error } = useExamQuestions(examId);
  const { data: examStatus } = useUserExamStatus(examId, userId);
  const submitAnswerMutation = useSubmitAnswer();
  const submitExamMutation = useSubmitExam();

  // Initialize exam state
  useEffect(() => {
    if (examData && examStatus) {
      if (examStatus.hasStarted && !examStatus.hasCompleted) {
        setIsExamActive(true);
        setExamStartTime(examStatus.startedAt || new Date().toISOString());
        
        // Load existing answers if any
        if (examStatus.existingAnswers) {
          const answerMap: Record<number, UserAnswer> = {};
          examStatus.existingAnswers.forEach((answer: any) => {
            answerMap[answer.questionId] = {
              questionId: answer.questionId,
              optionId: answer.optionId,
              selectedOption: answer.selectedOption,
              isAnswered: answer.isAnswered,
              timeTaken: answer.timeTaken,
            };
          });
          setAnswers(answerMap);
        }
      }
    }
  }, [examData, examStatus]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-save answers
  const saveAnswer = useCallback((questionId: number, optionId: number) => {
    const answerData = {
      userId,
      examId,
      questionId,
      optionId,
      timeTaken: 0,
    };

    submitAnswerMutation.mutate(answerData);
  }, [userId, examId, submitAnswerMutation]);

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, optionId: number) => {
    if (!isExamActive) return;

    const newAnswer: UserAnswer = {
      questionId,
      optionId,
      selectedOption: optionId,
      isAnswered: true,
      timeTaken: 0,
    };

    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer,
    }));

    // Auto-save the answer
    saveAnswer(questionId, optionId);
  };

  // Submit exam
  const handleSubmitExam = async () => {
    try {
      await submitExamMutation.mutateAsync({ userId, examId });
      setIsExamActive(false);
      setShowSubmitDialog(false);
      
      navigate(`/free/exams/${examId}/results`);
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  // Time up handler
  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your exam...');
    handleSubmitExam();
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent page refresh/close during exam
  useEffect(() => {
    if (!isExamActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress will be saved.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExamActive]);

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!examData) return { answered: 0, unanswered: 0, total: 0 };
    
    const answered = Object.values(answers).filter(answer => answer.isAnswered).length;
    const total = examData.questions.length;
    const unanswered = total - answered;
    
    return { answered, unanswered, total };
  }, [examData, answers]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full bg-zinc-800" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Failed to Load Exam
            </h2>
            <p className="text-zinc-400 mb-4">
              Unable to load the exam questions. Please try again.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam not available or completed
  if (examStatus?.hasCompleted) {
    return (
      <div className="min-h-screen dark:bg-zinc-950 flex items-center justify-center">
        <Card className="bg-green-500/10 border-green-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              Exam Completed
            </h2>
            <p className="text-zinc-400 mb-4">
              You have already completed this exam.
            </p>
            <Button 
              onClick={() => navigate(`/exams/${examId}/results`)}
              className="bg-green-600 hover:bg-green-700"
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam not started yet
  if (!isExamActive && !examStatus?.hasStarted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="bg-blue-500/10 border-blue-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Exam Not Started
            </h2>
            <p className="text-zinc-400 mb-4">
              The exam has not been started yet or you don't have access to take this exam.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/free')}
              className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examData || !examData.questions.length) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="bg-zinc-800/50 border-zinc-700 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">
              No Questions Available
            </h2>
            <p className="text-zinc-400">
              This exam doesn't have any questions yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-zinc-950">
      {/* Fixed Header with Timer and Submit */}
            <div className="flex items-center gap-4 pt-2 bg-white justify-center">
              <h1 className="text-xl font-bold ">
                {examData.examData.title}
              </h1>
           
            </div>
      <div className="sticky top-0 z-50 bg-white dark:bg-zinc-950/95 backdrop-blur ">
      
        <div className="py-3">
            <div className="flex justify-between items-center gap-4 px-3">
              
              <ExamTimer
                durationInMinutes={examData.examData.durationInMinutes}
                onTimeUp={handleTimeUp}
                isActive={isExamActive}
                startTime={examStartTime || undefined}
              />
              
              <Button
                onClick={() => setShowSubmitDialog(true)}
                disabled={submitExamMutation.isPending}
                className="bg-gradient-to-r from-red-600 to-pink-500 text-white"
                size="sm"
              >
                <Send />
                {submitExamMutation.isPending ? 'Submitting...' : 'সাবমিট'}
              </Button>
       
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Exam Header */}
        {/* <div className="mb-8">
          <ExamHeader
            examData={examData.examData}
            currentQuestionIndex={0}
            totalQuestions={examData.questions.length}
            answeredCount={stats.answered}
          />
        </div> */}

        {/* All Questions */}
        <div className="space-y-8">
          {examData.questions.map((question, index) => {
            const currentAnswer = answers[question.question.id];
            
            return (
              <div 
                key={question.question.id} 
                className="dark:bg-zinc-900/50 bg-white rounded-xl py-3"
                id={`question-${question.question.id}`}
              >
                <CardHeader>
                  {/* <div className="flex items-start justify-between mb-4"> */}
                    {/* <div className="flex items-center gap-2"> */}
                      {/* <HelpCircle className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-zinc-400">
                        Question {index + 1} of {examData.questions.length}
                      </span> */}
                      {/* <span>{index+1}.</span> */}
                     
                    {/* </div> */}
                    
                    {/* <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      <Target className="h-3 w-3 mr-1" />
                      {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                    </Badge> */}
                  {/* </div> */}
                  
                  <div className="flex items-center gap-1 font-bold  leading-relaxed">
                  {bnNumber(index+1)}.{question.question.question}  {currentAnswer?.isAnswered && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                  </div>
                  
                  {question.question.description && (
                    <p className="  leading-relaxed">
                      {question.question.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-2">
                  {/* Question Image */}
                  {question.question.image && (
                    <div className="flex justify-center">
                      <div className="relative max-w-lg w-full">
                        <img
                          src={question.question.image}
                          alt="Question"
                          className="w-full rounded-lg border dark:border-zinc-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    <RadioGroup
                      value={currentAnswer?.optionId?.toString()}
                      onValueChange={(value) => handleAnswerSelect(question.question.id, parseInt(value))}
                      className="space-y-3"
                    >
                      {question.question.options
                        .sort((a, b) => a.optionOrder - b.optionOrder)
                        .map((option, optionIndex) => (
                          <div key={option.id}>
                            <div className="flex items-center space-x-3 p-2 rounded-lg border dark:border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/30 transition-all cursor-pointer">
                              <RadioGroupItem
                                value={option.id.toString()}
                                id={`${question.question.id}-${option.id}`}
                                className="mt-1 text-blue-400 border-zinc-600 focus:ring-blue-400"
                              />
                              <Label
                                htmlFor={`${question.question.id}-${option.id}`}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border dark:bg-zinc-700 dark:text-zinc-300 text-sm font-medium shrink-0">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="dark:text-zinc-200 leading-relaxed">
                                      {option.optionText}
                                    </div>
                                    
                                    {option.description && (
                                      <div className="text-sm dark:text-zinc-400 mt-2">
                                        {option.description}
                                      </div>
                                    )}
                                    
                                    {option.image && (
                                      <div className="mt-3">
                                        <img
                                          src={option.image}
                                          alt={`Option ${String.fromCharCode(65 + optionIndex)}`}
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
                </CardContent>
              </div>
            );
          })}
        </div>

        {/* Submit Section */}
        <div className="mt-10">
          <Card className="bg-white dark:bg-zinc-900/50 dark:border-zinc-800">
            <CardContent className="text-center space-y-4">
              {/* <div className="text-lg font-medium dark:text-zinc-200">এক্সাম শেষ?</div> */}
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                {/* <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded border border-green-500">
             
                  <div className="text-green-600 flex flex-col">
                       <span >{stats.answered} টি</span>
                  <span> উত্তর করেছো</span>
                  </div>
               
                </div> */}
                {/* <div className="flex items-center justify-center gap-2 p-3 bg-orange-500/10 rounded border border-orange-500">
               
                    <div className="text-orange-500 flex flex-col">
                       <span >{stats.unanswered} টি</span>
                  <span> উত্তর করা বাকি</span>
                  </div>
                </div> */}
              </div>

              <Button
                onClick={() => setShowSubmitDialog(true)}
                disabled={submitExamMutation.isPending}
                className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-8 py-2 text-lg"
              >
                <Send className="h-5 w-5" />
                {submitExamMutation.isPending ? 'Submitting...' : 'সাবমিট করো'}
              </Button>

              {stats.unanswered > 0 && (
                <p className="text-sm text-orange-400">
               তুমি এখনো {stats.unanswered} টি প্রশ্নের উত্তর দাও নি
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-full p-3 shadow-lg"
          size="sm"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">
              এক্সাম সাবমিট
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
             তুমি কি নিশ্চিত তুমি এক্সাম সাবমিট করতে চাও?
              
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300">{stats.answered} Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    <span className="text-zinc-300">{stats.unanswered} Unanswered</span>
                  </div>
                </div>
              </div>
              
              {stats.unanswered > 0 && (
                <p className="mt-2 text-orange-400 text-sm">
                  Warning:  তুমি এখনো {stats.unanswered} টি প্রশ্নের উত্তর দাও নি
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              না
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitExam}
              className="bg-gradient-to-r from-red-600 to-pink-500 text-white"
              disabled={submitExamMutation.isPending}
            >
              {submitExamMutation.isPending ? 'সাবমিট হচ্ছে...' : 'হ্যা, সাবমিট করবো'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};