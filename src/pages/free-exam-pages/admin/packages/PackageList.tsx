import React, { useState } from 'react';
import { usePackages, useDeletePackage } from '@/hooks/free-exam-hooks/use-packages';
import { PackageCard } from './PackageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  TrendingUp,
  Users,
  Package as PackageIcon
} from 'lucide-react';
import { Link } from 'react-router';

interface PackageListProps {
  onCreatePackage?: () => void;
  onEditPackage?: (id: number) => void;
  onViewPackage?: (id: number) => void;
}

export const PackageList: React.FC<PackageListProps> = ({
  onCreatePackage,
  onEditPackage,
  onViewPackage,
}) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [deletePackageId, setDeletePackageId] = useState<number | null>(null);

  const { data, isLoading, error } = usePackages({
    page,
    limit: 12,
    group: selectedGroup || undefined,
  });

  const deletePackageMutation = useDeletePackage();

  const handleDeleteConfirm = () => {
    if (deletePackageId) {
      deletePackageMutation.mutate(deletePackageId);
      setDeletePackageId(null);
    }
  };

  const filteredPackages = data?.packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = React.useMemo(() => {
    if (!data?.packages) return { total: 0, totalExams: 0, activeExams: 0 };
    
    const totalExams = data.packages.reduce((sum, pkg) => sum + pkg.freeExams.length, 0);
    const activeExams = data.packages.reduce((sum, pkg) => 
      sum + pkg.freeExams.filter(exam => exam.status === 'ACTIVE').length, 0
    );
    
    return {
      total: data.packages.length,
      totalExams,
      activeExams,
    };
  }, [data]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-2">Failed to load packages</div>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Exam Packages</h1>
          <p className="text-zinc-400 mt-1">Manage and organize your exam packages</p>
        </div>
        <Button 
          onClick={onCreatePackage}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Packages</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
              <PackageIcon className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Exams</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalExams}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Active Exams</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.activeExams}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Avg Exams/Package</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {stats.total > 0 ? Math.round((stats.totalExams / stats.total) * 10) / 10 : 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
            
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-800 border-zinc-700 text-zinc-100">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-300 hover:bg-zinc-800">All Groups</SelectItem>
                <SelectItem value="SCIENCE" className="text-zinc-300 hover:bg-zinc-800">Science</SelectItem>
                <SelectItem value="ARTS" className="text-zinc-300 hover:bg-zinc-800">Arts</SelectItem>
                <SelectItem value="COMMERCE" className="text-zinc-300 hover:bg-zinc-800">Commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || selectedGroup) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-zinc-400">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedGroup && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  Group: {selectedGroup}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGroup('');
                }}
                className="text-zinc-400 hover:text-zinc-300 ml-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                    <Skeleton className="h-3 w-16 bg-zinc-800" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full bg-zinc-800 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-6 bg-zinc-800" />
                  <Skeleton className="h-6 bg-zinc-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-12 text-center">
            <PackageIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">
              {searchTerm || selectedGroup ? 'No packages found' : 'No packages yet'}
            </h3>
            <p className="text-zinc-500 mb-4">
              {searchTerm || selectedGroup 
                ? 'Try adjusting your search or filters'
                : 'Create your first exam package to get started'
              }
            </p>
            {!searchTerm && !selectedGroup && (
              <Button onClick={onCreatePackage} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Package
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
           <Link 
              key={pkg.id}
              to={`/free/admin/examsbypackage/${pkg.id}`}
           >
            <PackageCard
           
              package={pkg}
              onView={onViewPackage}
              onEdit={onEditPackage}
              onDelete={setDeletePackageId}
            />
           </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(data.totalPages, page - 2 + i));
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  className={
                    pageNum === page
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deletePackageId} 
        onOpenChange={() => setDeletePackageId(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Delete Package</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this package? This action cannot be undone 
              and will remove all associated exams.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deletePackageMutation.isPending}
            >
              {deletePackageMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};