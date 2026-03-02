import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import EventHero from "../components/event-details/EventHero";
import EventTab from "../components/event-details/EventTab";
import EditorRenderer from "../components/create-event/Editor/EditorRenderer";
import { useAuth } from "../contexts/AuthContext";
import { Castle, CircleCheck, Star, Users } from "lucide-react";
import {toast} from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import EventDescription from "../components/event-details/EventDescription";
import VenueDetails from "../components/event-details/VenueDetails";
import SigilButton from "../components/SigilButton";
import SigilModal from "../components/SigilModal";

const EventDetails = ({ mode }) => {
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState({isOpen: false, event:null, mode:null})
    const [activeStatus, setActiveStatus] = useState(null);

    const openModal = (event, mode) => {
        setModal({isOpen: true, event, mode});
    }

    const closeModal = () => {
        setModal({isOpen: false, event:null, mode:null});
    }

    useEffect(() => {
        setLoading(true);
        const fetchEvent = async () => {
            try {
                const endpoint = mode === 'archived' ? `/api/archived-events/${slug}` : `/api/events/${slug}`;
                const response = await axiosClient.get(endpoint);
    
                const data = response.data;
                
                if(mode === 'archived'){
                    const isOrganizer = user?.id === data.event.organizer_id;
                    const isAdmin = user?.role === 'admin';

                    if (!isOrganizer && !isAdmin) {
                        toast("You are not permitted to view this archived ritual.", toastConfig);
                        navigate('/');
                        return;
                    }
                }
                setEvent(data.event);
                setVenue(data.venue);
            }catch (error) {
                console.error("Error fetching event details:", error);
                navigate('/not-found');
            }finally {
                setLoading(false);
            }
        }
        const fetchUserStatus = async (eventId) => {
            try{
                const response = await axiosClient.get(`/api/events/${eventId}/status`);
                setActiveStatus(response.data.status);
            }catch(err){
                console.error(err);
            }
        }
        fetchEvent();
        if(event?.id && user && user.role !== 'organizer' && user.role !== 'admin'){
            fetchUserStatus(event.id);
        }
    }, [slug, mode, user, navigate, event?.id]);

    if (loading) return <div className="text-parchment">Consulting the archives...</div>;

    const handleConfirmAction = async () => {
        const {event, mode} = modal;
        try{
            if (mode === 'restore'){
                await axiosClient.post(`/api/events/${event.id}/restore`);
                toast('Ritual restored successfully!', toastConfig);
                navigate('/past-events');
            }else if (mode === 'forceDelete'){
                await axiosClient.delete(`/api/events/${event.id}/force`);
                toast('Ritual restored successfully!', toastConfig);
                navigate('/past-events');
            }else if (mode === 'delete'){
                await axiosClient.delete(`/api/events/${event.id}`);
                toast("Ritual archived successfully!", toastConfig);
                navigate('/past-events');
            }
            
        }catch(err){
            console.error(err);
        }finally{
            closeModal();
        }
    }

    const formatArchiveDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    const handleChangeStatus = async (newStatus) => {
        try{
            const response = await axiosClient.post(`/api/events/${event.id}/status`,{
                status: newStatus
            });
            setActiveStatus(response.data.status);
        }catch(err){
            console.error(err);
        }
    }

  return (
    <div className="w-full min-h-screen bg-secondary-bg text-parchment">
        <EventHero image_url={event?.image_url} />
        

        <div className="relative max-w-6xl mx-auto px-8">
            <div className="absolute left-8 right-8 -top-26.5 z-30 pointer-events-none">
                <EventTab title={event?.title} start_time={event?.start_time} venue_name={venue?.name} mode={mode}/>
            </div>

            <div className="pt-4 pb-20 w-[90%]">
                {(user?.id === event?.organizer_id || user?.role === 'admin') && 
                    <div className={`mb-4 flex ${mode ==='archived' ? 'flex-col' : ''}`}>
                        {mode === 'archived' ? (
                            <>
                                <div className="flex">
                                    <SigilButton text={'Restore Ritual'} onClick={() => openModal(event, 'restore')}/>
                                    <SigilButton text={'Burn Archive'} onClick={() => openModal(event, 'forceDelete')}/>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-[1px] w-8 bg-main-accent"/>
                                    <p className="font-mono text-[10px] text-parchment/60 uppercase tracking-tight">
                                        Archived at: <span className="text-main-accent/80 ml-2">{formatArchiveDate(event?.deleted_at)}</span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
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
                                <SigilButton text={"Archive Ritual"} onClick={() => openModal(event, 'delete')} />
                            </>
                        )}
                    </div>
                }
                {(user?.role !== 'organizer' && user?.role !== 'admin') && (
                    <div className="bg-black/60 mb-8 flex items-center w-fit border border-parchment/10">
                        <button onClick={() => handleChangeStatus('interested')} className={`px-4 py-3 flex items-center border-r border-parchment/10 group transition-all duration-400
                            ${activeStatus === 'interested' ?
                            'bg-main-accent/10 text-main-accent shadow-[inset_0_0_15px_rgba(154,0,0,0.2)]' : 
                            'text-parchment-50 hover:text-parchment hover:bg-parchment/5'}`}>
                            <span className="mr-2 font-[Cinzel] tracking-widest uppercase text-[10px]">
                                Interested
                            </span>
                            <Star size={14} className={`transition-transform duration-300 ${activeStatus === 'interested' ? 'fill-main-accent scale-110' : 'group-hover:scale-110'}`}/>
                        </button>
                        <button onClick={() => handleChangeStatus('going')} className={`px-4 py-3 flex items-center border-r border-parchment/10 group transition-all duration-400
                            ${activeStatus === 'going' ?
                            'bg-main-accent/10 text-main-accent shadow-[inset_0_0_15px_rgba(154,0,0,0.2)]' : 
                            'text-parchment-50 hover:text-parchment hover:bg-parchment/5'}`}>
                            <span className="mr-2 font-[Cinzel] tracking-widest uppercase text-[10px]">
                                Going
                            </span>
                            <CircleCheck size={14} className={`transition-transform duration-300 ${activeStatus === 'going' ? 'scale-110' : 'group-hover:scale-110'}`}/>
                        </button>
                    </div>
                )}

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-4">

                    <EventDescription description={event?.description}/>
                    <VenueDetails venue={venue}/>
                  </div>
               </div>
            </div>
        </div>
        {modal.isOpen && 
            <SigilModal closeModal={() => closeModal()} onAction={() => handleConfirmAction()} text={modal.mode === 'restore' ? "Are you sure you'd like to restore this ritual?" : modal.mode === 'forceDelete' ? "Are you sure you'd like to burn this archive?" : "Are you sure you'd like to archive this ritual?"} />
        }
    </div>
  );
}

export default EventDetails;