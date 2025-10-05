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

const Theater = () => {
  const { moduleId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: contentData, isLoading } = useGetContentByModuleId(
    Number(moduleId)
  );

  if (isLoading) return <Spinner />;

  const {  contents } = contentData;
  // console.log(module, contents);

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
      <div className="bg-white rounded-lg p-2 border">
        <div className="space-y-3">
          <div className="min-h-[200px]">
            {contents[currentIndex].type === "VIDEO" && (
              <PlayerView source={contents[currentIndex].videoUrl} setIsPlaying={setIsPlaying}/>
            )}
            {contents[currentIndex].type === "TEXT" && (
              <TextView text={contents[currentIndex].textContent} />
            )}
            {contents[currentIndex].type === "QUIZ" && (
              <QuizView content={contents[currentIndex]} />
            )}
          </div>
          <div className="flex justify-between">
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
          <Separator />
          <div className="space-y-2">
            {contents.map((content, index) => (
              <div
                key={content.id}
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer p-2 rounded-lg flex gap-1 border ${
                  currentIndex === index
                    ? " bg-gradient-to-r from-pink-500 to-red-500 text-white"
                    : ""
                }`}
              >
                 {(isPlaying && content.type==="VIDEO") ? <Playing/> : contentIcon(content.type)} {content.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theater;

