import { Button } from "@/components/ui/button";
import { bnNumber } from "@/lib/bnNumbers";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Link } from "react-router";
import { useEffect, useState } from "react";

type Exam = {
  id: number | string;
  title: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  totalMarks: number;
  package?: {
    title?: string;
  };
};

type ExamCardProps = {
  exam: Exam;
  loading?: boolean;
  hasParticipated?: boolean
};

const ExamCard = ({ exam, loading, hasParticipated }: ExamCardProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "0",
    hours: "0",
    minutes: "0",
    seconds: "0",
  });
  const [status, setStatus] = useState<"upcoming" | "running" | "ended">(
    "upcoming"
  );

  useEffect(() => {
    if (!exam) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(exam.startTime).getTime();
      const end = new Date(exam.endTime).getTime();

      if (now < start) {
        setStatus("upcoming");
        updateCountdown(start - now);
      } else if (now >= start && now < end) {
        setStatus("running");
        updateCountdown(end - now);
      } else {
        setStatus("ended");
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const updateCountdown = (distance: number) => {
    if (distance <= 0) {
      setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    setTimeLeft({
      days: String(days),
      hours: String(hours),
      minutes: String(minutes),
      seconds: String(seconds),
    });
  };

  if (loading) {
    return (
      <div className="p-5 bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg text-center border relative">
        Loading exam...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-5 bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg text-center border relative">
        কোনো এক্সাম পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="p-5 bg-white dark:bg-zinc-900  backdrop-blur-sm rounded-lg overflow-hidden text-center border relative">
      {exam.package?.title && (
        <div className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl px-5 absolute -left-2 top-0">
          {exam.package.title}
        </div>
      )}

      <div className="text-black text-xl font-bold dark:text-white">
        {exam.title}
      </div>

      {status !== "ended" && (
        <>
          <div className="flex gap-2 justify-center font-bold">
            {timeLeft.days !== "0" && (
              <span>{bnNumber(timeLeft.days)} দিন</span>
            )}
            {timeLeft.hours !== "0" && (
              <span>{bnNumber(timeLeft.hours)} ঘণ্টা</span>
            )}
            {timeLeft.minutes !== "0" && (
              <span>{bnNumber(timeLeft.minutes)} মিনিট</span>
            )}
            <span>{bnNumber(timeLeft.seconds)} সেকেন্ড</span>
          </div>
          <div className="text-sm">
            {status === "upcoming" ? "শুরু হতে বাকি" : "সময় বাকি"}
          </div>
        </>
      )}

      <div>
        {!hasParticipated ? <>
          {status === "running" && (
        <Link to={`/free/playground/${exam.id}`}>
          <Button
            className="mt-2 bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white"
            variant="outline"
            size="sm"
          >
            শুরু করো
          </Button>
        </Link>
      )}
        </> : <div className="rounded-xl ">
      <div>    তুমি এক্সামটি দিয়েছো!</div>
          </div>}
      </div>

  

      {status === "ended" && (
        <div className="rounded-xl text-red-500">
      <div>    শেষ</div>
         <Link to={`/free/answersheet/exam/${exam.id}`}> <Button className="bg-gradient-to-r text-white from-red-600 to-pink-500">Answer Sheet</Button></Link>
          </div>
      )}

      <div className="text-sm flex justify-center gap-2 border-t-2 my-1 pt-2 border-dotted">
        <div className="flex items-center gap-1">
          <MdOutlineAccessTimeFilled /> সময়: {bnNumber(exam.durationInMinutes)}{" "}
          মিনিট
        </div>
        <div>|</div>
        <div className="flex items-center gap-1">
          <AiFillQuestionCircle /> প্রশ্ন: {bnNumber(exam.totalMarks)} টি
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
