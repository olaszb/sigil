import { useState } from "react";
import EventHero from "../components/event-details/EventHero";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../services/axios-client";


const PastEventsPage = () => {
    const {user} = useAuth();
    const [pastEvents, setPastEvents] = useState([]);
    const [archivedEvents, setArchivedEvents] = useState([]);

    const getPastEvents = async () => {
        try{
            const response = await axiosClient.get('/api/past-events');
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className="w-full min-h-screen">
            <div className="grayscale">
                <EventHero image_url={"/public/liurnia.webp"}/>
            </div>
            
            {user.role === 'admin' || user.role === 'organizer' ? (
                <div className="w-full flex justify-center my-4">
                    <div className="w-full max-w-md">
                        <div className="flex gap-4">
                            <button className="flex-1 px-4 py-2 border-b border-main-accent text-parchment hover:bg-main-accent/80 transition-colors duration-300 uppercase tracking-widest text-[12px]">
                                Past Events
                            </button>
                            <button className="flex-1 px-4 py-2 border-b border-main-accent text-parchment hover:bg-main-accent/80 transition-colors duration-300 uppercase tracking-widest text-[12px]">
                                Archived Events
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-4xl text-parchment font-[Cinzel] my-8">
                        Past Events
                    </h1>
                </div>
            )

            }
            
        </div>
    );
}

export default PastEventsPage;