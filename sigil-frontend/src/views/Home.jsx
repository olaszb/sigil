import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
    const {logout} = useAuth();

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
      <button onClick={handleLogout} className="border rounded-md p-2 hover:bg-gray-400">Logout</button>
    </div>
  );
};

export default HomePage;