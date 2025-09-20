// components/exam-results/leaderboard.tsx
import React, { useState } from "react";
import { useExamLeaderboard } from "@/hooks/free-exam-hooks/use-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Crown, User } from "lucide-react";
import { FaFaceSadTear } from "react-icons/fa6";
import { bnNumber } from "@/lib/bnNumbers";

interface LeaderboardProps {
  examId: number;
  userId?: number;
  showUserRank?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  examId,
  userId,
  showUserRank = true,
}) => {
  const [page, setPage] = useState(1);

  const limit = 20;

  const { data, isLoading, error } = useExamLeaderboard(examId, {
    page,
    limit,
  });


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
          <CardTitle>যারা পরীক্ষা দিয়েছে</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading leaderboard data</p>
        </CardContent>
      </Card>
    );
  }

  const { leaderboard, exam, userRank, totalPages } = data;

  return (
    <>
    <div className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border">
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8" />
         <div>
          <div className="font-bold"> যারা পরীক্ষা দিয়েছে({bnNumber(leaderboard.length)} জন)</div>
          <div className="text-xs"> পরীক্ষা শেষে এখানে সবার মার্ক এবং অবস্থান দেখতে পারবে</div>
         </div>
        </div>
      </div>
      <div>
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
                    Score: {userRank.score} | Percentile:{" "}
                    {userRank.percentile.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Progress value={userRank.percentile} className="w-1/3" />
            </div>
          </div>
        )}

        {/* Leaderboard Entries */}
        <div className="space-y-4">
        {! leaderboard.length   && <div className="py-10 text-center flex justify-center flex-col items-center gap-3"> 
          <div className="text-zinc-500"><FaFaceSadTear className="h-12 w-12"/></div>
          <div className="text-lg text-zinc-700">এখনো কেউ এক্সাম দেয়নি!</div>
        </div>}
       <div className="mt-3 space-y-2">
           {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 border py-1 px-2 rounded-lg ${
                entry.userId === userId ? "bg-gradient-to-r from-pink-600 to-red-500 text-white" : "bg-background"
              }`}
            > <div># {index+1}</div>
              <Avatar className="h-7 w-7">
                <AvatarImage src={entry.user.picture} alt={entry.user.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{entry.user.name}</p>
                <p className="text-xs">
                  {entry.user.college || entry.user.group}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {entry.score}/{exam.totalMarks}
                </p>
                {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {entry.timeTakenMinutes} min
                </div> */}
              </div>
            </div>
          ))}
       </div>
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
      </div>
    </div>
    </>
  );
};
