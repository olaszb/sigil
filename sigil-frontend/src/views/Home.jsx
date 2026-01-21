import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
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
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
        {user 
        ? 
            (<button onClick={handleLogout} className="border rounded-md p-2 hover:bg-gray-400">Logout</button>)
        :
            (<button onClick={() => navigate('/login')} className="border rounded-md p-2 hover:bg-gray-400">Log in</button>)
        }
    </div>
  );
};

export default HomePage;