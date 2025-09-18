import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
const AuthLayout = () => {
    return (
        <div>
           <Outlet/>
           <Toaster/>
        </div>
    );
};

export default AuthLayout;