import { use } from "react";
import { RecentExams } from "../admin/exams/RecentExams";
import { FreeUserContext } from "@/context/FreeUser.context";

const HomeMyExamsCard = () => {
    const {user} = use(FreeUserContext) as any
    return (
        <div>
            <RecentExams packageId={1} userId={user.id} />
        </div>
    );
};

export default HomeMyExamsCard;