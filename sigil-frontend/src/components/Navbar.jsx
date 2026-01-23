import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ChevronFirst,
  ChevronLast,
  LogOut,
  MoreVertical,
  MoreVerticalIcon,
} from "lucide-react";
import { createContext, useContext, useState } from "react";
import GlitchSigil from "../util/icons/logo/GlitchSigil";
import XSVG from "../util/icons/XSVG";
import MenuSVG from "../util/icons/MenuSVG";

const NavbarContext = createContext();
const Navbar = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-primary-bg text-parchment border-r shadow-sm 
        ${expanded ? "w-64" : "w-16"} transition-all`}
      >
        <div
          className={`
            flex items-center h-20 my-2 pb-2 transition-all
            ${expanded ? "justify-between px-3" : "justify-center"}
        `}
        >
          <div
            className={`overflow-hidden transition-all overflow-hidden  ${expanded ? "w-32 pl-3" : "w-0"}`}
          >
            <GlitchSigil expanded={expanded} />
          </div>
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="rounded-lg w-10 h-10 flex items-center justify-center text-parchment hover:text-main-accent transition-colors"
            >
              {expanded ? <XSVG /> : <MenuSVG />}
            </button>
            {!expanded && (
              <div className="absolute left-full rounded-md px-2 py-1 mt-2 ml-5 bg-main-accent text-parchment text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                Menu
              </div>
            )}
          </div>
        </div>

        <NavbarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </NavbarContext.Provider>

        <div className="border-t flex p-3">
          {user ? (
            <>
              <img
                src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                alt="User Avatar"
                className="w-10 h-10 rounded-md"
              />
              <div
                className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "ml-3 w-52" : "w-0"}`}
              >
                <div className="leading-4">
                  <h4 className="font-semibold font-[Montserrat]">
                    {user.name}
                  </h4>
                  <span className="text-xs text-gray-600 font-[Montserrat]">
                    {user.email}
                  </span>
                </div>
                <button onClick={handleLogout} className="ml-2">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Navbar;

export function NavbarItem({ icon, text, active, alert, to }) {
  const { expanded } = useContext(NavbarContext);
  return (
    <Link to={to}>
      <li
        className={`relative flex items-center py-1 px-3 my-1
            font-medium rounded-md cursor-pointer transition-colors group
            ${
              active
                ? "bg-gradient-totr from-indigo-200 to-indigo-100 text-indigo-800"
                : "hover:bg-secondary-bg text-gray-600"
            }
            ${!expanded ? "justify-center px-0" : ""}`}
      >
        <div className="flex items-center justify-center w-10 h-10 shrink-0">
          {icon}
        </div>

        <span
          className={`overflow-hidden transition-all text-parchment font-['Cinzel'] font-normal ${expanded ? "w-52 ml-3" : "w-0"}`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
          />
        )}

        {!expanded && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-main-accent text-parchment text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
