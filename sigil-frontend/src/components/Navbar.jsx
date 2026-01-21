import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GlitchSigil from "../util/GlitchSigil";


const Navbar = () => {
    const {logout, user} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("User logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-primary-bg text-parchment">
            <div>
                <GlitchSigil />
            </div>

            <div>
                {user 
                ? 
                    (<button onClick={handleLogout} className="border border-iron bg-main-accent hover:bg-hover-state text-white px-2 py-1 rounded-lg">Logout</button>)
                :
                    (<button onClick={() => navigate('/login')} className="border rounded-md p-2 hover:bg-gray-400">Log in</button>)
                }
            </div>

        </nav>
    );
};

export default Navbar;