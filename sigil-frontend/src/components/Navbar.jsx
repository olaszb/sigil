import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut,
} from "lucide-react";
import { createContext, useContext, useState } from "react";
import GlitchSigil from "../util/icons/logo/GlitchSigil";
import XSVG from "../util/icons/XSVG";
import MenuSVG from "../util/icons/MenuSVG";
import SigilButton from "./SigilButton";
import { getImageUrl } from "../util/helper";

const NavbarContext = createContext();
const Navbar = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setExpanded(false)}
        />
      )}

      <aside className={`fixed md:relative top-0 left-0 z-50 transition-all duration-300 ${expanded ? "w-64" : "w-0 md:w-16"}`}>
        <nav className={`fixed h-full flex flex-col bg-primary-bg text-parchment border-r shadow-sm 
          transition-all duration-500 ease-in-out
          ${expanded ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"}`}
        >
          <div className={`
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
                <div className="absolute left-full rounded-md px-2 py-1 mt-2 ml-5 bg-main-accent text-parchment text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-99">
                  Menu
                </div>
              )}
            </div>
          </div>

          <NavbarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </NavbarContext.Provider>

          <div className="border-t flex p-3 border-parchment bg-black/20">
            {user ? (
              <>
                <Link to="/profile">
                  <img
                    src={user.image_url ? getImageUrl(user.image_url) : '/default_avatar.jpg'}
                    alt="User Avatar"
                    className="w-12 h-10 rounded-full object-cover"
                  />
                </Link>
                <div
                  className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "ml-3 w-52 opacity-100" : "w-0 opacity-0"}`}
                >
                  <Link to="/profile">
                    <div className="leading-4">
                      <h4 className="font-semibold font-[Montserrat]">
                        {user.name}
                      </h4>
                      <span className="text-xs text-gray-600 font-[Montserrat]">
                        {user.email}
                      </span>
                    </div>
                  </Link>

                  <button onClick={handleLogout} className="ml-2">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className={`
                  flex items-center overflow-hidden transition-all duration-500 ease-in-out
                  ${expanded ? "max-w-[500px] opacity-100" : "max-w-0 opacity-0"}
              `}>
                <SigilButton type="button" text={"Login"} onClick={() => navigate('/login')}/>
                <SigilButton type="button" text={"Register"} onClick={() => navigate('/register')}/>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {!expanded && (
        <button 
          onClick={() => setExpanded(true)}
          className="md:hidden fixed top-4 left-4 z-[60] 
               w-12 h-12 flex items-center justify-center 
               bg-primary-bg border border-parchment/20 rounded-md 
               text-parchment shadow-[0_0_15px_rgba(0,0,0,0.5)]
               active:scale-95 transition-transform"
        >
          <div className="flex justify-center items-center">
            <MenuSVG />
          </div>
        </button>
      )}
    </>
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
          <div className="hidden md:block absolute left-full whitespace-nowrap rounded-md px-2 py-1 ml-6 bg-main-accent text-parchment text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-99">
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
