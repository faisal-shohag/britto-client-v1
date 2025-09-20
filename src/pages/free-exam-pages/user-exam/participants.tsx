
import React, { useState } from "react";
import { useExamPaticipants } from "@/hooks/free-exam-hooks/use-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, User } from "lucide-react";
import { FaFaceSadTear } from "react-icons/fa6";
import { bnNumber } from "@/lib/bnNumbers";

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

  const limit = 30;

  const { data, isLoading, error } = useExamPaticipants(examId, {
    page,
    limit,
  });



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

  const { participants, totalPages } = data;


  return (
    <>
    <div className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border">
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8" />
         <div>
            <div className="font-bold"> যারা পরীক্ষা দিয়েছে({bnNumber(participants.length)} জন)</div>
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
         <div className="mt-3 space-y-2">
           {participants.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 py-1 px-2 border rounded-lg ${
                entry.userId == userId ? "bg-gradient-to-r from-pink-600 to-red-500  text-white" : "bg-white dark:bg-zinc-950 "
              }`}
            >

              <Avatar className="h-7 w-7">
                <AvatarImage src={entry.user.picture} alt={entry.user.name} />
                <AvatarFallback className="">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{entry.user.name}</p>
                <p className="text-xs">
                  {entry.user.college || entry.user.group}
                </p>
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
