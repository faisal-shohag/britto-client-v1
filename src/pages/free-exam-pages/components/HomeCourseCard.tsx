import { Button } from "@/components/ui/button";
import { useGetCourses } from "@/hooks/course/use-course";
import { Link } from "react-router";

const HomeCourseCard = () => {
  const { data: course, isLoading } = useGetCourses({ page: 1, limit: 10 });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const { courses } = course;

  return (
    <div>
      <h1 className="font-bold">Preparations</h1>
      <div className="grid md:grid-cols-4 gap-3 grid-cols-2">
        {courses.map((course) => {
          return <CourseCard key={course.id} course={course} />;
        })}
      </div>
    </div>
  );
};

export default HomeCourseCard;

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl flex flex-col justify-center items-center text-center p-1 border gap-2 relative">
      <div className="">
        <img className=" rounded-xl object-cover" src={course.image} />
      </div>
      <div className="px-1 pb-2 space-y-2 absolute text-white">
        <div className="font-bold">{course.title}</div>
        <Link to={`preparation/${course.id}`}>
           <Button className="bg-gradient-to-b text-white from-pink-500 to-red-600" size={'sm'}>শুরু করো</Button>
           </Link>
      </div>
   
    </div>
  );
};
