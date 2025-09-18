import { Toaster } from "@/components/ui/sonner";

import NavBar from "@/pages/free-exam-pages/components/NavBar";
import { Outlet } from "react-router";

const FreeExamLayout = () => {

  return (
    <div>
    
      <div className="max-w-7xl mx-auto px-1">
          <NavBar/>
    <div className="mt-3"><Outlet /></div>
      </div>
      <Toaster/>
    </div>
  );
};

export default FreeExamLayout;

