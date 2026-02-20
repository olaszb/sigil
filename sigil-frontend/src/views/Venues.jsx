import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import Venue from "../components/venues/Venue";
import { useAuth } from "../contexts/AuthContext";
import EventHero from "../components/event-details/EventHero";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

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
    <div className="w-full">
      <div className="grayscale">
        <EventHero image_url={"/public/register_bg.webp"}/>
      </div>

      <div className="text-center">
        <h1 className="text-4xl text-parchment font-[Cinzel] my-8">
          Ritual Sites
        </h1>
      </div>
      
      <div className="px-4 space-y-4">
        {venues.map((venue) => (
          <Venue key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
};

export default Venues;
