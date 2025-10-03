import HomeCourseCard from "../components/HomeCourseCard";
import HomeExamCard from "../components/HomeExamCard";
import MyPackages from "../components/MyPackages";

const FreeHome = () => {
    
    return (
        <div className="space-y-5">
            <HomeExamCard/>
            <MyPackages/>

            <HomeCourseCard/>
        </div>
    );
};

export default FreeHome;