import { Button } from "@/components/ui/button";
import { useUpcomingExam } from "@/hooks/free-exam-hooks/use-exams";
import { bnNumber } from "@/lib/bnNumbers";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { useEffect, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Link } from "react-router";
import { Spinner } from "./Splash";

const HomeExamCard = () => {
  const { data: exam, isLoading } = useUpcomingExam();
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
        // Upcoming
        setStatus("upcoming");
        updateCountdown(start - now);
      } else if (now >= start && now < end) {
        // Running
        setStatus("running");
        updateCountdown(end - now);
      } else {
        // Ended
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

  if (isLoading) {
    return (
      <div className="p-5 bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-lg text-center border relative">
        <Spinner/>
       এক্সাম লোড হচ্ছে...
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
    <div className="p-5 bg-white dark:bg-zinc-900 backdrop-blur-sm rounded-lg overflow-hidden text-center border relative">
      <div className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl px-5 absolute -left-2 top-0">
        {exam.package?.title}
      </div>

      <div className="text-black text-xl font-bold dark:text-white">
        {exam.title}
      </div>

      {status === "upcoming" && (
        <>
          <div className="flex gap-2 justify-center font-bold">
          {timeLeft.days !== "0" && <span>{bnNumber(timeLeft.days)} দিন</span>}
            {timeLeft.hours !== "0" && <span>{bnNumber(timeLeft.hours)} ঘণ্টা</span>}
            {timeLeft.minutes !== "0" && <span>{bnNumber(timeLeft.minutes)} মিনিট</span>}
            <span>{bnNumber(timeLeft.seconds)} সেকেন্ড</span>
          </div>
          <div className="text-sm">শুরু হতে বাকি</div>
          <Link to={`exam/${exam.id}`}>
            <Button
              className="mt-2 bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white"
              variant={"outline"}
              size={"sm"}
            >
              প্রবেশ করো
            </Button>
          </Link>
        </>
      )}

      {status === "running" && (
        <>
          <div className="flex gap-2 justify-center">
         {timeLeft.days !== "0" && <span>{bnNumber(timeLeft.days)} দিন</span>}
            {timeLeft.hours !== "0" && <span>{bnNumber(timeLeft.hours)} ঘণ্টা</span>}
            {timeLeft.minutes !== "0" && <span>{bnNumber(timeLeft.minutes)} মিনিট</span>}
            <span>{bnNumber(timeLeft.seconds)} সেকেন্ড</span>
          </div>
          <div className="text-sm">সময় বাকি</div>
           <Link to={`exam/${exam.id}`}>
            <Button
              className="mt-2 bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white"
              variant={"outline"}
              size={"sm"}
            >
              প্রবেশ করো
            </Button>
          </Link>
        </>
      )}

      {status === "ended" && (
        <>
        <div className="text-red-500 font-semibold text-lg">শেষ</div>
           <Link to={`exam/${exam.id}`}>
            <Button
              className="mt-2 bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white"
              variant={"outline"}
              size={"sm"}
            >
              প্রবেশ করো
            </Button>
          </Link>
          </>
      )}

      <div className="text-sm flex justify-center gap-2 border-t-2 my-1 pt-2 border-dotted">
        <div className="flex items-center gap-1">
          <MdOutlineAccessTimeFilled /> সময়: {bnNumber(exam.durationInMinutes)}{" "}
          মিনিট{" "}
        </div>
        <div>|</div>
        <div className="flex items-center gap-1">
          {" "}
          <AiFillQuestionCircle /> প্রশ্ন: {bnNumber(exam.totalMarks)} টি
        </div>
      
      </div>
    </div>
  );
};

export default HomeExamCard;
