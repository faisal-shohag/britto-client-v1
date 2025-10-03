import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const contentApi = {
    createContent: (data: any) => api.post("/course/create-content", data),
    getContentByModuleId: (moduleId: number) => api.get(`/courses/contents/module/${moduleId}`),
    updateContent: (id: number, data: any) => api.put(`/courses/content/${id}`, data),
    deleteContent: (id: number) => api.delete(`/courses/content/${id}`),
}

export const useCreateContent = () => {
    return useMutation({
        mutationFn: contentApi.createContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] });
            toast.success("Content created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create content");
        },
    });
};

export const useGetContentByModuleId = (moduleId: number) => {
    return useQuery({
        queryKey: ["contents", moduleId],
        queryFn: () => contentApi.getContentByModuleId(moduleId),
        enabled: !!moduleId,
    });
};

export const useUpdateContent = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => contentApi.updateContent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] });
            toast.success("Content updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update content");
        },
    });
};

export const useDeleteContent = () => {
    return useMutation({
        mutationFn: (id: number) => contentApi.deleteContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] });
            toast.success("Content deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete content");
        },
    });
};