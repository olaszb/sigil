import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../services/axios-client";
import Events from "../components/home/Events";
import HeroSection from "../components/home/HeroSection";

const HomePage = () => {
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
    });



    const getEvents = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/api/events?page=${page}`);
            setEvents(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
            });

        }catch (error) {
            console.error("Error fetching events:", error);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEvents();
    }, []);

  return (
    <div className="bg-secondary-bg text-parchment w-full min-h-screen">
        <HeroSection/>  
        <h1 className="text-center font-bold font-[Cinzel] my-10 text-5xl" >Events</h1>
        <Events events={events} type={"current"}/>


        {pagination.last_page > 1 && (
            <div className="flex justify-center items-center">
                <button disabled={pagination.current_page === 1}
                        onClick={() => getEvents(pagination.current_page - 1)} 
                        className="px-4 py-2 border border-parchment/10 hover:border-main-accent disabled:opacity-20 disabled:hover:border-parchment/10 transition-all duration-300"
                        >
                    &lt; Previous
                </button>
                <div className="flex gap-1">
                    {[...Array(pagination.last_page)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button key={pageNum}
                                    onClick={() => getEvents(pageNum)}
                                    className={`w-8 h-8 border transition-all duration-300 ${
                                        pagination.current_page === pageNum
                                        ? 'border-main-accent text-main-accent bg-main-accent/5 shadow-[0_0_10px_rgba(154,0,0,0.2)]'
                                        : 'border-parchment/10 hover:border-parchment/40 text-parchment/60 hover:text-parchment'
                                    }`}>
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button disabled={pagination.current_page === pagination.last_page} 
                        onClick={() => getEvents(pagination.current_page + 1)} 
                        className="px-4 py-2 border border-parchment/10 hover:border-main-accent disabled:opacity-20 disabled:hover:border-parchment/10 transition-all duration-300">
                    Next &gt;
                </button>
            </div>
        )}
            
    </div>
  );
};

export default HomePage;