// components/exam-results/leaderboard.tsx
import React, { useState } from 'react';
import { useExamLeaderboard } from '@/hooks/free-exam-hooks/use-leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  Crown,
  User
} from 'lucide-react';


interface LeaderboardProps {
  examId: number;
  userId?: number;
  showUserRank?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  examId, 
  userId, 
  showUserRank = true 
}) => {
  const [page, setPage] = useState(1);

  const limit = 20;

  const { data, isLoading, error } = useExamLeaderboard(examId, { page, limit });

  console.log(data)
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-zinc-400 font-medium">#{rank}</span>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-4" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading leaderboard data</p>
        </CardContent>
      </Card>
    );
  }

  const { leaderboard, exam, userRank, totalPages } = data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {exam.title} Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
    

        {/* User Rank (if applicable) */}
        {showUserRank && userId && userRank && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-lg">
                  {getRankIcon(userRank.rank)}
                </Badge>
                <div>
                  <p className="font-semibold">Your Rank</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {userRank.score} | Percentile: {userRank.percentile.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Progress value={userRank.percentile} className="w-1/3" />
            </div>
          </div>
        )}

        {/* Leaderboard Entries */}
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                entry.userId === userId ? 'bg-primary/10' : 'bg-background'
              }`}
            >
              <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.user.picture} alt={entry.user.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{entry.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.user.college || entry.user.group}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{entry.score}/{exam.totalMarks}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {entry.timeTakenMinutes} min
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};