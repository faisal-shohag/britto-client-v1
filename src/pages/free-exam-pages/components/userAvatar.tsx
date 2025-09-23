import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "react-router";

const UserAvatar = ({ name, college, logout, role }) => {
  const { setTheme } = useTheme();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage/>
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-red-500 text-white border-2">{name[0]}</AvatarFallback>
            </Avatar>

            <div className=" text-left">
              <h2 className="text-sm font-semibold">{name}</h2>
              <div title={college} className="text-xs line-clamp-1 w-[120px]">
                {college}
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
        <Link to={'profile'}>  <DropdownMenuItem>Profile</DropdownMenuItem></Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
        {
          role === "ADMIN" &&
          <>
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to={"admin/packages"}>
            <DropdownMenuItem>Packages</DropdownMenuItem>
          </Link>
            <Link to={"admin/exams"}>
            <DropdownMenuItem>Exams</DropdownMenuItem>
          </Link>
           <Link to={"admin/add-user"}>
            <DropdownMenuItem>Add user</DropdownMenuItem>
          </Link>
          <Link to={"admin/all-user"}>
            <DropdownMenuItem>All user</DropdownMenuItem>
          </Link>
             <Link to={"admin/add-bulk-questions"}>
            <DropdownMenuItem>Add bulk Q</DropdownMenuItem>
          </Link>
          </>
        }

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-500">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatar;
