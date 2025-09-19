// hooks/use-exam-results.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Types
export interface UserAnswerDetail {
  id: number;
  userId: number;
  examId: number;
  questionId: number;
  optionId?: number;
  selectedOption: number;
  isCorrect: boolean;
  isAnswered: boolean;
  marksAwarded: number;
  timeTaken?: number;
  createdAt: string;
  answeredAt?: string;
  question: {
    id: number;
    question: string;
    description?: string;
    explanation?: string;
    image?: string;
    correctOption: number;
    difficulty?: string;
    subject?: string;
    topic?: string;
    options: QuestionOption[];
  };
  selectedOptionDetail?: QuestionOption;
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

export interface ExamResultSummary {
  examInfo: {
    id: number;
    title: string;
    description?: string;
    totalMarks: number;
    durationInMinutes: number;
    negativeMark: number;
    startTime: string;
    endTime: string;
    package: {
      id: number;
      title: string;
      group: string;
    };
  };
  userStats: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
    percentage: number;
    timeTaken: number;
    rank?: number;
    totalParticipants: number;
  };
  submissionInfo: {
    submittedAt: string;
    isSubmitted: boolean;
    timeTakenMinutes: number;
  };
}

export interface LeaderboardEntry {
  id: number;
  userId: number;
  examId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  timeTakenMinutes: number;
  submittedAt: string;
  rank: number;
  user: {
    id: number;
    name: string;
    picture?: string;
    college?: string;
    group: string;
  };
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
  page: number;
  totalPages: number;
  exam: {
    id: number;
    title: string;
    totalMarks: number;
    totalParticipants: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  userRank?: {
    rank: number;
    score: number;
    percentile: number;
  };
}

// API functions
const examResultsAPI = {
  // Get detailed exam results for user
  getUserExamResult: (userId: number, examId: number) =>
    api.get(`/freeExam/users/${userId}/exams/${examId}/result`),
  
  // Get user's detailed answers with questions
  getUserAnswerSheet: (userId: number, examId: number) =>
    api.get(`/freeExam/users/${userId}/exams/${examId}/answer-sheet`),
  
  // Get exam leaderboard
  getExamLeaderboard: (examId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/freeExam/exams/${examId}/leaderboard`, { params }),
  //get participants
  getExamParticipants : (examId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/freeExam/participants/exams/${examId}`, { params }),
  
  // Check if user can view results (exam ended)
  checkResultsAccess: (userId: number, examId: number) =>
    api.get(`/freeExam/users/${userId}/exams/${examId}/results-access`),
  
  // Get exam statistics
  getExamStats: (examId: number) =>
    api.get(`/freeExam/exams/${examId}/stats`),
};

// Hooks
export const useUserExamResult = (userId: number, examId: number) => {
  return useQuery({
    queryKey: ['user-exam-result', userId, examId],
    queryFn: () => examResultsAPI.getUserExamResult(userId, examId),
    select: (data) => data.data.data as ExamResultSummary,
    enabled: !!userId && !!examId,
  });
};

export const useUserAnswerSheet = (userId: number, examId: number) => {
  return useQuery({
    queryKey: ['user-answer-sheet', userId, examId],
    queryFn: () => examResultsAPI.getUserAnswerSheet(userId, examId),
    select: (data) => data.data.data as any,
    enabled: !!userId && !!examId,
  });
};

export const useExamLeaderboard = (examId: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['exam-leaderboard', examId, params],
    queryFn: () => examResultsAPI.getExamLeaderboard(examId, params),
    select: (data) => data.data.data as LeaderboardResponse,
    enabled: !!examId,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};

export const useExamPaticipants = (examId: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['exam-particpants', examId, params],
    queryFn: () => examResultsAPI.getExamParticipants(examId, params),
    select: (data) => data.data.data as any,
    enabled: !!examId,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};

export const useResultsAccess = (userId: number, examId: number) => {
  return useQuery({
    queryKey: ['results-access', userId, examId],
    queryFn: () => examResultsAPI.checkResultsAccess(userId, examId),
    select: (data) => data.data.data,
    enabled: !!userId && !!examId,
  });
};

export const useExamStats = (examId: number) => {
  return useQuery({
    queryKey: ['exam-stats', examId],
    queryFn: () => examResultsAPI.getExamStats(examId),
    select: (data) => data.data.data,
    enabled: !!examId,
  });
};