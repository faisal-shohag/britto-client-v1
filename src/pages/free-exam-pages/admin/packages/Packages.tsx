import React, { useState } from 'react';
import { PackageList } from './PackageList';
import { PackageDialog } from './PackageDialog';
import { PackageDetailDialog } from './PackageDetailDialog';

export  const PackageManagement: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const handleCreatePackage = () => {
    setCreateDialogOpen(true);
  };

  const handleEditPackage = (id: number) => {
    setSelectedPackageId(id);
    setEditDialogOpen(true);
  };

  const handleViewPackage = (id: number) => {
    setSelectedPackageId(id);
    setDetailDialogOpen(true);
  };

  const handleEditFromDetail = (id: number) => {
    setDetailDialogOpen(false);
    setSelectedPackageId(id);
    setEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <PackageList
          onCreatePackage={handleCreatePackage}
          onEditPackage={handleEditPackage}
          onViewPackage={handleViewPackage}
        />

        {/* Create Package Dialog */}
        <PackageDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          mode="create"
        />

        {/* Edit Package Dialog */}
        <PackageDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setSelectedPackageId(null);
          }}
          packageId={selectedPackageId || undefined}
          mode="edit"
        />

        {/* Package Detail Dialog */}
        {selectedPackageId && (
          <PackageDetailDialog
            open={detailDialogOpen}
            onOpenChange={(open) => {
              setDetailDialogOpen(open);
              if (!open) setSelectedPackageId(null);
            }}
            packageId={selectedPackageId}
            onEdit={handleEditFromDetail}
          />
        )}
      </div>
    </div>
  );
};
export default PackageManagement;