// hooks/use-questions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

// Types
export interface QuestionOption {
  id: number;
  optionText: string;
  description?: string;
  image?: string;
  isCorrect: boolean;
  optionOrder: number;
  questionId: number;
}

export interface Question {
  id: number;
  question: string;
  description?: string;
  explanation?: string;
  correctOption: number;
  image?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  subject?: string;
  topic?: string;
  createdAt: string;
  updatedAt: string;
  options: QuestionOption[];
  examQuestions?: ExamQuestion[];
  _count?: {
    examQuestions: number;
  };
}

export interface ExamQuestion {
  id: number;
  examId: number;
  questionId: number;
  order?: number;
  marks: number;
  exam: {
    id: number;
    title: string;
  };
}

export interface QuestionResponse {
  questions: Question[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateQuestionData {
  examId?: number
  question: string;
  description?: string;
  explanation?: string;
  correctOption: number;
  image?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  subject?: string;
  topic?: string;
  options: {
    create: CreateOptionData[]
  };
}

export interface CreateOptionData {
  optionText: string;
  description?: string;
  image?: string;
  isCorrect: boolean;
  optionOrder: number;
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  subject?: string;
  difficulty?: string;
  topic?: string;
  search?: string;
}

// API functions
const questionsAPI = {
  getQuestions: (params?: QuestionFilters) =>
    api.get('/freeExam/questions', { params }),
  
  getQuestionById: (id: number) =>
    api.get(`/freeExam/questions/${id}`),
  
  createQuestion: (data: CreateQuestionData) =>
    api.post('/freeExam/questions', data),
  
  updateQuestion: (id: number, data: Partial<CreateQuestionData>) =>
    api.put(`/freeExam/questions/${id}`, data),
  
  deleteQuestion: (id: number) =>
    api.delete(`/freeExam/questions/${id}`),
  
  getQuestionsByExam: (examId: number) =>
    api.get(`/freeExam/exams/${examId}/exam-questions`),
  
  // Option-specific APIs
  createOption: (data: CreateOptionData & { questionId: number }) =>
    api.post('/freeExam/options', data),
  
  updateOption: (id: number, data: Partial<CreateOptionData>) =>
    api.put(`/freeExam/options/${id}`, data),
  
  deleteOption: (id: number) =>
    api.delete(`/freeExam/options/${id}`),
  
  getOptionsByQuestion: (questionId: number) =>
    api.get(`/freeExam/questions/${questionId}/options`),
};

// Question Hooks
export const useQuestions = (filters?: QuestionFilters) => {
  return useQuery({
    queryKey: ['questions', filters],
    queryFn: () => questionsAPI.getQuestions(filters),
    select: (data) => data.data.data as QuestionResponse,
  });
};

export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionsAPI.getQuestionById(id),
    select: (data) => data.data.data as Question,
    enabled: !!id,
  });
};

export const useQuestionsByExam = (examId: number) => {

  return useQuery({
    queryKey: ['questions', 'exam', examId],
    queryFn: () => questionsAPI.getQuestionsByExam(examId),
    select: (data) => data.data.data,
    enabled: !!examId,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionsAPI.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Question created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create question');
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateQuestionData> }) =>
      questionsAPI.updateQuestion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', id] });
      toast.success('Question updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update question');
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionsAPI.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Question deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    },
  });
};

// Option Hooks
export const useOptionsByQuestion = (questionId: number) => {
  return useQuery({
    queryKey: ['options', 'question', questionId],
    queryFn: () => questionsAPI.getOptionsByQuestion(questionId),
    select: (data) => data.data.data as QuestionOption[],
    enabled: !!questionId,
  });
};

export const useCreateOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionsAPI.createOption,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['options', 'question', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.questionId] });
      toast.success('Option created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create option');
    },
  });
};

export const useUpdateOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateOptionData> }) =>
      questionsAPI.updateOption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Option updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update option');
    },
  });
};

export const useDeleteOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionsAPI.deleteOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Option deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete option');
    },
  });
};