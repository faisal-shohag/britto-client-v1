import { Button } from "@/components/ui/button";
import { useGetContentByModuleId } from "@/hooks/course/use-content";
import { Spinner } from "@/pages/free-exam-pages/components/Splash";
import { useState } from "react";
import { useParams } from "react-router";
import PlayerView from "./PlayerView";
import { Separator } from "@/components/ui/separator";
import TextView from "./TextView";
import QuizView from "./QuizView";
import { contentIcon } from "@/utils/course-utilities";
import { ChevronLeft, ChevronRight } from "lucide-react";
import  Playing from "@/pages/free-exam-pages/components/Playing";
import { bnNumber } from "@/lib/bnNumbers";

const Theater = () => {
  const { moduleId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: contentData, isLoading } = useGetContentByModuleId(
    Number(moduleId)
  );

  if (isLoading) return <Spinner />;

  const {module,  contents } = contentData;


  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setIsPlaying(false)
  };

  const handleNext = () => {
    if (currentIndex < contents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setIsPlaying(false)
  };

  return (
    <div>
      <div className="bg-white  dark:bg-zinc-900 rounded-lg  border">
        <div className="space-y-3 h-full">
          <div className="min-h-1/3 p-2">
            {contents[currentIndex].type === "VIDEO" && (
              <PlayerView source={contents[currentIndex].videoUrl} setIsPlaying={setIsPlaying}/>
            )}
            {contents[currentIndex].type === "TEXT" && (
              <TextView title={contents[currentIndex].title} text={contents[currentIndex].textContent} />
            )}
            {contents[currentIndex].type === "QUIZ" && (
              <QuizView content={contents[currentIndex]} />
            )}
          </div>

          <div className="flex justify-between fixed left-0 -bottom-3 px-3 py-2 dark:bg-zinc-900 bg-white z-50 w-full">
            <Button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              size={"sm"}
              variant={"outline"}
            >
              <ChevronLeft /> Previous
            </Button>
            <Button
              disabled={currentIndex === contents.length - 1}
              onClick={handleNext}
              size={"sm"}
            >
              Next <ChevronRight />
            </Button>
          </div>


          <div className="space-y-3 fixed bottom-0 left-0 border w-full dark:bg-zinc-900 bg-white px-2 rounded-md overflow-y-scroll h-[300px] pt-3 pb-[70px] ">
          <div className="space-y-2">
            <h1 className="font-bold text-xs">টার্গেট: {module.title} | টাস্ক: {bnNumber(currentIndex+1)}/{bnNumber(contents.length)} </h1>
          </div>
          <Separator />
          <div className="space-y-2">
            {contents.map((content, index) => (
              <div
                key={content.id}
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer p-2 rounded-lg flex gap-1 border text-sm items-center ${
                  currentIndex === index
                    ? " bg-gradient-to-r from-pink-500 to-red-500 text-white"
                    : ""
                }`}
              >
               {(isPlaying && content.type==="VIDEO") ? <Playing/> : contentIcon(content.type, 20)} <span className="text-xs">{content.order}.</span>{content.title}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theater;

