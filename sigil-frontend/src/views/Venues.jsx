import { useCallback, useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import Venue from "../components/venues/Venue";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import SigilModal from "../components/SigilModal";
import { LoaderCircle, Sparkles } from "lucide-react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import SigilHero from "../components/SigilHero";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 1,
  });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVenues = useCallback(async (page = 1) => {
    setLoading(true);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      try {
        const endpoint = "/api/venues";
        const [response] = await Promise.all([
            axiosClient.get(`${endpoint}?page=${page}`),
            delay(1000) // 2 seconds of forced loading
        ]);
        setVenues(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        });
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
      }finally{
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

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

  if (loading) return <LoadingScreen />;

  return (
    <div className="w-full">
      <div className="grayscale mb-10">
        <SigilHero image_url={"/register_bg.webp"} title={"Ritual Sites"} />
      </div>
      
      <div className="px-4 space-y-4 mb-10">
        {venues.map((venue) => (
          <Venue key={venue.id} venue={venue} onDeleteClick={onDeleteClick} />
        ))}
      </div>

      <div className="fixed bottom-10 right-10 z-50">
        <Link to="/add-venue">
          <button className="group relative flex items-center justify-center w-14 h-14 bg-primary-bg border border-main-accent rounded-full shadow-[0_0_15px_rgba(154,0,0,0.4)] hover:scale-110 transition-all duration-300">
            <Sparkles className="text-main-accent group-hover:rotate-12 transition-transform" />
            <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-main-accent text-[8px] uppercase tracking-widest px-3 py-1 whitespace-nowrap border border-main-accent/20">
              Register New Site
            </span>
          </button>
        </Link>
      </div>

      {pagination.last_page > 1 && (
            <Pagination pagination={pagination} getEvents={fetchVenues} />
        )}

      {isModalOpen &&
            <SigilModal closeModal={() => setIsModalOpen(false)} onAction={() => handleVenueDeletion(selectedVenueId)} text={"Are you certain you wish to delete this venue?"} />
        }
    </div>
  );
};

export default Venues;
