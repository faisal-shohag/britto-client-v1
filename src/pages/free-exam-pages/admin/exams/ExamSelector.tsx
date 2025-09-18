import React from 'react';
import { useExams } from '@/hooks/free-exam-hooks/use-exams';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ExamSelectorProps {
  value?: number;
  onValueChange: (examId: number) => void;
  placeholder?: string;
  packageId?: number;
  status?: string;
}

const statusColors = {
  DRAFT: 'bg-zinc-500/10 text-zinc-400',
  PUBLISHED: 'bg-blue-500/10 text-blue-400',
  ACTIVE: 'bg-green-500/10 text-green-400',
  COMPLETED: 'bg-orange-500/10 text-orange-400',
  ARCHIVED: 'bg-red-500/10 text-red-400',
};

export const ExamSelector: React.FC<ExamSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select exam...",
  packageId,
  status,
}) => {
  const { data, isLoading } = useExams({ 
    packageId, 
    status,
    limit: 100 
  });

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
        {data?.exams.map((exam) => (
          <SelectItem
            key={exam.id}
            value={exam.id.toString()}
            className="text-zinc-300 hover:bg-zinc-800"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className="truncate">{exam.title}</div>
                <div className="text-xs text-zinc-500 truncate">
                  {exam.package.title}
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`ml-2 ${statusColors[exam.status]} text-xs`}
              >
                {exam.status}
              </Badge>
            </div>
          </SelectItem>
        ))}
        {data?.exams.length === 0 && (
          <SelectItem value="" disabled className="text-zinc-500">
            No exams available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};