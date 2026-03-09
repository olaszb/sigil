import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../services/axios-client";
import Events from "../components/home/Events";
import HeroSection from "../components/home/HeroSection";
import Pagination from "../components/Pagination";

const HomePage = () => {
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
    });

    const scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const getEvents = useCallback( async (page = 1) => {
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
            setTimeout(() => scrollToId("title"), 100);
        }catch (error) {
            console.error("Error fetching events:", error);
        }finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getEvents();
    }, [getEvents]);


  return (
    <div className="bg-secondary-bg text-parchment w-full min-h-screen">
        <HeroSection/>  
        <h1 id="title" className="text-center font-bold font-[Cinzel] my-10 text-5xl" >Events</h1>
        <Events events={events} type={"current"}/>


        {pagination.last_page > 1 && (
            <Pagination pagination={pagination} getEvents={getEvents} />
        )}
            
    </div>
  );
};

export default HomePage;