import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import EventHero from "../components/event-details/EventHero";
import EventTab from "../components/event-details/EventTab";
import { useAuth } from "../contexts/AuthContext";
import { CircleCheck, MailWarning, Star } from "lucide-react";
import {toast} from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import EventDescription from "../components/event-details/EventDescription";
import VenueDetails from "../components/event-details/VenueDetails";
import SigilButton from "../components/SigilButton";
import SigilModal from "../components/SigilModal";
import { formatArchiveDate } from "../util/helper";
import CreateComment from "../components/event-details/CreateComment";
import CommentItem from "../components/event-details/CommentItem";
import LoadingScreen from "../components/LoadingScreen";
import TicketSelection from "../components/ticket-selection/TicketSelection";

const EventDetails = ({ mode }) => {
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState({isOpen: false, event:null, mode:null});
    const [ticketModal, setTicketModal] = useState({isOpen: false, event:null});
    const [activeStatus, setActiveStatus] = useState(null);
    const [isCommentClicked, setIsCommentClicked] = useState(false);
    const [comments, setComments] = useState([]);
    const location = useLocation();

    const openModal = (event, mode) => {
        setModal({isOpen: true, event, mode});
    }

    const closeModal = () => {
        setModal({isOpen: false, event:null, mode:null});
    }

    const openTicketModal = () => {
        setTicketModal({isOpen: true, event, mode});
    }

    const closeTicketModal = () => {
        setTicketModal({isOpen: false, event:null, mode:null});
    }

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                let endpoint;
                if (mode === 'archived') {
                    endpoint = `/api/archived-events/${slug}`;
                } else if (mode === 'past') {
                    endpoint = `/api/past-events/${slug}`;
                } else {
                    endpoint = `/api/events/${slug}`;
                }
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
        };
        fetchEvents();
    }, [slug, mode, user, navigate]);

    useEffect(() => {
        if (!event?.id || !user || user.role === 'organizer' || user.role === 'admin') return;

        const fetchUserStatus = async () => {
            try {
                const response = await axiosClient.get(`/api/events/${event.id}/status`);
                setActiveStatus(response.data.status);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserStatus();
    }, [event?.id, user]);

    useEffect(() => {
        if (!event?.id) return;
        const fetchComments = async (eventId) => {
            try{
                const response = await axiosClient.get(`/api/events/${eventId}/comments`);
                setComments(response.data);
            }catch(err){
                console.error(err);
            }
        }
        fetchComments(event.id);
    }, [event?.id]);

    useEffect(() => {
        if (location.hash && comments.length > 0) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.classList.add("bg-main-accent/5");
                    setTimeout(() => element.classList.remove("bg-main-accent/5"), 2000);
                }, 500);
            }
        }
    }, [location.hash, comments]);

    const handleCommentUpdated = (updatedComment) => {
        setComments(prevComments => prevComments.map(comment => comment.id === updatedComment.id ? updatedComment : comment));
    }

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

    const handleChangeStatus = async (newStatus) => {
        if (user && user.email_verified_at === null) {
            toast("Your identity is unverified. Check your email to unlock this ritual.", toastConfig);
            return;
        }
        try{
            const response = await axiosClient.post(`/api/events/${event.id}/status`,{
                status: newStatus
            });
            setActiveStatus(response.data.status);
        }catch(err){
            console.error(err);
        }
    }
    const handleCommentSubmit = async (e, commentText) => {
        e.preventDefault();

        if (user && user.email_verified_at === null) {
            toast.error("Unverified users cannot cast whispers.", toastConfig);
            return;
        }

        const text = commentText.trim();
        if(!text) return;

        try{
            await axiosClient.post(`/api/events/${event.id}/comments`, {
                comment: text
            });
            toast("Whisper cast successfully!", toastConfig);
            e.target.reset();
            setIsCommentClicked(false);

            const response = await axiosClient.get(`/api/events/${event.id}/comments`);
            setComments(response.data);
        }catch(err){
            console.error(err);
            toast("Failed to cast whisper. Please try again.", toastConfig);
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await axiosClient.delete(`/api/comments/${commentId}`);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
            toast("Whisper banished successfully!", toastConfig);
        }catch (err) {
            toast("Failed to banish whisper.", toastConfig);
            console.error("Failed to delete comment:", err);
        }
    };

    if (loading) return <LoadingScreen />;
  return (
    <div className="w-full min-h-screen bg-secondary-bg text-parchment">
        <EventHero image_url={event?.image_url} />
        

        <div className="relative max-w-6xl mx-auto px-0 md:px-8">
            <div className="relative lg:absolute left-0 lg:left-8 right-0 lg:right-8 lg:-top-26.5 z-30 pointer-events-none">
                <EventTab title={event?.title} start_time={event?.start_time} venue_name={venue?.name} mode={mode} openModal={openTicketModal}/>
            </div>

            <div className="pt-8 lg:pt-4 pb-20 w-full md:w-[80%] lg:w-[90%] px-4 lg:px-0 mx-auto lg:mx-0">
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
                {(user?.role !== 'organizer' && user?.role !== 'admin' && mode === 'current') && (
                    <div className="bg-black/60 mb-8 flex items-center w-fit border border-parchment/10 ">
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

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  <div className="lg:col-span-2 space-y-8 lg:space-y-4">

                    <EventDescription description={event?.description}/>
                    <VenueDetails venue={venue} interestedCount={event?.interested_count} goingCount={event?.going_count}/>
                    
                    <section>
                        <div className="flex items-center w-full">
                            <h2 className="text-main-accent font-[Cinzel] text-xl">Comments</h2>
                            <div className="h-[1px] w-full bg-gradient-to-r from-parchment/20 to-transparent" />
                        </div>
                        {user && (
                            <div>
                                {mode !== 'archived' ? (
                                    <>
                                        {user.email_verified_at ? (
                                            <CreateComment 
                                                eventId={event?.id} 
                                                onCommentAdded={handleCommentSubmit} 
                                                isCommentClicked={isCommentClicked} 
                                                setIsCommentClicked={setIsCommentClicked}
                                            />
                                        ) : (
                                            <div className="p-4 border border-main-accent/30 bg-[#1a0505] flex items-center gap-4">
                                                <MailWarning className="text-main-accent shrink-0" size={24} />
                                                <div>
                                                    <h3 className="text-sm font-[Cinzel] text-main-accent uppercase tracking-wider mb-1">Silence is Enforced</h3>
                                                    <p className="text-xs font-[Montserrat] text-parchment/70">
                                                        Your identity is unverified. Please check your email and verify your sigil to cast whispers.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-main-accent/40 my-4 italic">
                                        This ritual is archived. No further whispers may be cast.
                                    </p>
                                )}
                                <div>
                                    {comments && comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <CommentItem key={comment.id} comment={comment} handleDelete={handleDeleteComment} type={"eventDetails"} onCommentUpdated={handleCommentUpdated}/>
                                        ))
                                     ) : (
                                        <p className="text-parchment/50 italic mt-4">No whispers have been cast yet...</p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                    </section>
                  </div>
               </div>
            </div>
        </div>
        {modal.isOpen && 
            <SigilModal closeModal={() => closeModal()} onAction={() => handleConfirmAction()} text={modal.mode === 'restore' ? "Are you sure you'd like to restore this ritual?" : modal.mode === 'forceDelete' ? "Are you sure you'd like to burn this archive?" : "Are you sure you'd like to archive this ritual?"} />
        }
        {ticketModal.isOpen &&
            <TicketSelection closeModal={() => closeTicketModal()} event={event} />
        }
    </div>
  );
}

export default EventDetails;