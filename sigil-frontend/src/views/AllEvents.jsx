import { useCallback, useEffect, useState } from "react";
import Events from "../components/home/Events";
import SigilHero from "../components/SigilHero";
import axiosClient from "../services/axios-client";
import LoadingScreen from "../components/LoadingScreen";
import { scrollToId } from "../util/helper";

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
    });

    const getEvents = useCallback(async (page = 1) => {
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
            scrollToId("title");
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    if (loading) return <LoadingScreen />;

    return (
        <div className="w-full">
            <div className="grayscale mb-10">
                <SigilHero image_url={"/public/arena.jpg"} title={"The Grand Registry"} />
            </div>

            <Events events={events} type="current"/>

            {pagination.last_page > 1 && (
                <Pagination pagination={pagination} getEvents={getEvents} />
            )}
        </div>
    );
}

export default AllEvents;