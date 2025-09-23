import { FreeUserContext } from "@/context/FreeUser.context";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {  use } from "react";
// /users/:userId/rank-stats
const useFreeUser = () => {
    const {user} = use(FreeUserContext) as any
    return user
};
export default useFreeUser;


const userAPI = {
  getUserStats: (userId: number) =>
    api.get(`/freeExam/users/${userId}/rank-stats`),

};

export const useUserStates = (userId: number) => {
  return useQuery({
    queryKey: ['free-user', userId],
    queryFn: () => userAPI.getUserStats(userId),
    select: (data) => data.data.data as any,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};