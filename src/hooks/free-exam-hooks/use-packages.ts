import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

// Types
export interface Package {
  id: number;
  title: string;
  description?: string;
  group: 'SCIENCE' | 'ARTS' | 'COMMERCE' | 'HUMANITY';
  image?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    freeExams: number,
    userPackages: number
  }
  freeExams: {
    id: number;
    title: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  }[];
}

export interface PackageResponse {
  packages: Package[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreatePackageData {
  title: string;
  description?: string;
  group: 'SCIENCE' | 'ARTS' | 'COMMERCE' | 'HUMANITY';
  image?: string;
}

// API functions
const packagesAPI = {
  getPackages: (params?: { page?: number; limit?: number; group?: string }) =>
    api.get('/freeExam/packages', { params }),
  
  getPackageById: (id: number) =>
    api.get(`/freeExam/packages/${id}`),

  getPackagesByUser: (userId: number) =>
    api.get(`/freeExam/users/${userId}/packages`),
  
  createPackage: (data: CreatePackageData) =>
    api.post('/freeExam/packages', data),
  
  updatePackage: (id: number, data: Partial<CreatePackageData>) =>
    api.put(`/freeExam/packages/${id}`, data),
  
  deletePackage: (id: number) =>
    api.delete(`/freeExam/packages/${id}`),
};

// Hooks
export const usePackages = (params?: { page?: number; limit?: number; group?: string }) => {
  return useQuery({
    queryKey: ['packages', params],
    queryFn: () => packagesAPI.getPackages(params),
    select: (data) => data.data.data as PackageResponse,
  });
};

//  usePackagesByUser
export const usePackagesByUser = (userId: number) => {
  return useQuery({
    queryKey: ['packagesByUser', userId],
    queryFn: () => packagesAPI.getPackagesByUser(userId),
    select: (data) => data.data.data as Package[],
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePackage = (id: number) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => packagesAPI.getPackageById(id),
    select: (data) => data.data.data as Package,
    enabled: !!id,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: packagesAPI.createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Package created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create package');
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePackageData> }) =>
      packagesAPI.updatePackage(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['package', id] });
      toast.success('Package updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update package');
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: packagesAPI.deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Package deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete package');
    },
  });
};