import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const enrollApi = {
    enrollment: (userId, courseId) => api.post('/enrollment/enroll', {userId, courseId}),
    getEnrollmentsbyCourseId: (courseId, page=1, limit=10) => api.get(`/enrollment/enrollments/course/${courseId}?page=${page}&limit=${limit}`),
    updateEnrollmentStatus: (enrollmentId, status) => api.put(`/enrollment/status`, {enrollmentId, status})

}

export const useEnroll = () => {
    return useMutation({
        mutationFn: ({userId, courseId}: {userId: number, courseId: number}) => enrollApi.enrollment(userId, courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments", "course"] });
            toast.success("Enrolled successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to enroll");
        },
    });
}

export const useGetEnrollmentsbyCourseId = ({courseId, page, limit}:{courseId:number, page?:number, limit?:number}) => {
   return useQuery({
        queryKey: ["enrollments", "course", courseId, page, limit],
        queryFn: () => enrollApi.getEnrollmentsbyCourseId(courseId, page, limit),
        enabled: !!courseId,
        select:(data) => data.data.data
    })
}

export const useUpdateEnrollmentStatus = () => {
    return useMutation({
        mutationFn: ({enrollmentId, status}: {enrollmentId: number, status: string}) => enrollApi.updateEnrollmentStatus(enrollmentId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments", "course"] });
            toast.success("Enrollment status updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update enrollment status");
        },
    });
}