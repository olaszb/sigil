import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import Venue from "../components/venues/Venue";
import EventHero from "../components/event-details/EventHero";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";

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
            <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm">
                <div className="bg-primary-bg border border-main-accent/50 p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(154,0,0,0.2)] text-center">
                    <h2 className="text-2xl font-[Cinzel] text-main-accent mb-4">Are you certain you wish to delete this venue?</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-parchment/20 bg-main-accent hover:bg-parchment/10 transition-colors duration-300 uppercase tracking-widest text-[10px]"
                        >
                            No
                        </button>
                        <button
                            onClick={() => handleVenueDeletion(selectedVenueId)}
                            className="flex-1 px-4 py-2 border border-parchment/20 bg-main-accent hover:bg-parchment/10 transition-colors duration-300 uppercase tracking-widest text-[10px]"
                        >
                            Yes
                        </button>
                    </div>
                </div> 
            </div>
        }
    </div>
  );
};

export default Venues;
