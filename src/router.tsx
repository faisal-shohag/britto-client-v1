import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import FreeExamLayout from "./layout/FreeExamLayout";
import Home from "./pages/home/Home";
import Playground from "./pages/free-exam-pages/pages/Playground";
import AddUser from "./pages/free-exam-pages/pages/AddUser";
import AllUsers from "./pages/free-exam-pages/pages/AllUsers";
import Login from "./pages/free-exam-pages/pages/Login";
import FreeExamPrivateRoute from "./private-routes/freeexam.private-route";
import { FreeUserProvider } from "./provider/free-user.provider";
import FreeHome from "./pages/free-exam-pages/pages/Home";
import FreeExamAdminPrivateRoute from "./private-routes/freeexam-admin.private";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import Packages from "./pages/free-exam-pages/admin/packages/Packages";
import Exams from "./pages/free-exam-pages/admin/exams/Exams";
import PackageExamsPage from "./pages/free-exam-pages/admin/exams/ExamByPackageId";
import QuestionByExam from "./pages/free-exam-pages/admin/questions/QuestionByExam";
import ExamLeaderBoard from "./pages/free-exam-pages/user-exam/ExamLeaderBoard";
import ExamAnswerSheet from "./pages/free-exam-pages/user-exam/ExamAnswerSheet";
import ExamDetails from "./pages/free-exam-pages/user-exam/ExamDetails";
import Rank from "./pages/free-exam-pages/pages/Rank";
import Routine from "./pages/free-exam-pages/pages/Routine";
import Profile from "./pages/free-exam-pages/pages/Profile"
import Register from "./pages/free-exam-pages/pages/Register";
import BulkQuestionUploader from "./pages/free-exam-pages/admin/questions/AddBulkQuestion";
import BrittoAsk from "./pages/free-exam-pages/pages/BrittoAsk";
import Privacy from "./pages/privacy/privacy";
import PackageDetails from "./pages/free-exam-pages/pages/PackageDetails";
import CourseDetails from "./pages/free-exam-pages/pages/course/CourseDetails";
import AllCourses from "./pages/free-exam-pages/admin/course/course/AllCourses";
import Enrollments from "./pages/free-exam-pages/admin/course/course/Enrollments";
import Modules from "./pages/free-exam-pages/admin/course/module/Modules";
import Contents from "./pages/free-exam-pages/admin/course/content/Contents";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/privacy',
        Component: Privacy
      }
    ],
  },

  {
    path: "/free",
    element: (
      <QueryClientProvider client={queryClient}>
        <FreeUserProvider>
          <FreeExamLayout />
        </FreeUserProvider>
      </QueryClientProvider>
    ),
    children: [
      {
        path: "",
        element: (
          <FreeExamPrivateRoute>
            <FreeHome />
          </FreeExamPrivateRoute>
        ),
      },
      {
        path: "login",
        Component: Login,
      },
       {
        path: "register",
        Component: Register,
      },
      {
        path:'preparation/:courseId',
        element:  <FreeExamPrivateRoute>
          <CourseDetails/>
        </FreeExamPrivateRoute>
      },
         {
        path: "exam/:id",
        element: (
          <FreeExamPrivateRoute>
            <ExamDetails />
          </FreeExamPrivateRoute>
        ),
      },
        {
        path: "package/:id",
        element: (
          <FreeExamPrivateRoute>
            <PackageDetails />
          </FreeExamPrivateRoute>
        ),
      },
      {
        path: "playground/:id",
        element: (
          <FreeExamPrivateRoute>
            <Playground />
          </FreeExamPrivateRoute>
        ),
      },
      {
        path: "leaderboard/exam/:id",
        element: (
          <FreeExamPrivateRoute>
            <ExamLeaderBoard />
          </FreeExamPrivateRoute>
        ),
      },
           {
        path: "ask",
        element: (
          <FreeExamPrivateRoute>
            <BrittoAsk />
          </FreeExamPrivateRoute>
        ),
      },
         {
        path: "rank",
        element: (
          <FreeExamPrivateRoute>
            <Rank />
          </FreeExamPrivateRoute>
        ),
      },
            {
        path: "routine",
        element: (
          <FreeExamPrivateRoute>
            <Routine />
          </FreeExamPrivateRoute>
        ),
      },
           {
        path: "profile",
        element: (
          <FreeExamPrivateRoute>
            <Profile />
          </FreeExamPrivateRoute>
        ),
      },
       {
        path: "answersheet/exam/:id",
        element: (
          <FreeExamPrivateRoute>
            <ExamAnswerSheet isUser={false}/>
          </FreeExamPrivateRoute>
        ),
      },
       {
        path: "user-answersheet/:userId/exam/:id",
        element: (
          <FreeExamPrivateRoute>
            <ExamAnswerSheet isUser={true}/>
          </FreeExamPrivateRoute>
        ),
      },
      {
        path: "admin/packages",
        element: (
          <FreeExamAdminPrivateRoute>
            <Packages />
          </FreeExamAdminPrivateRoute>
        ),
      },
          {
        path: "admin/examsbypackage/:id",
        element: (
          <FreeExamAdminPrivateRoute>
            <PackageExamsPage />
          </FreeExamAdminPrivateRoute>
        ),
      },
        {
        path: "admin/exams",
        element: (
          <FreeExamAdminPrivateRoute>
            <Exams />
          </FreeExamAdminPrivateRoute>
        ),
      },
          {
        path: "admin/questionbyexam/:id",
        element: (
          <FreeExamAdminPrivateRoute>
            <QuestionByExam />
          </FreeExamAdminPrivateRoute>
        ),
      },
            {
        path: "admin/add-bulk-questions",
        element: (
          <FreeExamAdminPrivateRoute>
            <BulkQuestionUploader />
          </FreeExamAdminPrivateRoute>
        ),
      },
      {
        path: "admin/add-user",
        element: (
          <FreeExamAdminPrivateRoute>
            <AddUser />
          </FreeExamAdminPrivateRoute>
        ),
      },
      {
        path: "admin/all-user",
        element: (
          <FreeExamAdminPrivateRoute>
            <AllUsers />
          </FreeExamAdminPrivateRoute>
        ),
      },
      {
        path: "admin/courses",
        element: (
          <FreeExamAdminPrivateRoute>
            <AllCourses />
          </FreeExamAdminPrivateRoute>
        ),
      },
          {
        path: "admin/enrollments/:courseId",
        element: (
          <FreeExamAdminPrivateRoute>
            <Enrollments />
          </FreeExamAdminPrivateRoute>
        ),
      },
          {
        path: "admin/modules/:courseId",
        element: (
          <FreeExamAdminPrivateRoute>
            <Modules />
          </FreeExamAdminPrivateRoute>
        ),
      },
          {
        path: "admin/modules/:courseId",
        element: (
          <FreeExamAdminPrivateRoute>
            <Modules />
          </FreeExamAdminPrivateRoute>
        ),
      },    {
        path: "admin/contents/:moduleId",
        element: (
          <FreeExamAdminPrivateRoute>
            <Contents />
          </FreeExamAdminPrivateRoute>
        ),
      }
    ],
  },
]);
