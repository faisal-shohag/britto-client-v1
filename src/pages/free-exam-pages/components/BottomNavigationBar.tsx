import { GoHome } from "react-icons/go";
import { TbTargetArrow } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { NavLink } from "react-router";

const BottomNavigationBar = () => {
  const baseClasses =
    "flex flex-col justify-center items-center gap-1 px-3 py-1";
  const activeClasses = "text-red-500 font-semibold"; // Active Highlight
  const inactiveClasses = "text-gray-600"; // Inactive

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-between items-center px-5 bg-white py-2 text-xs text-center border-t shadow-md">
      <NavLink
        to=""
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <GoHome size={20} />
        <div>Home</div>
      </NavLink>

      <NavLink
        to="rank"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <TbTargetArrow size={20} />
        <div>Rank</div>
      </NavLink>

      <NavLink
        to="routine"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <FaRegCalendarAlt size={20} />
        <div>Routine</div>
      </NavLink>
    </div>
  );
};

export default BottomNavigationBar;
