import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


const quizApi = {
    createQuiz: (data: any) => api.post("/quizzes/create-quiz", data),
    getQuizByContentId: (contentId: number) => api.get(`/quizzes/quiz/content/${contentId}`),
    getQuizById: (id: number) => api.get(`/quizzes/quiz/${id}`),
    updateQuiz: (id: number, data: any) => api.put(`/quizzes/quiz/${id}`, data),
    deleteQuiz: (id: number) => api.delete(`/quizzes/quiz/${id}`),
    addQuestionToQuiz: (data: any) => api.post("/quizzes/question/add", data),

}

export const useCreateQuiz = () => {
    return useMutation({
        mutationFn: quizApi.createQuiz,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            toast.success("Quiz created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create quiz");
        },
    });
};

export const useGetQuizByContentId = (contentId: number) => {
    return useQuery({
        queryKey: ["quizzes", contentId],
        queryFn: () => quizApi.getQuizByContentId(contentId),
        enabled: !!contentId,
        select: (data) => data.data.data,
    });
};

export const useGetQuizById = (id: number) => {
    return useQuery({
        queryKey: ["quizzes", id],
        queryFn: () => quizApi.getQuizById(id),
        enabled: !!id,
        select: (data) => data.data.data,
    });
};

export const useUpdateQuiz = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => quizApi.updateQuiz(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            toast.success("Quiz updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update quiz");
        },
    });
};

export const useDeleteQuiz = () => {
    return useMutation({
        mutationFn: (id: number) => quizApi.deleteQuiz(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            toast.success("Quiz deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete quiz");
        },
    });
};

