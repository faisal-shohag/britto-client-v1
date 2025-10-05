import { Button } from "@/components/ui/button";
import { useGetCourseById } from "@/hooks/course/use-course";
import { useEnroll } from "@/hooks/course/use-enroll";
import useFreeUser from "@/hooks/free-exam-hooks/use-free-user";
import { Link, useParams } from "react-router";
import { Spinner } from "../../../components/Splash";
import { Separator } from "@/components/ui/separator";
import { SiCodeblocks } from "react-icons/si";

const CourseDetails = () => {
  const { courseId } = useParams();
  const user = useFreeUser();
  const { data: course, isLoading } = useGetCourseById({
    courseId: Number(courseId),
    userId: Number(user.id),
  });

  if (isLoading) return <div>Loading...</div>;
  console.log(course);

  if (!course.isEnrolled)
    return <NotEnrolledDetails course={course} userId={user.id} />;
  if(course.isEnrolled.status === "PENDING") return <EnrollmentPending course={course}/>

  return <AfterEnrolled course={course}/>;
};

export default CourseDetails;

const NotEnrolledDetails = ({ course, userId }) => {
  const enrollmentMutation = useEnroll();
  const handleJoin = () => {
    enrollmentMutation.mutate(
      {
        courseId: Number(course.id),
        userId: Number(userId),
      },
    );
  };

  const isLoading = enrollmentMutation.isPending

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-xl">
      <div className="flex relative justify-center items-center">
        <div
          style={{ backgroundImage: `url(${course.image})` }}
          className="h-[150px] rounded-xl overflow-hidden border md:h-[300px] w-full bg-cover bg-center"
        >
          {/* <img className="rounded-xl object-cover"  src={course.image} alt="" /> */}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <h1 className="font-bold">{course.title}</h1>
        <p className="text-gray-500 text-sm">{course.description}</p>
      
        <Button disabled={isLoading} onClick={handleJoin} className="">
            {isLoading && <Spinner/>} জয়েন করো
        </Button>
      </div>
    </div>
  );
};

const EnrollmentPending = ({course}) => {
  return  <div className="bg-white dark:bg-zinc-900 border rounded-xl">
      <div className="flex relative justify-center items-center">
        <div
          style={{ backgroundImage: `url(${course.image})` }}
          className="h-[150px] rounded-xl overflow-hidden border md:h-[300px] w-full bg-cover bg-center"
        >
          {/* <img className="rounded-xl object-cover"  src={course.image} alt="" /> */}
        </div>
      </div>
      <div className="space-y-2 p-3">
           <div className="bg-gradient-to-r text-center text-white p-2 border rounded-xl from-pink-500 via-orange-600 to-red-500">তুমি জয়েন রিকুয়েস্ট পাঠিয়েছো! খুব শিঘ্রই Accept করা হবে...</div>
        <h1 className="font-bold">{course.title}</h1>
        <Separator/>
        <p className="text-gray-500 text-sm">{course.description}</p>
     
      </div>
    </div>;
};

const AfterEnrolled = ({course}) => {
  return <> 
  <div className="bg-white dark:bg-zinc-900 border rounded-xl">
      <div className="flex relative justify-center items-center">
        <div
          style={{ backgroundImage: `url(${course.image})` }}
          className="h-[150px] rounded-xl overflow-hidden border md:h-[300px] w-full bg-cover bg-center"
        >
          {/* <img className="rounded-xl object-cover"  src={course.image} alt="" /> */}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <h1 className="font-bold">{course.title}</h1>
        <p className="text-gray-500 text-sm">{course.description}</p>
      </div>
    </div>
    <div className="p-2 mt-3 space-y-2">
      <div className="flex items-center gap-2 "><SiCodeblocks /> <span className="font-bold">টার্গেটস</span></div>
      <Separator/>
      <div className="grid gap-2">
        {course.modules.map((module) => {
          return <Link to={`/free/theater/${module.id}`} key={module.id} >
          <div className="bg-white dark:bg-zinc-900 border rounded-lg p-2 flex items-center gap-2 cursor-pointer">
            <div>
              <div className="h-9 w-9 border rounded-full flex justify-center items-center">
                {module.title[0]}
            </div>
            </div>
            <div className="font-bold text-sm">{module.title}</div>
          </div>
          </Link>
        })}
      </div>
    </div>
    </> ;
};
