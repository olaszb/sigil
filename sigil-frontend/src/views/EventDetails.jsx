import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import EventHero from "../components/event-details/EventHero";
import EventTab from "../components/event-details/EventTab";

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();



    // Fetch event details and venue information using the event ID from the URL
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

  return (
    <div className="w-full min-h-screen bg-secondary-bg text-parchment">
        <EventHero title={event?.title} image_url={event?.image_url} start_time={event?.start_time} />

        <EventTab title={event?.title} start_time={event?.start_time} venue_name={venue?.name}/>
    </div>
  );
}

export default EventDetails;