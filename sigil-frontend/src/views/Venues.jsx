import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import Venue from "../components/venues/Venue";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  if(user.role !== 'admin'){
    navigate('/');
  }

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axiosClient.get("/api/venues");
        setVenues(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
      }
    };
    fetchVenues();
  }, []);

  return (
    <div>
      <div className="text-center w-full">
          <h1 className="text-4xl text-main-accent font-[Cinzel] my-8">
            Ritual Sites
          </h1>
      </div>
        {venues.map((venue) => (
            <Venue key={venue.id} venue={venue}/>
        ))}
    </div>
  );
};

export default Venues;
