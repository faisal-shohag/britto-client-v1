import api from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const enrollApi = {
    enrollment: (userId, courseId) => api.post('/enrollment/enroll', {userId, courseId})
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