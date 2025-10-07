import { Toaster } from "@/components/ui/sonner";
import BottomNavigationBar from "@/pages/free-exam-pages/components/BottomNavigationBar";

import NavBar from "@/pages/free-exam-pages/components/NavBar";
import { Outlet, useLocation } from "react-router";

const FreeExamLayout = () => {
  const location = useLocation();
  const paths = ['rank', 'ask', 'profile']
  const navHidePaths = ['login', 'register', 'quiz', 'playground']
  return (
    <div>
      <div className="max-w-7xl mx-auto px-1">
        {navHidePaths.includes(location.pathname.split('/')[2]) ? null : <NavBar />}
        {/* {location.pathname.includes("playground") ? null : <NavBar />} */}
        <div className="pt-2 pb-[100px]">
          <Outlet />
        </div>
        {(location.pathname.split('/').length === 2 && location.pathname.split('/')[1] === "free") && <BottomNavigationBar />}
      {paths.includes(location.pathname.split('/')[2]) ? <BottomNavigationBar />:''}
      </div>
      <Toaster />

    
    </div>
  );
};

export default FreeExamLayout;
