import { useEffect, useState } from "react";
import EventHero from "../components/event-details/EventHero";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../services/axios-client";
import Events from "../components/home/Events";


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

    const fetchEvents = async (mode = 'past', page = 1) => {
        setLoading(true);
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
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchEvents(viewMode);
    }, [viewMode]);

    if (loading) return <div className="text-parchment">Consulting the archives...</div>;

    return (
        <div className="w-full min-h-screen text-parchment">
            <div className="grayscale">
                <EventHero image_url={"/public/liurnia.webp"}/>
            </div>
            
            {user?.role === 'admin' || user?.role === 'organizer' ? (
                <div className="w-full flex justify-center my-4">
                    <div className="w-full max-w-md text-center">
                        <h1 className="text-4xl text-parchment font-[Cinzel] my-8">
                            The Archives
                        </h1>
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
            ) : (
                <div className="text-center">
                    <h1 className="text-4xl text-parchment font-[Cinzel] my-8">
                        The Archives
                    </h1>
                </div>
            )
            }
            {events ? (
                <Events events={events} />
            ) : (
                <div className="w-full text-center mb-4">
                    <p className="text-parchment font-[Montserrat] font-[10px] ">There are no recorded events in the archives as of now.</p>
                </div>
            )}

        </div>
    );
}

export default PastEventsPage;