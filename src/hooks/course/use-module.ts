import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const moduleApi = {
  createModule: (data: any) => {
    return api.post("/course/create-module", data);
  },
  getModuleByCourseId: (courseId: number) => {
    return api.get(`/courses/modules/course/${courseId}`);
  },
  updateModule: (id: number, data: any) => {
    return api.put(`/course/module/${id}`, data);
  },
  deleteModule: (id: number) => {
    return api.delete(`/course/module/${id}`);
  },
};

export const useCreateModule = () => {
  return useMutation({
    mutationFn: (data: any) => moduleApi.createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create module");
    },
  });
};

export const useGetModuleByCourseId = (courseId: number) => {
  return useQuery({
    queryKey: ["modules", courseId],
    queryFn: () => moduleApi.getModuleByCourseId(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateModule = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      moduleApi.updateModule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update module");
    },
  });
};

export const useDeleteModule = () => {
  return useMutation({
    mutationFn: (id: number) => moduleApi.deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete module");
    },
  });
};
