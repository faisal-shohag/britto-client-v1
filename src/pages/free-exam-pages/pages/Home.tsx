
// import { use } from "react";
import HomeExamCard from "../components/HomeExamCard";
import HomeMyExamsCard from "../components/HomeMyExamsCard";
// import MyPackages from "../components/MyPackages";
// import { FreeUserContext } from "@/context/FreeUser.context";

const FreeHome = () => {
    // const {user} = use(FreeUserContext) as any
    
    return (
        <div className="space-y-5">
            <HomeExamCard/>

            <HomeMyExamsCard/>

        </div>
    );
};

export default FreeHome;