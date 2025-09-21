import { GoHome, GoHomeFill } from "react-icons/go";
import { TbTarget, TbTargetArrow } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaCalendarDays,    } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router";

const BottomNavigationBar = () => {
  const location = useLocation();

  const baseClasses = "flex flex-col justify-center items-center gap-1 px-3 py-1";
  const activeClasses = "text-red-500 font-semibold"; // Active Highlight
  const inactiveClasses = "text-gray-600 dark:text-gray-400"; // Inactive

  const navData = [
    { path: "/free", title: "Home", icon: GoHome, activeIcon: GoHomeFill },
    { path: "rank", title: "Rank", icon: TbTarget, activeIcon: TbTargetArrow },
    { path: "routine", title: "Routine", icon: FaRegCalendarAlt, activeIcon: FaCalendarDays },
    // { path: "profile", title: "Profile", icon: FaRegCircleUser, activeIcon: FaCircleUser  },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-between items-center px-5 bg-white dark:bg-zinc-800 py-2 text-xs text-center border-t shadow-md">
      {navData.map(({ path, title, icon: Icon, activeIcon: ActiveIcon }) => {
        const isActive = location.pathname.includes(path); // exact path match
        return (
          <NavLink
            key={path}
            to={path}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            {isActive ? <ActiveIcon size={20} /> : <Icon size={20} />}
            <div>{title}</div>
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomNavigationBar;
