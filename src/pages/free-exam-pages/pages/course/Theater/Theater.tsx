import { useGetContentByModuleId } from "@/hooks/course/use-content";
import { Spinner } from "@/pages/free-exam-pages/components/Splash";
import { useParams } from "react-router";

const Theater = () => {
     const { moduleId } = useParams();
  const { data: contentData, isLoading } = useGetContentByModuleId(
    Number(moduleId)
  );

  if(isLoading) return <Spinner/>

  console.log(contentData)

    return (
        <div>
            Theatar
            
        </div>
    );
};

export default Theater;