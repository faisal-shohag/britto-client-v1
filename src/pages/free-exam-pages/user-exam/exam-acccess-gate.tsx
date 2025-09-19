import React from "react";

import {
  useExamAccess,
  useStartExam,
} from "@/hooks/free-exam-hooks/user-user-exams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Lock,
  PlayCircle,
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { useNavigate } from "react-router";

interface ExamAccessGateProps {
  examId: number;
  userId: number;
  onAccessGranted: () => void;
}

export const ExamAccessGate: React.FC<ExamAccessGateProps> = ({
  examId,
  userId,
  onAccessGranted,
}) => {
  const navigate = useNavigate();
  const { data: accessData, isLoading, error } = useExamAccess(examId, userId);
  const startExamMutation = useStartExam();

  const handleStartExam = async () => {
    try {
      await startExamMutation.mutateAsync({ examId, userId });
      onAccessGranted();
    } catch (error) {
      console.error("Failed to start exam:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-zinc-950 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="p-8">
            <Skeleton className="h-8 w-1/2 mb-4 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-full mb-2 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-3/4 mb-6 dark:bg-zinc-800" />
            <Skeleton className="h-12 w-full dark:bg-zinc-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !accessData) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Access Denied
            </h2>
            <p className="text-zinc-400 mb-4">
              You don't have permission to access this exam.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/free")}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const exam = accessData.exam;
  const now = new Date();
  const startTime = new Date(exam.startTime);
  const endTime = new Date(exam.endTime);

  // Check if exam is available
  const isBeforeStart = isBefore(now, startTime);
  const isAfterEnd = isAfter(now, endTime);
  //   const isActive = !isBeforeStart && !isAfterEnd;

  // Check if user already participated
  if (accessData.hasParticipated) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Card className="bg-green-500/10 border-green-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              Already Participated
            </h2>
            <p className="text-zinc-400 mb-4">
              You have already taken this exam. Each user can participate only
              once.
            </p>
            <Button
              onClick={() => navigate(`/free/leaderboard/exam/${examId}`)}
              className="bg-green-600 hover:bg-green-700"
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam not started yet
  if (isBeforeStart) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Card className="bg-blue-500/10 border-blue-500/20 max-w-2xl w-full mx-4">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Exam Not Started Yet
            </h2>
            <p className="text-zinc-400 mb-6">
              This exam will start on {format(startTime, "PPP")} at{" "}
              {format(startTime, "p")}
            </p>

            <div className="bg-zinc-800/50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">
                {exam.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-300">{exam.totalMarks} marks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-300">
                    {exam.durationInMinutes} minutes
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam ended
  if (isAfterEnd) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Exam Ended
            </h2>
            <p className="text-zinc-400 mb-4">
              This exam ended on {format(endTime, "PPP")} at{" "}
              {format(endTime, "p")}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam is active - show start screen
  return (
    <div className="py-5 bg-white dark:bg-zinc-950 flex items-center justify-center">
      <Card className="dark:bg-zinc-900/50 max-w-2xl w-full mx-4">
        <CardHeader>
          <CardTitle className="text-2xl  text-center">{exam.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {exam.description && (
            <p className="text-zinc-400 text-center mb-6 leading-relaxed">
              {exam.description}
            </p>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-8">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold text-sm">
              গুরুত্বপূর্ণ নির্দেশনা
              </span>
            </div>
            <ul className="text-xs space-y-1">
              <li>• তুমি এই পরীক্ষাটি কেবল একবার দিতে পারবে</li>
              <li>• তোমার উত্তর অটোমেটিক সেভ হবে</li>
              <li>• সময় শেষ হলে পরীক্ষা অটোমেটিক জমা হবে</li>
              <li>• নিশ্চিত করো তোমার ইন্টারনেট সংযোগ স্থিতিশীল</li>
            </ul>
          </div>

          <Button
            onClick={handleStartExam}
            disabled={startExamMutation.isPending}
            className="w-full bg-gradient-to-r from-red-600 to-pink-500  text-white text-lg py-2"
          >
            <PlayCircle className="mr-2 h-6 w-6" />
            {startExamMutation.isPending ? "শুরু হচ্ছে..." : "এক্সাম শুরু করো"}
          </Button>

          <p className="text-xs text-zinc-500 text-center mt-4">
            By starting this exam, you agree to follow all the instructions and
            rules.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
