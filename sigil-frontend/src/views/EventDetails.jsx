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
                    <section>
                        <div className="flex items-center gap-4">
                            <h2 className="text-main-accent font-[Cinzel] text-xl">
                                Details
                            </h2>
                            <div className="h-[1px] w-full bg-gradient-to-r from-parchment/20 to-transparent"/>
                        </div>
                        <div className="relative p-6 bg-black/20 border-l-2 border-main-accent/30">
                            {event?.description ? (
                                <EditorRenderer jsonContent={event.description} />
                                ) : (
                                <p className="italic opacity-30">The records for this ritual are blank...</p>
                            )}
                        </div>

                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-parchment/10 bg-black/40">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-main-accent">
                                <Castle size={18} />
                                <h3 className="font-bold font-[Cinzel] text-lg uppercase tracking-wider">Site of Ritual:</h3>
                            </div>

                            <div className="font-[Montserrat] text-parchment/80 space-y-1 pl-7">
                                <p className="text-xl font-medium text-parchment">{venue?.name}</p>
                                <p className="text-sm italic">{venue?.country}</p>
                                <p className="text-sm opacity-60">{venue?.city}, {venue?.address}</p>
                                <p className="text-[10px] tracking-tighter opacity-40 uppercase">
                                    Portal Code: {venue?.postal_code}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-main-accent mb-4">
                                    <Users size={18} />
                                    <h3 className="font-bold font-[Cinzel] text-lg uppercase tracking-wider">Capacity</h3>
                                </div>
                                <div className="pl-7">
                                    <span className="text-4xl font-[Cinzel] text-parchment/90">{venue?.capacity}</span>
                                    <span className="ml-2 text-[10px] uppercase tracking-widest text-parchment/40 font-mono">
                                        Acolytes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
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