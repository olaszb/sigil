import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import EventHero from "../components/event-details/EventHero";
import EventTab from "../components/event-details/EventTab";
import EditorRenderer from "../components/create-event/Editor/EditorRenderer";

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();

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
        

        <div className="relative max-w-6xl mx-auto px-8">
            <div className="absolute left-8 right-8 -top-26.5 z-30">
                <EventTab title={event?.title} start_time={event?.start_time} venue_name={venue?.name}/>
            </div>

            <div className="pt-10 pb-20"> 
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2">
                      <h2 className="text-main-accent font-[Cinzel] text-xl mb-4 border-b border-parchment/10 pb-2">
                        Ritual Description
                      </h2>
                      {event?.description ? (
                        <EditorRenderer jsonContent={event.description} />
                        ) : (
                        <p className="italic opacity-30">The records for this ritual are blank...</p>
                      )}
                  </div>
               </div>
            </div>
        </div>
    </div>
  );
}

export default EventDetails;