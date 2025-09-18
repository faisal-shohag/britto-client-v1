// hooks/use-exams.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

// Types
export interface Exam {
  id: number;
  title: string;
  type?: string;
  description?: string;
  totalMarks: number;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  negativeMark: number;
  image?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  userId: number;
  packageId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  package: {
    id: number;
    title: string;
    group: 'SCIENCE' | 'ARTS' | 'COMMERCE';
  };
  examQuestions?: ExamQuestion[];
  _count?: {
    examQuestions: number;
    leaderboard: number;
    answers: number;
  };
}

export interface ExamQuestion {
  id: number;
  examId: number;
  questionId: number;
  order?: number;
  marks: number;
  question: {
    id: number;
    question: string;
    difficulty?: string;
    subject?: string;
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

export interface ExamResponse {
  exams: Exam[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateExamData {
  title: string;
  type?: string;
  description?: string;
  totalMarks?: number;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  negativeMark?: number;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  userId: number;
  packageId: number;
}

export interface ExamFilters {
  page?: number;
  limit?: number;
  status?: string;
  packageId?: number;
  userId?: number;
  search?: string;
}

// API functions
const examsAPI = {
  getExams: (params?: ExamFilters) =>
    api.get('/freeExam/exams', { params }),
  
  getExamById: (id: number) =>
    api.get(`/freeExam/exams/${id}`),
  
  createExam: (data: CreateExamData) =>
    api.post('/freeExam/exams', data),
  
  updateExam: (id: number, data: Partial<CreateExamData>) =>
    api.put(`/freeExam/exams/${id}`, data),
  
  deleteExam: (id: number) =>
    api.delete(`/freeExam/exams/${id}`),
  
  getExamsByUser: (userId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/freeExam/users/${userId}/exams`, { params }),
  
  getExamsByPackage: (packageId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/freeExam/packages/${packageId}/exams`, { params }),
  
  getExamQuestions: (examId: number) =>
    api.get(`/freeExam/exams/${examId}/exam-questions`),
  
  addQuestionToExam: (examId: number, questionId: number, data?: { order?: number; marks?: number }) =>
    api.post(`/freeExam/exams/${examId}/questions/${questionId}`, data),
  
  removeQuestionFromExam: (examId: number, questionId: number) =>
    api.delete(`/freeExam/exams/${examId}/questions/${questionId}`),
  
  getExamLeaderboard: (examId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/freeExam/exams/${examId}/leaderboard`, { params }),
  //get upcoming exam
  getUpcomingExam: () =>
    api.get(`/freeExam/upcoming-exam`),
};

// Hooks
export const useExams = (filters?: ExamFilters) => {
  return useQuery({
    queryKey: ['exams', filters],
    queryFn: () => examsAPI.getExams(filters),
    select: (data) => data.data.data as ExamResponse,
  });
};

export const useExam = (id: number) => {
  return useQuery({
    queryKey: ['exam', id],
    queryFn: () => examsAPI.getExamById(id),
    select: (data) => data.data.data as Exam,
    enabled: !!id,
  });
};

//use Upcoming Exam
export const useUpcomingExam = () => {
  return useQuery({
    queryKey: ['upcoming-exam'],
    queryFn: () => examsAPI.getUpcomingExam(),
    select: (data) => data.data.data as Exam,
  });
};

export const useExamsByUser = (userId: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['exams', 'user', userId, params],
    queryFn: () => examsAPI.getExamsByUser(userId, params),
    select: (data) => data.data.data as ExamResponse,
    enabled: !!userId,
  });
};

export const useExamsByPackage = (packageId: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['exams', 'package', packageId, params],
    queryFn: () => examsAPI.getExamsByPackage(packageId, params),
    select: (data) => data.data.data as ExamResponse,
    enabled: !!packageId,
  });
};

export const useExamQuestions = (examId: number) => {
  return useQuery({
    queryKey: ['exam-questions', examId],
    queryFn: () => examsAPI.getExamQuestions(examId),
    select: (data) => data.data.data as ExamQuestion[],
    enabled: !!examId,
  });
};

export const useExamLeaderboard = (examId: number, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['exam-leaderboard', examId, params],
    queryFn: () => examsAPI.getExamLeaderboard(examId, params),
    select: (data) => data.data.data,
    enabled: !!examId,
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examsAPI.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Exam created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create exam');
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateExamData> }) =>
      examsAPI.updateExam(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam', id] });
      toast.success('Exam updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update exam');
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examsAPI.deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Exam deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete exam');
    },
  });
};

export const useAddQuestionToExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, questionId, data }: { examId: number; questionId: number; data?: { order?: number; marks?: number } }) =>
      examsAPI.addQuestionToExam(examId, questionId, data),
    onSuccess: (_, { examId }) => {
      queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] });
      queryClient.invalidateQueries({ queryKey: ['exam', examId] });
      toast.success('Question added to exam successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add question to exam');
    },
  });
};

export const useRemoveQuestionFromExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, questionId }: { examId: number; questionId: number }) =>
      examsAPI.removeQuestionFromExam(examId, questionId),
    onSuccess: (_, { examId }) => {
      queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] });
      queryClient.invalidateQueries({ queryKey: ['exam', examId] });
      toast.success('Question removed from exam successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove question from exam');
    },
  });
};