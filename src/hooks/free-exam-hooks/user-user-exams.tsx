// hooks/use-user-exam.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

// Types
export interface ExamQuestion {
  id: number;
  examId: number;
  questionId: number;
  order?: number;
  marks: number;
  question: {
    id: number;
    question: string;
    description?: string;
    explanation?: string;
    image?: string;
    options: QuestionOption[];
  };
}

export interface QuestionOption {
  id: number;
  optionText: string;
  description?: string;
  image?: string;
  isCorrect: boolean;
  optionOrder: number;
  questionId: number;
}

export interface ExamData {
  title: string;
  description?: string;
  negativeMark: number;
  durationInMinutes: number;
  totalMarks: number;
  startTime: string;
  endTime: string;
  status: string;
}

export interface UserExamResponse {
  examData: ExamData;
  questions: ExamQuestion[];
  userProgress?: {
    hasStarted: boolean;
    hasCompleted: boolean;
    startedAt?: string;
    completedAt?: string;
    remainingTime?: number;
  };
}

export interface UserAnswer {
  questionId: number;
  optionId?: number;
  selectedOption: number;
  isAnswered: boolean;
  timeTaken?: number;
}

export interface SubmitAnswerData {
  userId: number;
  examId: number;
  questionId: number;
  optionId?: number;
  timeTaken?: number;
}

export interface SubmitExamData {
  userId: number;
  examId: number;
  answers: UserAnswer[];
  totalTimeTaken: number;
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  percentage: number;
  timeTaken: number;
  rank?: number;
}

// API functions
const userExamAPI = {
  // Get exam questions for user
  getExamQuestions: (examId: number) =>
    api.get(`/freeExam/exams/${examId}/exam-questions`),
  
  // Check if user can take exam
  checkExamAccess: (examId: number, userId: number) =>
    api.get(`/freeExam/exams/${examId}/access/${userId}`),
  
  // Start exam for user
  startExam: (examId: number, userId: number) =>
    api.post(`/freeExam/exams/${examId}/start`, { userId }),
  
  // Submit single answer
  submitAnswer: (data: SubmitAnswerData) =>
    api.post('/freeExam/answers', data),
  
  // Submit entire exam
  submitExam: (userId: number, examId: number) =>
    api.post(`/freeExam/users/${userId}/exams/${examId}/submit`),
  
  // Get user's answers for exam
  getUserAnswers: (userId: number, examId: number) =>
    api.get(`/freeExam/users/${userId}/exams/${examId}/answers`),
  
  // Get exam results
  getExamResults: (userId: number, examId: number) =>
    api.get(`/freeExam/users/${userId}/exams/${examId}/stats`),
  
  // Get user's exam status
  getUserExamStatus: (userId: number, examId: number) =>
    api.get(`/freeExam/users/${userId}/exams/${examId}/status`),
};

// Hooks
export const useExamQuestions = (examId: number) => {
  return useQuery({
    queryKey: ['exam-questions-user', examId],
    queryFn: () => userExamAPI.getExamQuestions(examId),
    select: (data) => data.data.data as UserExamResponse,
    enabled: !!examId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExamAccess = (examId: number, userId: number) => {
  return useQuery({
    queryKey: ['exam-access', examId, userId],
    queryFn: () => userExamAPI.checkExamAccess(examId, userId),
    select: (data) => data.data.data,
    enabled: !!examId && !!userId,
  });
};

export const useUserExamStatus = (examId: number, userId: number) => {
  return useQuery({
    queryKey: ['user-exam-status', examId, userId],
    queryFn: () => userExamAPI.getUserExamStatus(userId, examId),
    select: (data) => data.data.data,
    enabled: !!examId && !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useStartExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, userId }: { examId: number; userId: number }) =>
      userExamAPI.startExam(examId, userId),
    onSuccess: (_, { examId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-exam-status', examId, userId] });
      queryClient.invalidateQueries({ queryKey: ['exam-access', examId, userId] });
      toast.success('Exam started successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start exam');
    },
  });
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userExamAPI.submitAnswer,
    onSuccess: (_, variables) => {
      // Invalidate user answers query to reflect the new answer
      queryClient.invalidateQueries({ 
        queryKey: ['user-answers', variables.userId, variables.examId] 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save answer');
    },
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, examId }: { userId: number; examId: number }) =>
      userExamAPI.submitExam(userId, examId),
    onSuccess: (_, { userId, examId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-exam-status', examId, userId] });
      queryClient.invalidateQueries({ queryKey: ['exam-access', examId, userId] });
      toast.success('Exam submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit exam');
    },
  });
};

export const useUserAnswers = (userId: number, examId: number) => {
  return useQuery({
    queryKey: ['user-answers', userId, examId],
    queryFn: () => userExamAPI.getUserAnswers(userId, examId),
    select: (data) => data.data.data,
    enabled: !!userId && !!examId,
  });
};

export const useExamResults = (userId: number, examId: number) => {
  return useQuery({
    queryKey: ['exam-results', userId, examId],
    queryFn: () => userExamAPI.getExamResults(userId, examId),
    select: (data) => data.data.data as ExamResult,
    enabled: !!userId && !!examId,
  });
};