
import { FreeUserContext } from "@/context/FreeUser.context";
import { use } from "react";
import UserAvatar from "./userAvatar";

const NavBar = () => {
    const {user, logout} = use(FreeUserContext) as any
  
    return (
        
        <div className="flex justify-between shadow-xl px-2 rounded-full mt-1  dark:bg-dark-red items-center bg-white dark:bg-zinc-800">
               {user && <div className="flex  items-center gap-3">

                <div> <UserAvatar name={user.name} logout={logout} gender={user.gender} college={user.college} role={user.role}/></div>
            </div>}

            <div className="flex gap-1 items-center"><img className="h-12" src="https://i.postimg.cc/TYpCjqyD/image.png"/>
            <h1 className="text-lg font-semibold hidden md:block">Britto Edu.</h1>
            {!user && <h1 className="text-lg font-semibold md:hidden block">Britto Edu.</h1>}
            </div>

         
        </div>
    );
};

export default NavBar;