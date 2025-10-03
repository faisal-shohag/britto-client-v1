import { useGetEnrollmentsbyCourseId, useUpdateEnrollmentStatus } from "@/hooks/course/use-enroll";
import { useParams } from "react-router";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/pages/free-exam-pages/components/Splash";

const Enrollments = () => {
  const { courseId } = useParams();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: enrollmentData, isLoading } = useGetEnrollmentsbyCourseId({
    courseId: Number(courseId),
    page,
    limit,
  });
   const enrollmentStatusUpdate = useUpdateEnrollmentStatus()

  if (isLoading) return <div>Loading...</div>;
//   console.log(enrollmentData);

  const { enrollments, total } = enrollmentData;
  const totalPages = Math.ceil(total / limit);

 
  const handleStatus = (status, enrollmentId) => {
    enrollmentStatusUpdate.mutate({enrollmentId, status})
  }

  const isStatusUpdating = enrollmentStatusUpdate.isPending



  return (
    <Card>
      <CardHeader>
          <CardTitle className="text-xl">
            Enrollments
        </CardTitle>
      </CardHeader>
        <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Phone</TableHead>
            {/* <TableHead>Email</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell>{enrollment.user.name}</TableCell>
              <TableCell>{enrollment.user.phone}</TableCell>
              {/* <TableCell>{enrollment.user.email}</TableCell> */}
              <TableCell>{enrollment.status}</TableCell>
              <TableCell className="flex gap-2">
                <Button disabled={isStatusUpdating} onClick={()=>handleStatus('APPROVED', enrollment.id)} className="bg-green-600 dark:bg-green-700 text-white" variant="outline"> {isStatusUpdating && <Spinner/>} Approve</Button>
                <Button  disabled={isStatusUpdating} onClick={()=>handleStatus('PENDING', enrollment.id)} variant="outline"> {isStatusUpdating && <Spinner/>}  Pending</Button>
                <Button  disabled={isStatusUpdating} onClick={()=>handleStatus('REJECT', enrollment.id)} variant="destructive"> {isStatusUpdating && <Spinner/>}  Reject</Button>
  
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
      <CardFooter>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => setPage(p)}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
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

export default Enrollments;