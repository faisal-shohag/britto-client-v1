import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const questionApi = {
    addQuestionToQuiz: (data: any) => api.post("/quizzes/question/add", data),
    addQuizContext: (data: any) => api.post("/quizzes/context/add", data),
    addQuestionToContext: (data: any) => api.post("/quizzes/question-context/add", data),
}

export const useAddQuestionToQuiz = () => {
    return useMutation({
        mutationFn: (data: any) => questionApi.addQuestionToQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            toast.success("Question added successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add question");
        },
    });
}; 

export const useAddQuizContext = () => {
    return useMutation({
        mutationFn: (data: any) => questionApi.addQuizContext(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            toast.success("Quiz context added successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add quiz context");
        },
    });
};

export const useAddQuestionToContext = () => {
    return useMutation({
        mutationFn: (data: any) => questionApi.addQuestionToContext(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            toast.success("Question added to context successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add question to context");
        },
    });
};