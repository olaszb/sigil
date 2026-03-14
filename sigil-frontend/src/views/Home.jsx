import { useCallback, useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import Events from "../components/home/Events";
import HeroSection from "../components/home/HeroSection";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";
import BoxButton from "../components/BoxButton"

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const getInitialData = useCallback( async () => {
        setLoading(true);
        try {
            const [featuredRes, upcomingRes, regularRes] = await Promise.all([
                axiosClient.get("/api/events/featured"),
                axiosClient.get("/api/events/upcoming"),
                axiosClient.get("/api/events/first-five")
            ])
            setFeaturedEvents(featuredRes.data);
            setUpcomingEvents(upcomingRes.data);
            setEvents(regularRes.data);
        }catch (error) {
            console.error("Error fetching events:", error);
        }finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getInitialData();
    }, [getInitialData]);

    const getEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/api/events/first-five`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <LoadingScreen />;

  return (
    <div className="bg-secondary-bg text-parchment w-full min-h-screen">
        <HeroSection featuredEvents={featuredEvents} upcomingEvents={upcomingEvents}/>  
        <h1 id="title" className="text-center font-bold font-[Cinzel] my-10 text-5xl" >Events</h1>
        <Events events={events} type="current"/>

        <div className="flex justify-center items-center mb-8">
            <Link to={"/events"}>
                <BoxButton text={"View More"}/>
            </Link>

        </div>
            
    </div>
  );
};

export default HomePage;