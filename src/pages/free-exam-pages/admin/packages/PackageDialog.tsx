import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PackageForm } from './PackageForm';
import { useCreatePackage, useUpdatePackage, usePackage } from '@/hooks/free-exam-hooks/use-packages';
import type {CreatePackageData } from '@/hooks/free-exam-hooks/use-packages';

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId?: number;
  mode?: 'create' | 'edit';
}

export const PackageDialog: React.FC<PackageDialogProps> = ({
  open,
  onOpenChange,
  packageId,
  mode = 'create',
}) => {
  const createPackageMutation = useCreatePackage();
  const updatePackageMutation = useUpdatePackage();
  
  const { data: packageData } = usePackage(packageId || 0);

  const handleSubmit = (data: CreatePackageData) => {
    if (mode === 'create') {
      createPackageMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    } else if (packageId) {
      updatePackageMutation.mutate(
        { id: packageId, data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    }
  };

  const isLoading = createPackageMutation.isPending || updatePackageMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {mode === 'create' ? 'Create Package' : 'Edit Package'}
          </DialogTitle>
        </DialogHeader>
        
        <PackageForm
          initialData={mode === 'edit' ? packageData : undefined}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          submitLabel={mode === 'create' ? 'Create Package' : 'Update Package'}
        />
      </DialogContent>
    </Dialog>
  );
};
