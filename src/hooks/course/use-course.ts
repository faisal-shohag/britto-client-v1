import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const courseApi = {
  createCourse: (data:any) => api.post("/courses/create-course", data),
  getCourseById: (id: number, userId:number) => api.get(`/courses/course/${id}/${userId}`),
  getCourses: (page=1, limit=10) => api.get(`/courses/courses?page=${page}&limit${limit}`),
  updateCourse: (id: number, data: any) => api.put(`/courses/course/${id}`, data),
  deleteCourse: (id: number) => api.delete(`/courses/course/${id}`),
  getCourseByUser: (userId: number) => api.get(`/courses/course/user/${userId}`),
};

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success("Exam created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create exam");
    },
  });
};

export const useGetCourseById = ({courseId, userId}) => {
  return useQuery({
    queryKey: ["course", "enrollments", courseId],
    queryFn: () => courseApi.getCourseById(courseId, userId),
    enabled: !!courseId,
     select: (data) => data.data.data
  })
};

//get courses with pagination
export const useGetCourses = ({page, limit}:{page?:number, limit?:number}) => {
  return useQuery({
    queryKey: ["course", "all", page, limit],
    queryFn: () => courseApi.getCourses(page, limit),
    enabled: !!page && !!limit,
    select: (data) => data.data.data
  })
};

export const useGetCourseByUser = (userId: number) => {
  return useQuery({
    queryKey: ["course", "enrollments", userId],
    queryFn: () => courseApi.getCourseByUser(userId),
    enabled: !!userId,
  })
};

export const useUpdateCourse = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      courseApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success("Exam updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update exam");
    },
  });
};

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: (id: number) => courseApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success("Exam deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete exam");
    },
  });
};

