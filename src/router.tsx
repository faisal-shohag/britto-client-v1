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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
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
        path: "/free",
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
        path: "exam/:id",
        element: (
          <FreeExamPrivateRoute>
            <ExamDetails />
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
        path: "answersheet/exam/:id",
        element: (
          <FreeExamPrivateRoute>
            <ExamAnswerSheet />
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
    ],
  },
]);
