import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed queries once
      staleTime: 1000 * 60 * 1, // 1 minutes
      refetchOnWindowFocus: false, // Prevent refetching on tab switch
    },
  },
})