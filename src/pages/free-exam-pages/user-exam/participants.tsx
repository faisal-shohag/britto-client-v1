// components/exam-results/leaderboard.tsx
import React, { useState } from "react";
import { useExamPaticipants } from "@/hooks/free-exam-hooks/use-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, Clock, Crown, User } from "lucide-react";
import { FaFaceSadTear } from "react-icons/fa6";

interface LeaderboardProps {
  examId: number;
  userId?: number;
  showUserRank?: boolean;
}

export const Participants: React.FC<LeaderboardProps> = ({
  examId,
  userId,
}) => {
  const [page, setPage] = useState(1);

  const limit = 20;

  const { data, isLoading, error } = useExamPaticipants(examId, {
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

  const { participants, exam, totalPages } = data;

  return (
    <>
    <div className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border">
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8" />
         <div>
          <div className="font-bold"> যারা পরীক্ষা দিয়েছে</div>
          <div className="text-xs"> পরীক্ষা শেষে এখানে সবার মার্ক এবং অবস্থান দেখতে পারবে</div>
         </div>
        </div>
      </div>
      <div>


        {/* Leaderboard Entries */}
        <div className="space-y-4">
        {! participants.length   && <div className="py-10 text-center flex justify-center flex-col items-center gap-3"> 
          <div className="text-zinc-500"><FaFaceSadTear className="h-12 w-12"/></div>
          <div className="text-lg text-zinc-700">এখনো কেউ এক্সাম দেয়নি!</div>
        </div>}
          {participants.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                entry.userId === userId ? "bg-primary/10" : "bg-background"
              }`}
            >
              <div className="w-12 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>
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
                <p className="font-semibold">
                  {entry.score}/{exam.totalMarks}
                </p>
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
      </div>
    </div>
    </>
  );
};
