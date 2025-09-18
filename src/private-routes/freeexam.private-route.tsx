import { FreeUserContext } from "@/context/FreeUser.context";
import Splash from "@/pages/free-exam-pages/components/Splash";
import { use } from "react";
import { Navigate } from "react-router";

const FreeExamPrivateRoute = ({ children }) => {
  const { user, loading } = use(FreeUserContext) as any;

  if (loading) {
    return <Splash/>;
  }

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to="/free/login"></Navigate>
    );
  }

  return children;
};

export default FreeExamPrivateRoute;
