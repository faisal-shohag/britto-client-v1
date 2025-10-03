import { useGetCourses } from "@/hooks/course/use-course";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const AllCourses = () => {
  const [page, setPage] = useState(1);
  const { data: courseData, isLoading } = useGetCourses({ page, limit: 10 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // console.log(courseData);

  const { courses, totalPages } = courseData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => (
              <div key={course.id} className="flex  flex-row bg-white dark:bg-zinc-900 border p-3 items-center gap-2 rounded-md">
                <div>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-auto rounded-md"
                  />
                </div>
                <div>
                  <CardTitle className="text-sm">{course.title}</CardTitle>
                  <CardDescription  className="space-y-2 mt-1">
                 <div className="text-xs">   Enrolled: {course._count.enrollments} | Modules: {course._count.modules}</div>

                     <div className="flex gap-1">
                       <Link to={`/free/admin/enrollments/${course.id}`} ><Button size={'sm'}>Enrollments</Button>
                      </Link>
                      <Link to={`/free/admin/modules/${course.id}`} ><Button size={'sm'}>Modules</Button>
                      </Link>
                     </div>
                  </CardDescription>
                </div>
              </div>
    
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={p === page}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AllCourses;
