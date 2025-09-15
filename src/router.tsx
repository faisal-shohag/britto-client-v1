import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import FreeExamLayout from "./layout/FreeExamLayout";
import Exams from "./pages/free-exam-pages/pages/Exams";
import Home from "./pages/home/Home";

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
    element: <FreeExamLayout />,
    children: [
      {
        path: "/free",
        Component: Exams,
      },
    ],
  },
]);
