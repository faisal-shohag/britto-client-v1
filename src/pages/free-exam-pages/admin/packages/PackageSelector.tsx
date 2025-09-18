import React from 'react';
import { usePackages } from '@/hooks/free-exam-hooks/use-packages';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PackageSelectorProps {
  value?: number;
  onValueChange: (packageId: number) => void;
  placeholder?: string;
  group?: 'SCIENCE' | 'ARTS' | 'COMMERCE';
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select package...",
  group,
}) => {
  const { data, isLoading } = usePackages({ group });

  const groupColors = {
    SCIENCE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ARTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    COMMERCE: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-full bg-zinc-800" />;
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onValueChange(parseInt(val))}
    >
      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800">
        {data?.packages.map((pkg) => (
          <SelectItem
            key={pkg.id}
            value={pkg.id.toString()}
            className="text-zinc-300 hover:bg-zinc-800"
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex-1 truncate">{pkg.title}</span>
              <Badge 
                variant="outline" 
                className={`ml-2 ${groupColors[pkg.group]} text-xs`}
              >
                {pkg.group}
              </Badge>
            </div>
          </SelectItem>
        ))}
        {data?.packages.length === 0 && (
          <SelectItem value="" disabled className="text-zinc-500">
            No packages available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};