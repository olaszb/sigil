import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";

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
                console.log("Fetched event details:", data.event);
                console.log("Fetched venue details:", data.venue);
            }catch (error) {
                console.error("Error fetching event details:", error);
            }finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [slug]);

  return (
    <div className="event-details-container">
      <h1>Event Details</h1>
      {/* Event details content goes here */}

    </div>
  );
}

export default EventDetails;