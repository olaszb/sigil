import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import Venue from "../components/venues/Venue";
import EventHero from "../components/event-details/EventHero";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import SigilModal from "../components/SigilModal";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const navigate = useNavigate();


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

  const handleVenueDeletion = async (venueId) => {
    try{
        await axiosClient.delete(`/api/venues/${venueId}`);
        toast("Venue deleted successfully!", toastConfig);
        setVenues(prev => prev.filter(v => v.id !== venueId));
        setIsModalOpen(false);
    }catch(error){
        console.error('Error deleting venue:', error);
    }
  }

  const onDeleteClick = (venueId) => {
    setIsModalOpen(true);
    setSelectedVenueId(venueId);
  }

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
          <Venue key={venue.id} venue={venue} onDeleteClick={onDeleteClick} />
        ))}
      </div>
      {isModalOpen &&
            <SigilModal closeModal={() => setIsModalOpen(false)} onAction={() => handleVenueDeletion(selectedVenueId)} text={"Are you certain you wish to delete this venue?"} />
        }
    </div>
  );
};

export default Venues;
