import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { examStatusBadge, examStatus } from "@/utils/exam-utilities.jsx";
import { Clock, Users, Target, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import { FaCalendarDays } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { bnNumber } from "@/lib/bnNumbers";

interface ExamListProps {
  data: any,
  onViewExam?: (id: number) => void;
  onViewAll?: () => void;
}

export const ExamList: React.FC<ExamListProps> = ({
  data,
  onViewExam,
  onViewAll,
}) => {

  const {exams, pkg} = data;



  if (!exams.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>পরীক্ষাসমূহ</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12  mx-auto mb-3" />
          <div className="mb-2">No exams found</div>
          <div className="text-sm ">Create your first exam to get started</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-zinc-900/50 dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="dark:text-zinc-100 flex justify-between w-full items-center">
            <div>পরীক্ষাসমূহ ({bnNumber(exams.length)}টি)</div>

            <Dialog>
                <DialogTrigger className="bg-pink-600 flex gap-1 px-3 py-2 text-sm items-center rounded-md text-white">
                <FaCalendarDays /> রুটিন
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-1"><FaCalendarDays /> রুটিন</DialogTitle>
                  <DialogDescription>
                    <img  className="mt-2 rounded-xl" src={pkg.routine} alt="routine"/>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardTitle>
          {onViewAll && exams.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="dark:text-zinc-400 hover:text-zinc-300"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {exams.map((exam) => (
          <Link to={`/free/exam/${exam.id}`} key={exam.id}>
            <div
              key={exam.id}
              className="flex items-center gap-3 p-3 rounded-lg border dark:border-zinc-700/50 hover:border-zinc-600/50 transition-colors cursor-pointer relative"
              onClick={() => onViewExam?.(exam.id)}
            >
              <div className="absolute right-2 top-1 text-xs">
                {examStatusBadge(exam.startTime, exam.endTime)}
              </div>

              {examStatus(exam.startTime, exam.endTime) === "Upcoming" && (
                <div className="absolute -left-1 -top-2 text-[10px] bg-gradient-to-b from-pink-500 to-red-500 text-white rounded-xl px-2 py-[1px]">
                  {format(new Date(exam.startTime), "d MMM yyyy h:mm a")}
                </div>
              )}

              <Avatar className="h-10 w-10 border dark:border-zinc-700">
                <AvatarImage src={exam.image} alt={exam.title} />
                <AvatarFallback className="dark:bg-zinc-800 dark:text-zinc-400 text-sm">
                  {exam.title.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium dark:text-zinc-100 truncate pr-2">
                    {exam.title}
                  </h4>
                </div>

                <div className="flex items-center gap-4 text-xs dark:text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{exam.durationInMinutes} মিনিট</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{exam.totalMarks} মার্কস</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{exam._count?.leaderboard || 0} জন</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
