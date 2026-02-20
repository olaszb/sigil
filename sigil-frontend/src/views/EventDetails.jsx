import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import EventHero from "../components/event-details/EventHero";
import EventTab from "../components/event-details/EventTab";
import EditorRenderer from "../components/create-event/Editor/EditorRenderer";
import { useAuth } from "../contexts/AuthContext";
import { Castle, Users } from "lucide-react";
import {toast} from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import EventDescription from "../components/event-details/EventDescription";
import VenueDetails from "../components/event-details/VenueDetails";

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    useEffect(() => {
        setLoading(true);
        const fetchEvent = async () => {
            try {
                const response = await axiosClient.get(`/api/events/${slug}`);
    
                const data = response.data;
                setEvent(data.event);
                setVenue(data.venue);
            }catch (error) {
                console.error("Error fetching event details:", error);
            }finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [slug]);

    if (loading) return <div className="text-parchment">Consulting the archives...</div>;


    const handleEventDeletion = async () => {
        try{
            await axiosClient.delete(`/api/events/${event.id}`);
            toast("Ritual archived successfully!", toastConfig);
            navigate('/');
        }catch(error){
            console.error('Error archiving ritual:', error);
        }
    }

  return (
    <div className="w-full min-h-screen bg-secondary-bg text-parchment">
        <EventHero image_url={event?.image_url} />
        

        <div className="relative max-w-6xl mx-auto px-8">
            <div className="absolute left-8 right-8 -top-26.5 z-30 pointer-events-none">
                <EventTab title={event?.title} start_time={event?.start_time} venue_name={venue?.name}/>
            </div>

            <div className="pt-4 pb-20 w-[90%]">
                {user?.id === event?.organizer_id && 
                    <div className="mb-4">
                        <Link to={`/update-event/${slug}`} className="relative overflow-hidden
                                    pl-8 pr-8 py-3 bg-main-accent text-primary-bg
                                [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] 
                                tracking-[0.15em] text-[10px] font-black uppercase
                                
                                before:content-[''] before:absolute before:inset-0
                                before:bg-parchment before:translate-y-[100%]
                                before:transition-transform before:duration-400 before:ease-in-out
                                hover:before:translate-y-0 hover:text-primary-bg"
                                >
                                    <span className="relative z-10">Update Ritual</span>
                        </Link>
                        <button onClick={() => setIsModalOpen(true)} className="relative overflow-hidden
                                    pl-8 pr-8 py-3 bg-main-accent text-primary-bg
                                [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] 
                                tracking-[0.15em] text-[10px] font-black uppercase
                                
                                before:content-[''] before:absolute before:inset-0
                                before:bg-parchment before:translate-y-[100%]
                                before:transition-transform before:duration-400 before:ease-in-out
                                hover:before:translate-y-0 hover:text-primary-bg"
                                >
                                    <span className="relative z-10">Delete Ritual</span>
                        </button>
                    </div>
                }

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-4">

                    <EventDescription description={event?.description}/>
                    <VenueDetails venue={venue}/>
                  </div>
               </div>
            </div>
        </div>
        {isModalOpen && 
            <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm">
                <div className="bg-primary-bg border border-main-accent/50 p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(154,0,0,0.2)] text-center">
                    <h2 className="text-2xl font-[Cinzel] text-main-accent mb-4">Are you certain you wish to archive this ritual?</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-parchment/20 bg-main-accent hover:bg-parchment/10 transition-colors duration-300 uppercase tracking-widest text-[10px]"
                        >
                            No
                        </button>
                        <button
                            onClick={handleEventDeletion}
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
}

export default EventDetails;