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
  getCorrectAnswers: (userId: number, page: number, limit: number) => 
    api.get(`/freeUser/correct-answers/${userId}?page=${page}&limit=${limit}`),
  getWrongAnswers: (userId: number, page: number, limit: number) =>
    api.get(`/freeUser/wrong-answers/${userId}?page=${page}&limit=${limit}`),
  getUnanswers: (userId: number, page: number, limit: number) =>
    api.get(`/freeUser/unanswered/${userId}?page=${page}&limit=${limit}`),
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

export const useCorrectAnswers = (userId: number, page: number, limit: number) => {
  return useQuery({
    queryKey: ['free-user', userId, page, limit],
    queryFn: () => userAPI.getCorrectAnswers(userId, page, limit),
    select: (data) => data.data.data as any,
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 5 minutes
  });
};

export const useWrongAnswers = (userId: number, page: number, limit: number) => {
  return useQuery({
    queryKey: ['free-user', userId, page, limit],
    queryFn: () => userAPI.getWrongAnswers(userId, page, limit),
    select: (data) => data.data.data as any,
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 5 minutes
  });
};

export const useUnanswers = (userId: number, page: number, limit: number) => {
  return useQuery({
    queryKey: ['free-user', userId, page, limit],
    queryFn: () => userAPI.getUnanswers(userId, page, limit),
    select: (data) => data.data.data as any,
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 5 minutes
  });
};