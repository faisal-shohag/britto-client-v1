
import { use } from "react";
import HomeExamCard from "../components/HomeExamCard";
import MyPackages from "../components/MyPackages";
import { FreeUserContext } from "@/context/FreeUser.context";

const FreeHome = () => {
    const {user} = use(FreeUserContext) as any
    
    return (
        <div className="space-y-5">
            <HomeExamCard/>
            <MyPackages userId={user.id}/>
      
        </div>
    );
};

export default FreeHome;