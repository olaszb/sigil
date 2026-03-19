import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../services/axios-client";
import Events from "../components/home/Events";
import { toastConfig } from "../util/toastConfig";
import { toast } from "react-toastify";
import SigilModal from "../components/SigilModal";
import { scrollToId } from "../util/helper";
import Pagination from "../components/Pagination";
import LoadingScreen from "../components/LoadingScreen";
import SigilHero from "../components/SigilHero";

const PastEventsPage = () => {
    const {user} = useAuth();
    const [events, setEvents] = useState([]);
    const [viewMode, setViewMode] = useState('past');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
    });
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({isOpen: false, event:null, mode:null})

    const fetchEvents = useCallback( async (mode = 'past', page = 1) => {
        setLoading(true);
        setEvents([]);
        try{
            const endpoint = mode === 'archived' ? '/api/archived-events' : '/api/past-events';
            const response = await axiosClient.get(`${endpoint}?page=${page}`);
            setEvents(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
            });

            scrollToId("title");
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchEvents(viewMode);
    }, [viewMode, fetchEvents]);

    const openModal = (event, mode) => {
        setModal({isOpen: true, event, mode});
    }

    const closeModal = () => {
        setModal({isOpen: false, event:null, mode:null});
    }

    const handleConfirmAction = async () => {
        const {event, mode} = modal;
        try{
            if (mode === 'restore'){
                await axiosClient.post(`/api/events/${event.id}/restore`);
                toast('Ritual restored successfully!', toastConfig);
            }else if (mode === 'forceDelete'){
                await axiosClient.delete(`/api/events/${event.id}/force`);
                toast('Archive burned successfully!', toastConfig);
            }
            fetchEvents(viewMode);
        }catch(err){
            console.error(err);
        }finally{
            closeModal();
        }
    }

    if (loading) return <LoadingScreen />;
    

    return (
        <div className="w-full min-h-screen text-parchment">
            <div className="grayscale mb-10">
                <SigilHero image_url={"/library.webp"} title={"The Archives"} />
            </div>
            
            {(user?.role === 'admin' || user?.role === 'organizer') && (
                <div className="w-full flex justify-center my-4">
                    <div className="w-full max-w-md text-center">
                        <div className="flex gap-4">
                            <button onClick={() => setViewMode('past')} 
                                className={`flex-1 px-4 py-2 border-b border-main-accent text-parchment hover:bg-main-accent/80 transition-colors duration-300 uppercase tracking-widest text-[12px] ${viewMode === 'past' ? 'bg-main-accent' : ''} `}
                                >
                                Past Events
                            </button>
                            <button onClick={() => setViewMode('archived')} className={`flex-1 px-4 py-2 border-b border-main-accent text-parchment hover:bg-main-accent/80 transition-colors duration-300 uppercase tracking-widest text-[12px] ${viewMode === 'archived' ? 'bg-main-accent' : ''}`}>
                                Archived Events
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="relative min-h-[400px] px-4"> 
                <div className={`transition-opacity duration-500 ${loading ? 'opacity-20' : 'opacity-100'}`}>
                    {events?.length > 0 ? (
                        <Events events={events} type={viewMode} onAction={openModal}/>
                    ) : !loading && (
                        <div className="w-full text-center py-20">
                            <p className="text-parchment/40 italic font-[Montserrat] text-sm">
                                No records found in this section of the archives.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {pagination.last_page > 1 && (
                <Pagination pagination={pagination} getEvents={fetchEvents} />
            )}
            {modal.isOpen && (
                <SigilModal closeModal={() => closeModal()} onAction={() => handleConfirmAction()} text={modal.mode === 'restore' ? "Are you sure you'd like to restore this ritual?" : "Are you sure you'd like to burn this archive?"} />
            )}
        </div>
    );
}

export default PastEventsPage; 