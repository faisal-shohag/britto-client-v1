import { Toaster } from "@/components/ui/sonner";
import BottomNavigationBar from "@/pages/free-exam-pages/components/BottomNavigationBar";

import NavBar from "@/pages/free-exam-pages/components/NavBar";
import { Outlet, useLocation } from "react-router";

const FreeExamLayout = () => {
  const location = useLocation();
  return (
    <div>
      <div className="max-w-7xl mx-auto px-1">
        {location.pathname.includes("playground") ? null : <NavBar />}
        <div className="pt-2 pb-[100px]">
          <Outlet />
        </div>
          {location.pathname.includes("playground") ? null : (
        <BottomNavigationBar />
      )}
      </div>
      <Toaster />

    
    </div>
  );
};

export default FreeExamLayout;
