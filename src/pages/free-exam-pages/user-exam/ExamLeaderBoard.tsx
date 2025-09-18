import { FreeUserContext } from "@/context/FreeUser.context";
import { use } from "react";
import { useParams } from "react-router";

import { Leaderboard } from "./leaderboard";

const ExamLeaderBoard = () => {
    const {id: examId} = useParams() as any
    const {user} = use(FreeUserContext) as any
    return (
        <div>
         <Leaderboard examId={examId} userId={user.id} showUserRank={true}/> 
        </div>
    );
};

export default ExamLeaderBoard;