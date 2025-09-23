import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useFreeUser, {
  useUserStates,
} from "@/hooks/free-exam-hooks/use-free-user";
import { FaRegUserCircle } from "react-icons/fa";
import { TbMilitaryRankFilled } from "react-icons/tb";

import { FaHammer } from "react-icons/fa6";
import { bnNumber } from "@/lib/bnNumbers";
import { AiFillEdit } from "react-icons/ai";
import { Spinner } from "../components/Splash";
import { UserStatesPieChart } from "@/components/charts/pie";
import { RxDotFilled } from "react-icons/rx";

const Profile = () => {
  const user = useFreeUser();
  const { data: stats, isLoading } = useUserStates(user.id) as any;
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-18 w-18">
            <AvatarImage className="h-18 w-18" src={user.picture}></AvatarImage>
            <AvatarFallback className="h-18 w-18">
              <FaRegUserCircle
                className="text-zinc-600 dark:text-zinc-400"
                size={50}
              />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {user.college}
          </p>
          <Badge className="border-red-500 rounded-full bg-red-500/25 text-red-600">
            {user.role === "ADMIN" ? user.role : user.group}
          </Badge>
        </CardHeader>
        <Separator />
        <CardContent>
          { isLoading ? <Spinner/> : <div className="flex justify-between">
            <div className="flex items-center gap-1 border px-2 py-1 rounded-xl">
              <div className="text-red-500">
                <TbMilitaryRankFilled size={30} />
              </div>
              <div>
                <div className="font-bold">{stats.rank ? bnNumber(stats.rank) : '...'}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  র‍্যাঙ্ক
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 border px-2 py-1 rounded-xl">
              <div className="text-cyan-700">
                <FaHammer size={30} />
              </div>
              <div className="">
                <div className="font-bold">{bnNumber(stats.totalMarks)}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  মোট মার্কস
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 border px-2 py-1 rounded-xl">
              <div className="text-pink-500">
                <AiFillEdit size={30} />
              </div>
              <div className="leading-4">
                <div className="font-bold">
                  {bnNumber(stats.totalExamsCompleted)}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  মোট এক্সাম
                </div>
              </div>
            </div>
          </div>}
        </CardContent>
        <Separator />
        <CardContent>
            {!isLoading && <div className="flex justify-between items-center">
         <div className="h-[200px] w-[180px]">
                   <UserStatesPieChart data={stats}/>
         </div>
                <div className="space-y-2">
                    <p className="flex items-center text-sm">
                        <span className="text-cyan-600"><RxDotFilled size={20}/></span>
                        <span>মোট সঠিক উত্তর: <span className="font-bold">{bnNumber(stats.totalCorrectAnswers)}</span>টি</span>
                    </p>
                    <p className="flex items-center text-sm">
                        <span className="text-red-500"><RxDotFilled size={20}/></span>
                        <span>মোট ভুল উত্তর: <span className="font-bold">{bnNumber(stats.totalWrongAnswers)}</span>টি</span>
                    </p>
                   <p className="flex items-center text-sm">
                        <span className="text-cyan-600"><RxDotFilled size={20}/></span>
                        <span>মোট  অনুত্তর: <span className="font-bold">{bnNumber(stats.totalUnanswered)}</span>টি</span>
                    </p>
                  
                </div>
            </div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
