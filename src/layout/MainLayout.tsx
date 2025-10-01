import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div className="max-w-7xl mx-auto px-2">
            <Outlet/>
        </div>
    );
};

export default MainLayout;