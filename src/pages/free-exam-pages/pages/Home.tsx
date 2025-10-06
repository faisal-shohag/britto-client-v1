import useFreeUser from "@/hooks/free-exam-hooks/use-free-user";
import HomeCourseCard from "../components/HomeCourseCard";
import HomeExamCard from "../components/HomeExamCard";
import MyPackages from "../components/MyPackages";

const FreeHome = () => {
    const user = useFreeUser()
    
    return (
        <div className="space-y-5">
            <HomeExamCard/>
            <MyPackages/>

           {user.role === "ADMIN" && <HomeCourseCard/>}
        </div>
    );
};

export default FreeHome;