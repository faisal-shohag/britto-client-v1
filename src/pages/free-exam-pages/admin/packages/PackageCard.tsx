import React from 'react';
import type { Package } from '@/hooks/free-exam-hooks/use-packages';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen, 
  Clock,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface PackageCardProps {
  package: Package;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const groupColors = {
  SCIENCE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ARTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  COMMERCE: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const statusColors = {
  DRAFT: 'bg-zinc-500/10 text-zinc-400',
  PUBLISHED: 'bg-blue-500/10 text-blue-400',
  ACTIVE: 'bg-green-500/10 text-green-400',
  COMPLETED: 'bg-orange-500/10 text-orange-400',
  ARCHIVED: 'bg-red-500/10 text-red-400',
};

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onView,
  onEdit,
  onDelete,
}) => {
  const totalExams = pkg.freeExams.length;
  const activeExams = pkg.freeExams.filter(exam => exam.status === 'ACTIVE').length;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-zinc-700">
              <AvatarImage src={pkg.image} alt={pkg.title} />
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-lg font-semibold">
                {pkg.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg text-zinc-100 line-clamp-2">
                {pkg.title}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={`mt-1 ${groupColors[pkg.group]} text-xs`}
              >
                {pkg.group}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-zinc-800"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
              <DropdownMenuItem 
                onClick={() => onView?.(pkg.id)}
                className="hover:bg-zinc-800 text-zinc-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onEdit?.(pkg.id)}
                className="hover:bg-zinc-800 text-zinc-300"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Package
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={() => onDelete?.(pkg.id)}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Package
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {pkg.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
            {pkg.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <BookOpen className="h-4 w-4" />
            <span>{totalExams} Exam{totalExams !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Users className="h-4 w-4" />
            <span>{activeExams} Active</span>
          </div>
        </div>

        {/* Recent Exams Preview */}
        {pkg.freeExams.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Recent Exams
            </div>
            {pkg.freeExams.slice(0, 2).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 truncate flex-1 pr-2">
                  {exam.title}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`${statusColors[exam.status]} text-xs px-2 py-0`}
                >
                  {exam.status}
                </Badge>
              </div>
            ))}
            {pkg.freeExams.length > 2 && (
              <div className="text-xs text-zinc-500">
                +{pkg.freeExams.length - 2} more exams
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Created {formatDistanceToNow(new Date(pkg.createdAt), { addSuffix: true })}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onView?.(pkg.id)}
          className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
